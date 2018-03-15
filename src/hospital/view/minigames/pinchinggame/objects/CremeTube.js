"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AssetLoader_1 = require("../../../../utils/AssetLoader");
var CremeBlob_1 = require("./CremeBlob");
var TouchLoudEvent_1 = require("../../../../../loudmotion/events/TouchLoudEvent");
var SpriteHelper_1 = require("../../../../../loudmotion/utils/SpriteHelper");
var pixi_js_1 = require("pixi.js");
var Logger_1 = require("../../../../../loudmotion/utils/debug/Logger");
var AudioPlayer_1 = require("../../../../../loudmotion/utils/AudioPlayer");
var Config_1 = require("../../../../Config");
var HospitalGameView_1 = require("../../../HospitalGameView");
var CremeTube = /** @class */ (function (_super) {
    __extends(CremeTube, _super);
    function CremeTube(contaminatedAreas, contaminatedAreaRemovedCallback) {
        var _this = _super.call(this) || this;
        // public setPivotXY(amt:number = .5):void{
        // 	this.pivot.set(this.tubeImage.width * amt, this.tubeImage.height * amt);
        // }
        _this.onEnterFrame = function (deltaTime) {
            _this.checkElapsed();
        };
        _this.onSprayingTimer = function (deltaTime) {
            Logger_1.Logger.log(_this, "CremeTube onSprayingTimer   this.cremeBlobsPool.length ==== " + _this.cremeBlobsPool.length);
            if (_this.cremeBlobsPool.length > 0) {
                var nextBlob = _this.cremeBlobsPool.shift();
                nextBlob.x = -50;
                nextBlob.y = -50;
                nextBlob.rotation = (Math.random() * 360 * (Math.PI / 180));
                _this.creamTarget.addChild(nextBlob);
                _this.blobsToAnimate.push(nextBlob);
                _this.checkCollisionWithContaminatedAreas(nextBlob);
            }
        };
        _this.animateBlops = function (deltaTime) {
            var blobsToAnimateLength = _this.blobsToAnimate.length;
            if (_this.sprayingStopped && blobsToAnimateLength == 0) {
                pixi_js_1.ticker.shared.remove(_this.animateBlops, _this);
            }
            else {
                for (var i = blobsToAnimateLength - 1; i >= 0; i--) {
                    var nextBlob = _this.blobsToAnimate[i];
                    nextBlob.alpha -= _this.elapsed * 5;
                    if (nextBlob.alpha > 0.7) {
                        nextBlob.scale.x = nextBlob.scale.y += _this.elapsed * 3;
                    }
                    else {
                        nextBlob.scale.x = nextBlob.scale.y -= _this.elapsed * 3;
                    }
                    if (nextBlob.alpha <= 0) {
                        _this.blobsToAnimate.splice(i, 1);
                        _this.cremeBlobsPool.push(nextBlob);
                        nextBlob.x = -2000;
                        nextBlob.alpha = 1;
                        nextBlob.scale.x = nextBlob.scale.y = 1;
                    }
                }
            }
        };
        _this.touchDown = function (event) {
            _this.mouseDown = true;
            Logger_1.Logger.log(_this, "CremeTube touchDown");
            var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
            _this.x = mousePositionCanvas.x;
            _this.y = mousePositionCanvas.y;
            _this.startSpraying();
            try {
                pixi_js_1.ticker.shared.remove(_this.animateBlops, _this);
            }
            catch (error) {
                Logger_1.Logger.log(_this, "CATCH CremeTube ticker.shared.remove( this.animateBlops, this )");
            }
            pixi_js_1.ticker.shared.add(_this.animateBlops, _this);
        };
        _this.touchMove = function (event) {
            if (_this.mouseDown) {
                var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
                _this.x = Math.abs(mousePositionCanvas.x);
                _this.y = Math.abs(mousePositionCanvas.y);
            }
        };
        _this.touchDone = function (event) {
            _this.mouseDown = false;
            _this.stopSpraying();
            if (_this.allContaminatedAreasRemoved()) {
                Logger_1.Logger.log(_this, "CremeTube allContaminatedAreasRemoved *****************************");
                pixi_js_1.ticker.shared.remove(_this.onSprayingTimer, _this);
                _this.off(TouchLoudEvent_1.TouchEvent.TOUCH, _this.touchDown);
                _this.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, _this.touchDone);
                _this.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, _this.touchMove);
                AudioPlayer_1.AudioPlayer.getInstance().stopSound("salve_loop");
                if (_this.contaminatedAreaRemovedCallback != null) {
                    _this.contaminatedAreaRemovedCallback();
                    _this.contaminatedAreaRemovedCallback = null;
                }
            }
        };
        _this.interactive = true;
        _this.buttonMode = true;
        _this.contaminatedAreas = contaminatedAreas;
        _this.contaminatedAreaRemovedCallback = contaminatedAreaRemovedCallback;
        _this.onAddedToStage();
        return _this;
    }
    CremeTube.prototype.onAddedToStage = function () {
        this.createTubeArt();
        this.cremeBlobsPool = []; //new Vector.<CremeBlob>();
        for (var i = 0; i < 200; i++) {
            var blob = new CremeBlob_1.CremeBlob();
            this.cremeBlobsPool.push(blob);
            this.creamTarget.addChild(blob);
            blob.x = -2000;
        }
        this.blobsToAnimate = []; //new Vector.<CremeBlob>();
        this.on(TouchLoudEvent_1.TouchEvent.TOUCH, this.touchDown);
        this.on(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.touchDone);
        this.on(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.touchMove);
    };
    Object.defineProperty(CremeTube.prototype, "width", {
        get: function () {
            return this.tubeImage.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CremeTube.prototype, "height", {
        get: function () {
            return this.tubeImage.height;
        },
        enumerable: true,
        configurable: true
    });
    CremeTube.prototype.checkCollisionWithContaminatedAreas = function (blob) {
        var contaminatedAreasLength = this.contaminatedAreas.length;
        for (var i = 0; i < contaminatedAreasLength; i++) {
            var currentContaminatedArea = this.contaminatedAreas[i];
            if (currentContaminatedArea.alpha > (CremeTube.ALPHA_MINIMUM - .03)) {
                var hit = SpriteHelper_1.SpriteHelper.hitTest(blob.getBounds(), currentContaminatedArea.getBounds());
                if (hit) {
                    this.contaminatedArea = currentContaminatedArea;
                    this.contaminatedArea.alpha -= 0.02;
                }
            }
        }
    };
    CremeTube.prototype.allContaminatedAreasRemoved = function () {
        var toReturn = true;
        var contaminatedAreasLength = this.contaminatedAreas.length;
        for (var i = 0; i < contaminatedAreasLength; i++) {
            var currentContaminatedArea = this.contaminatedAreas[i];
            if (currentContaminatedArea.alpha > CremeTube.ALPHA_MINIMUM) {
                toReturn = false;
            }
        }
        return toReturn;
    };
    CremeTube.prototype.startSpraying = function () {
        try {
            pixi_js_1.ticker.shared.remove(this.onEnterFrame, this);
            pixi_js_1.ticker.shared.remove(this.onSprayingTimer, this);
        }
        catch (error) {
            Logger_1.Logger.log(this, "CATCH ticker.shared.remove( this.onEnterFrame, this )");
        }
        pixi_js_1.ticker.shared.add(this.onEnterFrame, this);
        pixi_js_1.ticker.shared.add(this.onSprayingTimer, this);
        this.sprayingStopped = false;
        AudioPlayer_1.AudioPlayer.getInstance().playSound("salve_loop", 0, Config_1.Config.SPEAK_VOLUME_LEVEL);
    };
    CremeTube.prototype.stopSpraying = function () {
        pixi_js_1.ticker.shared.remove(this.onEnterFrame, this); //TODO temp taken out
        pixi_js_1.ticker.shared.remove(this.onSprayingTimer, this);
        this.sprayingStopped = true;
        AudioPlayer_1.AudioPlayer.getInstance().stopSound("salve_loop");
    };
    CremeTube.prototype.createTubeArt = function () {
        this.tubeImage = pixi_js_1.Sprite.fromFrame("insektstik_tube");
        this.addChild(this.tubeImage);
        this.pivot.x = this.tubeImage.width * .5;
        this.pivot.y = this.tubeImage.height * .5;
        this.rectCover = new pixi_js_1.Graphics(); //TODO temp to check area
        this.rectCover.beginFill(0xFFFFFF);
        this.rectCover.alpha = HospitalGameView_1.HospitalGameView.RECT_COVER_ALPHA;
        this.addChild(this.rectCover);
        this.rectCover.drawRect(this.tubeImage.x, this.tubeImage.y, this.tubeImage.width, this.tubeImage.height);
        this.rotation = CremeTube.CREME_ROTATION;
        this.creamTarget = new pixi_js_1.Sprite();
        // this.addChild(this.creamTarget);
        this.tubeImage.addChild(this.creamTarget);
        this.creamTarget.y += this.tubeImage.height * .5 + 30;
        this.x = 630;
        this.y = 700;
    };
    CremeTube.prototype.checkElapsed = function () {
        this.timePrevious = this.timeCurrent;
        this.timeCurrent = new Date().getTime();
        this.elapsed = (this.timeCurrent - this.timePrevious) * 0.0005;
    };
    CremeTube.prototype.destroy = function () {
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.touchDown);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.touchMove);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.touchDone);
        try {
            pixi_js_1.ticker.shared.remove(this.onEnterFrame, this);
            pixi_js_1.ticker.shared.remove(this.onSprayingTimer, this);
        }
        catch (error) {
            Logger_1.Logger.log(this, "CATCH ticker.shared.remove( this.onEnterFrame, this )");
        }
        try {
            pixi_js_1.ticker.shared.remove(this.animateBlops, this);
        }
        catch (error) {
            Logger_1.Logger.log(this, "CATCH CremeTube ticker.shared.remove( this.animateBlops, this )");
        }
        if (this.tubeImage != null) {
            if (this.creamTarget != null) {
                this.tubeImage.removeChild(this.creamTarget);
                this.creamTarget = null;
            }
            this.removeChild(this.tubeImage);
            this.tubeImage = null;
        }
        if (this.rectCover != null) {
            this.removeChild(this.rectCover);
            this.rectCover = null;
        }
        if (this.contaminatedAreaRemovedCallback != null) {
            this.contaminatedAreaRemovedCallback();
            this.contaminatedAreaRemovedCallback = null;
        }
    };
    // private sndMan:SoundManager;
    CremeTube.CREME_ROTATION = (60 * (Math.PI / 180));
    CremeTube.ALPHA_MINIMUM = 0.1;
    return CremeTube;
}(pixi_js_1.Sprite));
exports.CremeTube = CremeTube;
//# sourceMappingURL=CremeTube.js.map
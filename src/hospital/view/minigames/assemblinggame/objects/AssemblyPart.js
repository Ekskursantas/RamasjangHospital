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
var pixi_js_1 = require("pixi.js");
var signals_js_1 = require("signals.js");
var Logger_1 = require("../../../../../loudmotion/utils/debug/Logger");
var TouchLoudEvent_1 = require("../../../../../loudmotion/events/TouchLoudEvent");
var AssemblingGameView_1 = require("../AssemblingGameView");
var HospitalGameView_1 = require("../../../HospitalGameView");
var AssemblyPart = /** @class */ (function (_super) {
    __extends(AssemblyPart, _super);
    // private timer:Timer; //TODO
    function AssemblyPart(texture, initialPosition, type) {
        var _this = _super.call(this) || this;
        _this.touchDown = function (event) {
            _this.mouseDown = true;
            _this.parent.setChildIndex(_this, _this.parent.children.length - 1);
            var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
            var mousePosition = event.data.getLocalPosition(_this);
            _this.x = mousePositionCanvas.x;
            _this.y = mousePositionCanvas.y;
            _this.assemblyPartSprite.y = -AssemblingGameView_1.AssemblingGameView.PART_TOUCH_OFFSET;
            _this.signalPart.dispatch(_this);
        };
        _this.touchMove = function (event) {
            if (_this.mouseDown) {
                var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
                var mousePosition = event.data.getLocalPosition(_this);
                _this.x = Math.abs(mousePositionCanvas.x);
                _this.y = Math.abs(mousePositionCanvas.y);
            }
        };
        _this.touchDone = function (event) {
            Logger_1.Logger.log(_this, "AssemblyPart touchDone  event.type == " + event.type);
            _this.mouseDown = false;
            // this.pieceImage.pivot.y = 0;
            // TweenLite.to(this.assemblyPartSprite, 0.4, {y:0}); //TODO do we need this 
            _this.signalPartTouchDone.dispatch();
        };
        // private rotateRandomly(event:TimerEvent):void{
        _this.rotateRandomly = function () {
            //			Logger.log(this, "nextMovingAngle: " + nextMovingAngle);
            if (_this.nextMovingAngle < 0) {
                _this.nextMovingAngle = Math.random() * .3 + .2;
            }
            else {
                _this.nextMovingAngle = -Math.random() * .3 - .2;
            }
            //			TweenLite.to(this, .5, {rotation:nextMovingAngle});
            TweenLite.to(_this, _this.nextMovingAngle * 10, { rotation: _this.nextMovingAngle });
        };
        _this.textureName = texture;
        _this._initialPosition = initialPosition;
        _this._type = type;
        // addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
        _this.onAddedToStage();
        return _this;
    }
    Object.defineProperty(AssemblyPart.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssemblyPart.prototype, "initialPosition", {
        get: function () {
            return this._initialPosition;
        },
        enumerable: true,
        configurable: true
    });
    AssemblyPart.prototype.onAddedToStage = function () {
        this.interactive = true;
        this.buttonMode = true;
        this.signalPart = new signals_js_1.Signal();
        this.signalPartTouchDone = new signals_js_1.Signal();
        this.createAssemblyPartArt();
        this.pivot.set(this.assemblyPartSprite.width * .5, this.assemblyPartSprite.height * .5);
        this.x = this.initialPosition.x;
        this.y = this.initialPosition.y;
        this.on(TouchLoudEvent_1.TouchEvent.TOUCH, this.touchDown);
        this.on(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.touchDone);
        this.on(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.touchMove);
        this.rotateRandomly();
        // this.timer = new Timer(1000, 999); //TODO
        // this.timer.addEventListener(TimerEvent.TIMER, rotateRandomly);
    };
    AssemblyPart.prototype.createAssemblyPartArt = function () {
        this.assemblyPartSprite = pixi_js_1.Sprite.fromFrame(this.textureName);
        this.addChild(this.assemblyPartSprite);
        this.rectCover = new pixi_js_1.Graphics(); //TODO temp to check area
        this.rectCover.beginFill(0x444444);
        this.rectCover.alpha = HospitalGameView_1.HospitalGameView.RECT_COVER_ALPHA;
        this.addChild(this.rectCover);
        this.rectCover.drawRect(this.assemblyPartSprite.x, this.assemblyPartSprite.y, this.assemblyPartSprite.width, this.assemblyPartSprite.height);
    };
    AssemblyPart.prototype.startMovingRandomly = function () {
        //			Logger.log(this, "AssemblyPart.startMovingRandomly()");
        this.nextMovingAngle = Math.random() * .2;
        this.rotateRandomly();
        // this.timer.start(); //TODO
    };
    AssemblyPart.prototype.stopMovingRandomly = function () {
        //			Logger.log(this, "AssemblyPart.stopMovingRandomly()");
        // 		this.timer.stop(); //TODO
        TweenLite.to(this, .3, { rotation: 0 });
    };
    AssemblyPart.prototype.destroy = function () {
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.touchDown);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.touchDone);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.touchMove);
    };
    return AssemblyPart;
}(pixi_js_1.Sprite));
exports.AssemblyPart = AssemblyPart;
//# sourceMappingURL=AssemblyPart.js.map
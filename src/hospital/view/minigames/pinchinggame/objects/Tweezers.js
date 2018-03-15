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
var TouchLoudEvent_1 = require("../../../../../loudmotion/events/TouchLoudEvent");
var SpriteHelper_1 = require("../../../../../loudmotion/utils/SpriteHelper");
var Logger_1 = require("../../../../../loudmotion/utils/debug/Logger");
var HospitalEvent_1 = require("../../../../event/HospitalEvent");
var pixi_js_1 = require("pixi.js");
var AudioPlayer_1 = require("../../../../../loudmotion/utils/AudioPlayer");
var Helper_1 = require("../../../../../loudmotion/utils/Helper");
var HospitalGameView_1 = require("../../../HospitalGameView");
var Tweezers = /** @class */ (function (_super) {
    __extends(Tweezers, _super);
    function Tweezers() {
        var _this = _super.call(this) || this;
        _this.allAreaTouchIdleDown = function (event) {
            _this.allAreaIdleMouseDown = true;
            _this.pivot.x = 0;
            _this.pivot.y = 0;
            var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
            _this.x = mousePositionCanvas.x;
            _this.y = mousePositionCanvas.y;
        };
        _this.allAreaTouchIdleMove = function (event) {
            if (_this.allAreaIdleMouseDown) {
                var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
                _this.x = Math.abs(mousePositionCanvas.x);
                _this.y = Math.abs(mousePositionCanvas.y);
                var checkCollision = void 0;
                checkCollision = _this.checkCollisionWithTargets(_this.pinchingTarget, _this._targetAreas);
                if (checkCollision) {
                    _this.alpha = .6;
                }
                else {
                    _this.alpha = 1;
                }
            }
        };
        _this.allAreaTouchIdleDone = function (event) {
            _this.allAreaIdleMouseDown = false;
            if (_this.alpha < 1) {
                _this.state = Tweezers.PLACED;
                _this.alpha = 1;
                if (_this.currentTargetIndex > -1) {
                    _this._targets.splice(_this.currentTargetIndex, 1);
                    _this._targetAreas.splice(_this.currentTargetIndex, 1);
                }
                _this.x = _this._target.x;
                _this.y = _this._target.y;
            }
        };
        _this.allAreaTouchClosedDown = function (event) {
            _this.allAreaClosedMouseDown = true;
            var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
            _this.lastTouchXAll = mousePositionCanvas.x;
        };
        _this.allAreaTouchClosedMove = function (event) {
            if (_this.allAreaClosedMouseDown) {
                var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
                _this.previousTouchXAll = _this.lastTouchXAll || 0;
                _this.lastTouchXAll = mousePositionCanvas.x;
                var touchDistanceMoved = _this.lastTouchXAll - _this.previousTouchXAll;
                // Pull out if dragged in the right direction only
                if (touchDistanceMoved > 0) {
                    _this.x += Math.cos(_this.rotation - Math.PI) * touchDistanceMoved;
                    _this.y += Math.sin(_this.rotation - Math.PI) * touchDistanceMoved;
                }
                var distanceStartingPoint = Helper_1.Helper.lineDistance(new pixi_js_1.Point(_this.x, _this.y), _this.targetStartingPoint);
                var distanceMoved = _this.pinchingPoint.x - distanceStartingPoint;
                if (distanceStartingPoint > 50) {
                    Logger_1.Logger.log(_this, "Tweezer PICKED");
                    _this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH, _this.allAreaTouchClosedDown);
                    _this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, _this.allAreaTouchClosedMove);
                    _this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, _this.allAreaTouchClosedDone);
                    _this.removeChild(_this._target);
                    _this.removeChild(_this._targetArea);
                    _this.emit(HospitalEvent_1.HospitalEvent.CONTAMINANT_REMOVED);
                    _this.state = Tweezers.IDLE;
                    _this.tweezerTop.rotation = Tweezers.TWEEZER_TOP_OPEN_ROTATION;
                    _this.tweezerBottom.rotation = Tweezers.TWEEZER_BOTTOM_OPEN_ROTATION;
                    AudioPlayer_1.AudioPlayer.getInstance().playSound("pop");
                }
            }
        };
        _this.allAreaTouchClosedDone = function (event) {
            Logger_1.Logger.log(_this, "Tweezers allAreaTouchClosedDone  event.type == " + event.type);
            _this.allAreaClosedMouseDown = false;
            Logger_1.Logger.log(_this, "Tweezers allAreaTouchClosedDone this.x == " + _this.x + " :  this.y == " + _this.y);
        };
        _this.topAreaTouchDown = function (event) {
            _this.topAreaMouseDown = true;
            var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
            _this.lastTouchYTop = mousePositionCanvas.y;
        };
        _this.topAreaTouchMove = function (event) {
            if (_this.topAreaMouseDown) {
                var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
                _this.previousTouchYTop = _this.lastTouchYTop || 0;
                _this.lastTouchYTop = mousePositionCanvas.y;
                var newRotation = _this.tweezerTop.rotation + (_this.previousTouchYTop - _this.lastTouchYTop) * (Math.PI / 180) / 2;
                if (newRotation > Tweezers.TWEEZER_TOP_OPEN_ROTATION && newRotation < 0) {
                    _this.tweezerTop.rotation = newRotation;
                }
                var rotateTo = (-10 * (Math.PI / 180));
                if (_this.tweezerTop.rotation > rotateTo) {
                    _this.tweezerTop.rotation = -0.08 * (Math.PI / 180);
                    _this.tweezerBottom.rotation = 0.08 * (Math.PI / 180);
                    _this.state = Tweezers.CLOSED;
                    _this.addChild(_this._target);
                    _this._target.x = _this.pinchingPoint.x;
                    _this._target.y = _this.pinchingPoint.y;
                    _this._target.rotation -= _this.rotation;
                }
            }
        };
        _this.topAreaTouchDone = function (event) {
            _this.topAreaMouseDown = false;
            _this.tweezerTop.rotation = Tweezers.TWEEZER_TOP_OPEN_ROTATION;
        };
        _this.bottomAreaTouchDown = function (event) {
            _this.bottomAreaMouseDown = true;
            var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
            _this.lastTouchYBottom = mousePositionCanvas.y;
        };
        _this.bottomAreaTouchMove = function (event) {
            if (_this.bottomAreaMouseDown) {
                var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
                _this.previousTouchYBottom = _this.lastTouchYBottom || 0;
                _this.lastTouchYBottom = mousePositionCanvas.y;
                var newRotation = _this.tweezerBottom.rotation + (_this.previousTouchYBottom - _this.lastTouchYBottom) * (Math.PI / 180) / 2;
                if (newRotation < Tweezers.TWEEZER_BOTTOM_OPEN_ROTATION && newRotation > 0) {
                    _this.tweezerBottom.rotation = newRotation;
                }
                var rotateTo = (10 * (Math.PI / 180));
                if (_this.tweezerBottom.rotation < rotateTo) {
                    _this.tweezerTop.rotation = -0.08 * (Math.PI / 180);
                    _this.tweezerBottom.rotation = 0.08 * (Math.PI / 180);
                    _this.state = Tweezers.CLOSED;
                    _this.addChild(_this._target);
                    _this._target.x = _this.pinchingPoint.x;
                    _this._target.y = _this.pinchingPoint.y;
                    _this._target.rotation -= _this.rotation;
                }
            }
        };
        _this.bottomAreaTouchDone = function (event) {
            Logger_1.Logger.log(_this, "Tweezers touchDone  event.type == " + event.type);
            _this.bottomAreaMouseDown = false;
            Logger_1.Logger.log(_this, "Tweezers touchDone this.x == " + _this.x + " :  this.y == " + _this.y);
            _this.tweezerBottom.rotation = Tweezers.TWEEZER_BOTTOM_OPEN_ROTATION;
        };
        _this.onAddedToStage();
        return _this;
    }
    Tweezers.prototype.onAddedToStage = function () {
        this.createTweezersArt();
        this.pinchingPoint = new pixi_js_1.Point(this.tweezerTopImage.width * .9, -this.tweezerTopImage.height * .2);
        this.pinchingTarget = new pixi_js_1.Graphics();
        this.pinchingTarget.drawRect(this.pinchingPoint.x, this.pinchingPoint.y, 60, 100);
        this.pinchingTarget.pivot.x = this.pinchingTarget.width * .5;
        this.pinchingTarget.pivot.y = this.pinchingTarget.height * .5;
        this.pinchingTarget.beginFill(0x999999);
        this.pinchingTarget.alpha = HospitalGameView_1.HospitalGameView.RECT_COVER_ALPHA;
        this.addChild(this.pinchingTarget);
    };
    Object.defineProperty(Tweezers.prototype, "targets", {
        get: function () {
            return this._targets;
        },
        set: function (value) {
            this._targets = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tweezers.prototype, "targetAreas", {
        set: function (value) {
            this._targetAreas = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tweezers.prototype, "target", {
        set: function (value) {
            this._target = value;
            this.targetStartingPoint = new pixi_js_1.Point(this._target.x, this._target.y);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tweezers.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (value) {
            this._state = value;
            this.allAreaIdleMouseDown = false;
            this.allAreaClosedMouseDown = false;
            this.topAreaMouseDown = false;
            this.bottomAreaMouseDown = false;
            switch (this._state) {
                case Tweezers.IDLE:
                    this.touchAreaTop.visible = this.touchAreaBottom.visible = false;
                    this.touchAreaTop.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.topAreaTouchDown);
                    this.touchAreaTop.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.topAreaTouchMove);
                    this.touchAreaTop.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.topAreaTouchDone);
                    this.touchAreaBottom.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.bottomAreaTouchDown);
                    this.touchAreaBottom.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.bottomAreaTouchMove);
                    this.touchAreaBottom.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.bottomAreaTouchDone);
                    this.touchAreaAll.visible = true;
                    this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.allAreaTouchClosedDown);
                    this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.allAreaTouchClosedMove);
                    this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.allAreaTouchClosedDone);
                    this.touchAreaAll.on(TouchLoudEvent_1.TouchEvent.TOUCH, this.allAreaTouchIdleDown);
                    this.touchAreaAll.on(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.allAreaTouchIdleMove);
                    this.touchAreaAll.on(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.allAreaTouchIdleDone);
                    break;
                case Tweezers.PLACED:
                    this.touchAreaTop.visible = this.touchAreaBottom.visible = true;
                    this.touchAreaTop.on(TouchLoudEvent_1.TouchEvent.TOUCH, this.topAreaTouchDown);
                    this.touchAreaTop.on(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.topAreaTouchMove);
                    this.touchAreaTop.on(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.topAreaTouchDone);
                    this.touchAreaBottom.on(TouchLoudEvent_1.TouchEvent.TOUCH, this.bottomAreaTouchDown);
                    this.touchAreaBottom.on(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.bottomAreaTouchMove);
                    this.touchAreaBottom.on(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.bottomAreaTouchDone);
                    this.touchAreaAll.visible = false;
                    this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.allAreaTouchIdleDown);
                    this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.allAreaTouchIdleMove);
                    this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.allAreaTouchIdleDone);
                    this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.allAreaTouchClosedDown);
                    this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.allAreaTouchClosedMove);
                    this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.allAreaTouchClosedDone);
                    this.pivot.x = this.pinchingPoint.x;
                    this.pivot.y = this.pinchingPoint.y;
                    break;
                case Tweezers.CLOSED:
                    this.touchAreaTop.visible = this.touchAreaBottom.visible = false;
                    this.touchAreaTop.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.topAreaTouchDown);
                    this.touchAreaTop.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.topAreaTouchMove);
                    this.touchAreaTop.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.topAreaTouchDone);
                    this.touchAreaBottom.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.bottomAreaTouchDown);
                    this.touchAreaBottom.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.bottomAreaTouchMove);
                    this.touchAreaBottom.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.bottomAreaTouchDone);
                    this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.allAreaTouchIdleDown);
                    this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.allAreaTouchIdleMove);
                    this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.allAreaTouchIdleDone);
                    this.touchAreaAll.on(TouchLoudEvent_1.TouchEvent.TOUCH, this.allAreaTouchClosedDown);
                    this.touchAreaAll.on(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.allAreaTouchClosedMove);
                    this.touchAreaAll.on(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.allAreaTouchClosedDone);
                    this.touchAreaAll.visible = true;
                    break;
                case Tweezers.DISABLED:
                    this.touchAreaTop.visible = this.touchAreaBottom.visible = false;
                    this.touchAreaTop.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.topAreaTouchDown);
                    this.touchAreaTop.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.topAreaTouchMove);
                    this.touchAreaTop.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.topAreaTouchDone);
                    this.touchAreaBottom.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.bottomAreaTouchDown);
                    this.touchAreaBottom.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.bottomAreaTouchMove);
                    this.touchAreaBottom.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.bottomAreaTouchDone);
                    this.touchAreaAll.visible = true;
                    this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.allAreaTouchIdleDown);
                    this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.allAreaTouchIdleMove);
                    this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.allAreaTouchIdleDone);
                    this.touchAreaAll.on(TouchLoudEvent_1.TouchEvent.TOUCH, this.allAreaTouchClosedDown);
                    this.touchAreaAll.on(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.allAreaTouchClosedMove);
                    this.touchAreaAll.on(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.allAreaTouchClosedDone);
                    break;
                default:
                    break;
            }
        },
        enumerable: true,
        configurable: true
    });
    Tweezers.prototype.getTargetRect = function (currentTarget) {
        var targetImage = currentTarget.getChildAt(0);
        var targetBounds = new pixi_js_1.Rectangle(currentTarget.x, currentTarget.y, targetImage.width, targetImage.height);
        return targetBounds;
    };
    Tweezers.prototype.checkCollisionWithTargets = function (tweezer, _targetAreas) {
        var targetsLength = _targetAreas.length;
        for (var i = 0; i < targetsLength; i++) {
            var currentTarget = this._targets[i];
            var currentTargetAreas = _targetAreas[i];
            var targetImage = currentTargetAreas.getChildAt(0);
            var targetBounds = new pixi_js_1.Rectangle(currentTargetAreas.x, currentTargetAreas.y, targetImage.width, targetImage.height);
            var hit = SpriteHelper_1.SpriteHelper.hitTest(tweezer.getBounds(), targetBounds);
            if (hit) {
                this.currentTargetIndex = i;
                this.target = currentTarget;
                this._targetArea = currentTargetAreas;
                return true;
            }
        }
        this.currentTargetIndex = -1;
        return false;
    };
    Tweezers.prototype.createTweezersArt = function () {
        this.tweezerTopImage = pixi_js_1.Sprite.fromFrame("insektstik_pincet_top");
        this.tweezerTopImage.x = -20;
        this.tweezerTopImage.y = -50;
        this.tweezerTop = new pixi_js_1.Sprite();
        this.tweezerTop.addChild(this.tweezerTopImage);
        this.addChild(this.tweezerTop);
        this.tweezerTop.rotation = Tweezers.TWEEZER_TOP_OPEN_ROTATION;
        this.tweezerBottomImage = pixi_js_1.Sprite.fromFrame("insektstik_pincet_bottom");
        this.tweezerBottomImage.x = -20;
        this.tweezerBottomImage.y = -20;
        this.tweezerBottom = new pixi_js_1.Sprite();
        this.tweezerBottom.addChild(this.tweezerBottomImage);
        this.addChild(this.tweezerBottom);
        this.tweezerBottom.rotation = Tweezers.TWEEZER_BOTTOM_OPEN_ROTATION;
        this.touchAreaAll = new pixi_js_1.Graphics();
        this.touchAreaAll.interactive = true;
        this.touchAreaAll.beginFill(0x333333);
        this.touchAreaAll.drawRect(-this.tweezerTopImage.width, -this.tweezerTopImage.height * 3, this.tweezerTopImage.width * 2, this.tweezerTopImage.height * 6);
        this.addChild(this.touchAreaAll);
        this.touchAreaAll.alpha = HospitalGameView_1.HospitalGameView.RECT_COVER_ALPHA;
        this.addChild(this.touchAreaAll);
        this.touchAreaTop = new pixi_js_1.Graphics();
        this.touchAreaTop.interactive = true;
        this.touchAreaTop.beginFill(0x000000);
        this.touchAreaTop.drawRect(this.tweezerTopImage.x, this.tweezerTopImage.y, this.tweezerTopImage.width, this.tweezerTopImage.height * 2);
        this.touchAreaTop.alpha = HospitalGameView_1.HospitalGameView.RECT_COVER_ALPHA;
        this.tweezerTop.addChild(this.touchAreaTop);
        this.touchAreaBottom = new pixi_js_1.Graphics();
        this.touchAreaBottom.interactive = true;
        this.touchAreaBottom.beginFill(0xFFFFFF);
        this.touchAreaBottom.drawRect(this.tweezerBottomImage.x, this.tweezerBottomImage.y, this.tweezerBottomImage.width, this.tweezerBottomImage.height * 2);
        this.tweezerBottom.addChild(this.touchAreaBottom);
        this.touchAreaBottom.alpha = HospitalGameView_1.HospitalGameView.RECT_COVER_ALPHA;
        this.addChild(this.touchAreaBottom);
        this.rotation = Tweezers.TWEEZER_ROTATION;
        this.x = AssetLoader_1.AssetLoader.STAGE_WIDTH * .5;
        this.y = AssetLoader_1.AssetLoader.STAGE_HEIGHT * .5;
    };
    Tweezers.prototype.destroy = function () {
        this.touchAreaTop.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.topAreaTouchDown);
        this.touchAreaTop.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.topAreaTouchMove);
        this.touchAreaTop.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.topAreaTouchDone);
        this.touchAreaBottom.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.bottomAreaTouchDown);
        this.touchAreaBottom.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.bottomAreaTouchMove);
        this.touchAreaBottom.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.bottomAreaTouchDone);
        this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.allAreaTouchIdleDown);
        this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.allAreaTouchIdleMove);
        this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.allAreaTouchIdleDone);
        this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.allAreaTouchClosedDown);
        this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.allAreaTouchIdleMove);
        this.touchAreaAll.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.allAreaTouchIdleDone);
    };
    Tweezers.TWEEZER_TOP_OPEN_ROTATION = -20 * (Math.PI / 180);
    Tweezers.TWEEZER_BOTTOM_OPEN_ROTATION = 20 * (Math.PI / 180);
    Tweezers.TWEEZER_ROTATION = (120 * (Math.PI / 180));
    Tweezers.IDLE = "idle";
    Tweezers.PLACED = "placed";
    Tweezers.CLOSED = "closed";
    Tweezers.DISABLED = "disabled";
    return Tweezers;
}(pixi_js_1.Sprite));
exports.Tweezers = Tweezers;
//# sourceMappingURL=Tweezers.js.map
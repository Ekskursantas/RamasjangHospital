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
var pixi_js_1 = require("pixi.js");
var TouchLoudEvent_1 = require("../../../../../loudmotion/events/TouchLoudEvent");
var HospitalGameView_1 = require("../../../HospitalGameView");
var DraggableObject = /** @class */ (function (_super) {
    __extends(DraggableObject, _super);
    function DraggableObject(texture) {
        var _this = _super.call(this) || this;
        _this.touchDown = function (event) {
            _this.mouseDown = true;
            _this.hitObstacle = false;
            // let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
            // this.x = mousePositionCanvas.x;
            // this.y = mousePositionCanvas.y;
        };
        _this.touchMove = function (event) {
            if (_this.mouseDown && !_this.hitObstacle) {
                // let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
                // // let mousePosition: Point = event.data.getLocalPosition(this);
                // this.x = Math.abs(mousePositionCanvas.x);
                // this.y = Math.abs(mousePositionCanvas.y);
            }
        };
        _this.touchDone = function (event) {
            _this.mouseDown = false;
        };
        _this.interactive = true;
        _this.buttonMode = true;
        _this.textureName = texture;
        _this.onAddedToStage();
        return _this;
    }
    DraggableObject.prototype.onAddedToStage = function () {
        this.createDraggableObjectArt();
        // this.x = this.initialPosition.x; //TODO?
        // this.y = this.initialPosition.y;
        // this.addTouchEvents();
    };
    DraggableObject.prototype.addTouchEvents = function () {
        // this.on(TouchEvent.TOUCH, this.touchDown);
        // this.on(TouchEvent.TOUCH_END, this.touchDone);
        // this.on(TouchEvent.TOUCH_MOVE, this.touchMove);
    };
    DraggableObject.prototype.createDraggableObjectArt = function () {
        this.draggableObjectImage = pixi_js_1.Sprite.fromFrame(this.textureName);
        this.rectCover = new pixi_js_1.Graphics();
        this.rectCover.beginFill(0xFFFFFF);
        this.rectCover.alpha = HospitalGameView_1.HospitalGameView.RECT_COVER_ALPHA;
        this.addChild(this.rectCover);
        this.rectCover.drawRect(this.draggableObjectImage.x, this.draggableObjectImage.y, this.draggableObjectImage.width, this.draggableObjectImage.height);
        this.pivot.x = this.draggableObjectImage.width * .5;
        this.pivot.y = this.draggableObjectImage.height * .5;
        this.addChild(this.draggableObjectImage);
    };
    DraggableObject.prototype.addCollectable = function (item) {
        this.addChild(item);
        this.addChild(this.rectCover);
    };
    Object.defineProperty(DraggableObject.prototype, "bounds", {
        get: function () {
            return this.draggableObjectImage.getBounds();
        },
        enumerable: true,
        configurable: true
    });
    DraggableObject.prototype.destroy = function () {
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.touchDown);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.touchDone);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.touchMove);
        if (this.draggableObjectImage != null) {
            this.removeChild(this.draggableObjectImage);
            this.draggableObjectImage = null;
        }
        if (this.rectCover != null) {
            this.removeChild(this.rectCover);
            this.rectCover = null;
        }
    };
    return DraggableObject;
}(pixi_js_1.Sprite));
exports.DraggableObject = DraggableObject;
//# sourceMappingURL=DraggableObject.js.map
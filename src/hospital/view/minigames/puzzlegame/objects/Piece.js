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
var AssetLoader_1 = require("../../../../utils/AssetLoader");
var signals_js_1 = require("signals.js");
var PuzzleGameView_1 = require("../PuzzleGameView");
var HospitalGameView_1 = require("../../../HospitalGameView");
var Piece = /** @class */ (function (_super) {
    __extends(Piece, _super);
    function Piece(texture, initialPosition, initialRotation, targetObject, type) {
        var _this = _super.call(this) || this;
        _this.touchDown = function (event) {
            _this.mouseDown = true;
            _this.parent.setChildIndex(_this, _this.parent.children.length - 1);
            var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
            var mousePosition = event.data.getLocalPosition(_this);
            TweenLite.to(_this.pieceImage, 0.4, { rotation: _this._targetObject.rotation });
            _this.x = mousePositionCanvas.x;
            _this.y = mousePositionCanvas.y;
            _this.pieceImage.y = -PuzzleGameView_1.PuzzleGameView.PIECE_TOUCH_OFFSET;
            _this.signalPiece.dispatch(_this);
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
            _this.mouseDown = false;
            TweenLite.to(_this.pieceImage, 0.4, { y: 0 });
            _this.signalPieceTouchDone.dispatch();
        };
        _this.interactive = true;
        _this.buttonMode = true;
        _this.textureName = texture;
        _this._initialPosition = initialPosition;
        _this._initialRotation = initialRotation * (Math.PI / 180);
        _this._targetObject = targetObject;
        _this._type = type;
        _this.onAddedToStage();
        return _this;
    }
    Piece.prototype.onAddedToStage = function () {
        this.signalPiece = new signals_js_1.Signal();
        this.signalPieceTouchDone = new signals_js_1.Signal();
        this.createPieceArt();
        this.pieceImage.pivot.x = this.pieceImage.width * .5;
        this.pieceImage.pivot.y = this.pieceImage.height * .5;
        this.pieceImage.rotation = this._initialRotation;
        this.x = this.initialPosition.x;
        this.y = this.initialPosition.y;
        this.on(TouchLoudEvent_1.TouchEvent.TOUCH, this.touchDown);
        this.on(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.touchDone);
        this.on(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.touchMove);
    };
    Piece.prototype.resetRotation = function () {
        TweenLite.to(this.pieceImage, 0.4, { rotation: this._initialRotation });
    };
    Object.defineProperty(Piece.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (value) {
            this._type = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Piece.prototype, "touch", {
        get: function () {
            return this._touch;
        },
        set: function (value) {
            this._touch = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Piece.prototype, "targetObject", {
        get: function () {
            return this._targetObject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Piece.prototype, "initialRotation", {
        get: function () {
            return this._initialRotation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Piece.prototype, "initialPosition", {
        get: function () {
            return this._initialPosition;
        },
        set: function (value) {
            this.x = Math.floor(value.x + this.width * .5);
            this.y = Math.floor(value.y + this.height * .5);
            this._initialPosition = new pixi_js_1.Point(this.x, this.y);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Piece.prototype, "width", {
        get: function () {
            return this.pieceImage.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Piece.prototype, "height", {
        get: function () {
            return this.pieceImage.height;
        },
        enumerable: true,
        configurable: true
    });
    Piece.prototype.createPieceArt = function () {
        this.pieceImage = pixi_js_1.Sprite.fromFrame(this.textureName);
        this.addChild(this.pieceImage);
        this.rectCover = new pixi_js_1.Graphics();
        this.rectCover.beginFill(0x444444);
        this.rectCover.alpha = HospitalGameView_1.HospitalGameView.RECT_COVER_ALPHA;
        this.addChild(this.rectCover);
        this.rectCover.pivot.x = this.pieceImage.width * .5;
        this.rectCover.pivot.y = this.pieceImage.height * .5;
        this.rectCover.drawRect(this.pieceImage.x, this.pieceImage.y, this.pieceImage.width, this.pieceImage.height);
    };
    Piece.prototype.removeTouch = function () {
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.touchDown);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.touchDone);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.touchMove);
    };
    Piece.prototype.destroy = function () {
        this.removeTouch();
        if (this.pieceImage != null) {
            this.removeChild(this.pieceImage);
            this.pieceImage = null;
        }
        if (this.rectCover != null) {
            this.removeChild(this.rectCover);
            this.rectCover = null;
        }
    };
    return Piece;
}(pixi_js_1.Sprite));
exports.Piece = Piece;
//# sourceMappingURL=Piece.js.map
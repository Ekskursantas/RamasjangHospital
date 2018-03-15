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
var signals_js_1 = require("signals.js");
var Texture = PIXI.Texture;
var HospitalGameView_1 = require("../../../HospitalGameView");
var Bacterium = /** @class */ (function (_super) {
    __extends(Bacterium, _super);
    function Bacterium() {
        var _this = _super.call(this) || this;
        _this.touchDown = function (event) {
            _this.parent.setChildIndex(_this, _this.parent.children.length - 1);
            _this.signalPiece.dispatch(_this);
        };
        _this.interactive = true;
        _this.buttonMode = true;
        _this._speed = Math.random() + 1;
        _this.changeDirection();
        _this.onAddedToStage();
        return _this;
    }
    Object.defineProperty(Bacterium.prototype, "bacteriumTexture", {
        get: function () {
            return this._bacteriumTexture;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bacterium.prototype, "bacteriumImageCurrent", {
        get: function () {
            return this._bacteriumImageCurrent;
        },
        enumerable: true,
        configurable: true
    });
    Bacterium.prototype.onAddedToStage = function () {
        this.signalPiece = new signals_js_1.Signal();
        this.createBacteriumArt();
        this.state = Bacterium.NOT_TOUCHED;
        this.on(TouchLoudEvent_1.TouchEvent.TOUCH, this.touchDown);
    };
    Object.defineProperty(Bacterium.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (value) {
            this._state = value;
            switch (value) {
                case Bacterium.NOT_TOUCHED:
                    this.showImage(this.bacteriumImage);
                    break;
                case Bacterium.TOUCHED_ONCE:
                    this.showImage(this.bacteriumImageTouchedOnce);
                    break;
                case Bacterium.TOUCHED_TWICE:
                    this.showImage(this.bacteriumImageTouchedTwice);
                    break;
                default:
                    break;
            }
        },
        enumerable: true,
        configurable: true
    });
    Bacterium.prototype.showImage = function (image) {
        this.bacteriumImage.visible = false;
        this.bacteriumImageTouchedOnce.visible = false;
        this.bacteriumImageTouchedTwice.visible = false;
        this._bacteriumImageCurrent = image;
        this._bacteriumImageCurrent.visible = true;
    };
    Object.defineProperty(Bacterium.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        set: function (value) {
            this._direction = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bacterium.prototype, "speed", {
        get: function () {
            return this._speed;
        },
        set: function (value) {
            this._speed = value;
        },
        enumerable: true,
        configurable: true
    });
    Bacterium.prototype.changeDirection = function () {
        this._direction = Math.random() * (360 * (Math.PI / 180));
    };
    Bacterium.prototype.receiveTouch = function () {
        switch (this.state) {
            case Bacterium.NOT_TOUCHED:
                this.state = Bacterium.TOUCHED_ONCE;
                break;
            case Bacterium.TOUCHED_ONCE:
                this.state = Bacterium.TOUCHED_TWICE;
                break;
            case Bacterium.TOUCHED_TWICE:
                this.state = Bacterium.DEAD;
                break;
            default:
                break;
        }
    };
    Bacterium.prototype.reInit = function () {
        this._speed = Math.random() + 1;
        this.changeDirection();
        this.state = Bacterium.NOT_TOUCHED;
    };
    Bacterium.prototype.createBacteriumArt = function () {
        this.bacteriumImageTouchedOnce = pixi_js_1.Sprite.fromFrame("lungebetaendelse_bakterie1_skud1");
        this.bacteriumImageTouchedTwice = pixi_js_1.Sprite.fromFrame("lungebetaendelse_bakterie1_skud2");
        this._bacteriumTexture = Texture.fromFrame('lungebetaendelse_bakterie1');
        this.bacteriumImage = new pixi_js_1.Sprite(this._bacteriumTexture);
        this._bacteriumImageCurrent = this.bacteriumImage;
        this.rectCover = new pixi_js_1.Graphics(); //TODO temp to check area
        this.rectCover.beginFill(0xFFFFFF);
        this.rectCover.alpha = HospitalGameView_1.HospitalGameView.RECT_COVER_ALPHA;
        this.addChild(this.rectCover);
        this.rectCover.drawRect(this.bacteriumImage.x, this.bacteriumImage.y, this.bacteriumImage.width, this.bacteriumImage.height);
        this.addChild(this.bacteriumImage);
        this.addChild(this.bacteriumImageTouchedOnce);
        this.addChild(this.bacteriumImageTouchedTwice);
        this.pivot.x = this.bacteriumImage.width * .5;
        this.pivot.y = this.bacteriumImage.height * .5;
    };
    Object.defineProperty(Bacterium.prototype, "bounds", {
        get: function () {
            return this._bacteriumImageCurrent.getBounds();
        },
        enumerable: true,
        configurable: true
    });
    Bacterium.prototype.destroy = function () {
        if (this._bacteriumImageCurrent != null) {
            this.removeChild(this._bacteriumImageCurrent);
            this._bacteriumImageCurrent = null;
        }
        if (this.bacteriumImage != null) {
            this.removeChild(this.bacteriumImage);
            this.bacteriumImage = null;
        }
        if (this.bacteriumImageTouchedOnce != null) {
            this.removeChild(this.bacteriumImageTouchedOnce);
            this.bacteriumImageTouchedOnce = null;
        }
        if (this.bacteriumImageTouchedTwice != null) {
            this.removeChild(this.bacteriumImageTouchedTwice);
            this.bacteriumImageTouchedTwice = null;
        }
        if (this.rectCover != null) {
            this.removeChild(this.rectCover);
            this.rectCover = null;
        }
    };
    //states
    Bacterium.NOT_TOUCHED = "notTouched";
    Bacterium.TOUCHED_ONCE = "touchedOnce";
    Bacterium.TOUCHED_TWICE = "touchedTwice";
    Bacterium.DEAD = "dead";
    return Bacterium;
}(pixi_js_1.Sprite));
exports.Bacterium = Bacterium;
//# sourceMappingURL=Bacterium.js.map
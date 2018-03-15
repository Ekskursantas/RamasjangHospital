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
var HospitalGameView_1 = require("../../../HospitalGameView");
var Collectable = /** @class */ (function (_super) {
    __extends(Collectable, _super);
    function Collectable(texture) {
        var _this = _super.call(this) || this;
        _this.interactive = true;
        _this.buttonMode = true;
        _this.textureName = texture;
        _this.onAddedToStage();
        return _this;
    }
    Collectable.prototype.onAddedToStage = function () {
        this.createCollectableArt();
        this.createMovement();
    };
    Collectable.prototype.createCollectableArt = function () {
        this.collectableImage = pixi_js_1.Sprite.fromFrame(this.textureName);
        this.rectCover = new pixi_js_1.Graphics(); //TODO temp to check area
        this.rectCover.beginFill(0xFFFFFF);
        this.rectCover.alpha = HospitalGameView_1.HospitalGameView.RECT_COVER_ALPHA;
        this.addChild(this.rectCover);
        this.rectCover.drawRect(this.collectableImage.x, this.collectableImage.y, this.collectableImage.width, this.collectableImage.height);
        this.addChild(this.collectableImage);
        this.pivot.x = this.collectableImage.width * .5;
        this.pivot.y = this.collectableImage.height * .5;
    };
    Collectable.prototype.createMovement = function () {
        this.rotation = -0.1;
        TweenMax.to(this, 1, { rotation: "+=0.2", repeat: -1, yoyo: true, ease: Linear.easeNone, delay: Math.random() });
    };
    Object.defineProperty(Collectable.prototype, "bounds", {
        get: function () {
            return this.collectableImage.getBounds();
        },
        enumerable: true,
        configurable: true
    });
    Collectable.prototype.destroy = function () {
        if (this.collectableImage != null) {
            this.removeChild(this.collectableImage);
            this.collectableImage = null;
        }
        if (this.rectCover != null) {
            this.removeChild(this.rectCover);
            this.rectCover = null;
        }
    };
    return Collectable;
}(pixi_js_1.Sprite));
exports.Collectable = Collectable;
//# sourceMappingURL=Collectable.js.map
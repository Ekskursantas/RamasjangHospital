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
var PenicillinJar = /** @class */ (function (_super) {
    __extends(PenicillinJar, _super);
    function PenicillinJar() {
        var _this = _super.call(this) || this;
        _this.interactive = true;
        _this.buttonMode = true;
        _this.onAddedToStage();
        return _this;
    }
    PenicillinJar.prototype.onAddedToStage = function () {
        this.createImages();
        this.initialPosition = new pixi_js_1.Point(this.x, this.y);
    };
    PenicillinJar.prototype.showFingerDipped = function () {
        TweenLite.killTweensOf(this.imageFingerDipped);
        this.imageFingerDipped.alpha = 1;
        this.startFadingFingerPrint();
    };
    PenicillinJar.prototype.highlight = function () {
        TweenMax.to(this.imageHighlight, 0.5, { alpha: "+=1", repeat: -1, yoyo: true, ease: Linear.easeNone });
    };
    PenicillinJar.prototype.stopHighlighting = function () {
        TweenMax.killTweensOf(this.imageHighlight);
        this.imageHighlight.alpha = 0;
    };
    PenicillinJar.prototype.createImages = function () {
        this.imageHighlight = pixi_js_1.Sprite.fromFrame("lungebetaendelse_penicillin_highlight");
        this.imageFull = pixi_js_1.Sprite.fromFrame("lungebetaendelse_penicillin1");
        this.imageFingerDipped = pixi_js_1.Sprite.fromFrame("lungebetaendelse_penicillin2");
        this.rectCover = new pixi_js_1.Graphics(); //TODO temp to check area
        this.rectCover.beginFill(0xFFFFFF);
        this.rectCover.alpha = HospitalGameView_1.HospitalGameView.RECT_COVER_ALPHA;
        this.addChild(this.rectCover);
        this.rectCover.drawRect(this.imageHighlight.x, this.imageHighlight.y, this.imageHighlight.width, this.imageHighlight.height);
        this.addChild(this.imageHighlight);
        this.addChild(this.imageFull);
        this.addChild(this.imageFingerDipped);
        this.imageHighlight.alpha = 0;
        this.imageFingerDipped.alpha = 0;
        // let imageHighlightOrigialDiameter:number = this.imageHighlight.width;
        this.imageHighlight.scale.x = this.imageHighlight.scale.y = 1.2;
        // this.imageHighlight.x -= (this.imageHighlight.width - imageHighlightOrigialDiameter) / 2;
        // this.imageHighlight.y -= (this.imageHighlight.width - imageHighlightOrigialDiameter) / 2;
        this.imageHighlight.pivot.x = Math.floor(this.imageHighlight.width * .5 - 2);
        this.imageHighlight.pivot.y = Math.floor(this.imageHighlight.height * .5 - 2);
        this.imageHighlight.x = this.imageHighlight.width * .5;
        this.imageHighlight.y = this.imageHighlight.height * .5;
    };
    Object.defineProperty(PenicillinJar.prototype, "width", {
        get: function () {
            return this.imageHighlight.width;
        },
        enumerable: true,
        configurable: true
    });
    PenicillinJar.prototype.startFadingFingerPrint = function () {
        TweenLite.to(this.imageFingerDipped, 4, { alpha: 0 });
    };
    PenicillinJar.prototype.destroy = function () {
        if (this.imageHighlight != null) {
            this.removeChild(this.imageHighlight);
            this.imageHighlight = null;
        }
        if (this.imageFull != null) {
            this.removeChild(this.imageFull);
            this.imageFull = null;
        }
        if (this.imageFingerDipped != null) {
            this.removeChild(this.imageFingerDipped);
            this.imageFingerDipped = null;
        }
        if (this.rectCover != null) {
            this.removeChild(this.rectCover);
            this.rectCover = null;
        }
    };
    return PenicillinJar;
}(pixi_js_1.Sprite));
exports.PenicillinJar = PenicillinJar;
//# sourceMappingURL=PenicillinJar.js.map
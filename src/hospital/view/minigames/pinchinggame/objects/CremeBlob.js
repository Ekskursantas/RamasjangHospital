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
var CremeBlob = /** @class */ (function (_super) {
    __extends(CremeBlob, _super);
    function CremeBlob() {
        var _this = _super.call(this) || this;
        _this.interactive = true;
        _this.buttonMode = true;
        _this.onAddedToStage();
        return _this;
    }
    CremeBlob.prototype.onAddedToStage = function () {
        this.createBlobArt();
    };
    CremeBlob.prototype.createBlobArt = function () {
        this.blobImage = pixi_js_1.Sprite.fromFrame("insektstik_salve_01");
        this.addChild(this.blobImage);
        // this.rectCover = new Graphics(); //TODO temp to check area
        // this.rectCover.beginFill(0x666666);
        // this.rectCover.alpha = .3; //HospitalGameView.RECT_COVER_ALPHA;
        // this.rectCover.drawRect(this.blobImage.x, this.blobImage.y, this.blobImage.width, this.blobImage.height);
        // this.rectCover.pivot.x = this.blobImage.width * .5;
        // this.rectCover.pivot.y = this.blobImage.height * .5;
        //this.addChild(this.rectCover);
        this.blobImage.pivot.x = this.blobImage.height * .5;
        this.blobImage.pivot.y = this.blobImage.height * .5;
    };
    Object.defineProperty(CremeBlob.prototype, "height", {
        get: function () {
            return this.rectCover.height;
        },
        enumerable: true,
        configurable: true
    });
    CremeBlob.prototype.destroy = function () {
        if (this.blobImage != null) {
            this.removeChild(this.blobImage);
            this.blobImage = null;
        }
        if (this.rectCover != null) {
            this.removeChild(this.rectCover);
            this.rectCover = null;
        }
    };
    return CremeBlob;
}(pixi_js_1.Sprite));
exports.CremeBlob = CremeBlob;
//# sourceMappingURL=CremeBlob.js.map
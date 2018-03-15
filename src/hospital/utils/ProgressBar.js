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
var Logger_1 = require("../../loudmotion/utils/debug/Logger");
var pixi_js_1 = require("pixi.js");
var AssetLoader_1 = require("./AssetLoader");
var ProgressBar = /** @class */ (function (_super) {
    __extends(ProgressBar, _super);
    function ProgressBar(width, height) {
        var _this = _super.call(this) || this;
        _this.init(width, height);
        return _this;
    }
    ProgressBar.prototype.init = function (width, height) {
        if (width === void 0) { width = AssetLoader_1.AssetLoader.STAGE_WIDTH * .5; }
        if (height === void 0) { height = ProgressBar.PROGRESS_BAR_HEIGHT; }
        Logger_1.Logger.log(this, "ProgressBar.init(width, height)  width == " + width + " : height == " + height);
        // var scale:number = Starling.contentScaleFactor;
        var scale = 1; //TODO
        // let padding:number = height * 0.2;
        // let cornerRadius:number = padding * scale * 2;
        // create progress bar quad
        // this.mBar = new Rectangle(padding, padding, width - 2 * padding, height - 2 * padding, );
        this.mBarBg = new pixi_js_1.Graphics(); //TODO temp to check area
        this.mBarBg.beginFill(0x333333);
        this.addChild(this.mBarBg);
        this.mBarBg.drawRect(0, 0, width, height);
        this.mBarBg.x = Math.floor(AssetLoader_1.AssetLoader.STAGE_WIDTH * .5 - this.mBarBg.width * .5);
        this.mBarBg.y = Math.floor(AssetLoader_1.AssetLoader.STAGE_HEIGHT * .5 - this.mBarBg.height * .5);
        this.mBar = new pixi_js_1.Graphics(); //TODO temp to check area
        this.mBar.beginFill(0xaaaaaa);
        this.addChild(this.mBar);
        this.mBar.drawRect(0, 0, width, height);
        this.mBar.x = this.mBarBg.x;
        this.mBar.y = this.mBarBg.y;
        this.mBar.scale.x = 0;
        Logger_1.Logger.log(this, "ProgressBar init this.mBar == " + this.mBar.x + " : " + this.mBar.y + " : " + this.mBar.width + " : " + this.mBar.height);
        // this.mBar.setVertexColor(2, 0xaaaaaa); //TODO
        // this.mBar.setVertexColor(3, 0xaaaaaa);
        // color = 0xeeeeee; //TODO
        // this.mBar.scaleX = 0; //TODO
        // this.addChild(this.mBar); //TODO
    };
    Object.defineProperty(ProgressBar.prototype, "ratio", {
        get: function () {
            return this.progressAmount;
            // return this.mBar.scale.x;
        },
        set: function (value) {
            this.progressAmount = value;
            // Logger.log(this, "ProgressBar set ratio this.progressAmount == "+this.progressAmount);
            if (this.mBar != null) {
                this.mBar.scale.x = Math.max(0.0, Math.min(1.0, value));
                this.mBar.x = this.mBarBg.x;
            }
        },
        enumerable: true,
        configurable: true
    });
    ProgressBar.prototype.destroy = function () {
        if (this.mBar != null) {
            this.removeChild(this.mBar);
        }
        if (this.mBarBg != null) {
            this.removeChild(this.mBarBg);
        }
    };
    ProgressBar.PROGRESS_BAR_HEIGHT = 20;
    return ProgressBar;
}(pixi_js_1.Sprite));
exports.ProgressBar = ProgressBar;
//# sourceMappingURL=ProgressBar.js.map
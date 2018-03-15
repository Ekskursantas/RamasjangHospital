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
// package appdrhospital.view
var Logger_1 = require("../../loudmotion/utils/debug/Logger");
var pixi_js_1 = require("pixi.js");
var Config_1 = require("../Config");
var HospitalGameView = /** @class */ (function (_super) {
    __extends(HospitalGameView, _super);
    function HospitalGameView() {
        return _super.call(this) || this;
        // this.interactive = true;
    }
    Object.defineProperty(HospitalGameView.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (_name) {
            this._name = _name;
        },
        enumerable: true,
        configurable: true
    });
    HospitalGameView.prototype.show = function () {
        this.visible = true;
    };
    HospitalGameView.prototype.hide = function () {
        this.visible = false;
    };
    HospitalGameView.prototype.destroy = function () {
        Logger_1.Logger.log(this, "HospitalGameView destroy  this.children.length == " + this.children.length);
        clearTimeout(Config_1.Config.currentTimeout);
        this.removeChildren();
    };
    HospitalGameView.prototype.init = function () { };
    HospitalGameView.RECT_COVER_ALPHA = 0.01;
    return HospitalGameView;
}(pixi_js_1.Sprite));
exports.HospitalGameView = HospitalGameView;
//# sourceMappingURL=HospitalGameView.js.map
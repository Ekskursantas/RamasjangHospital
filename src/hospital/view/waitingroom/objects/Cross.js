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
var ButtonEvent_1 = require("../../../event/ButtonEvent");
var Config_1 = require("../../../Config");
var AudioPlayer_1 = require("../../../../loudmotion/utils/AudioPlayer");
var Cross = /** @class */ (function (_super) {
    __extends(Cross, _super);
    function Cross() {
        var _this = _super.call(this) || this;
        _this.touchListener = function (event) {
            _this.onState = !_this.onState;
            _this.crossTurnedOn.alpha = Number(_this.onState);
            if (_this.onState) {
                AudioPlayer_1.AudioPlayer.getInstance().playSound("clik_on", 0, Config_1.Config.EFFECTS_VOLUME_LEVEL);
            }
            else {
                AudioPlayer_1.AudioPlayer.getInstance().playSound("clik_off", 0, Config_1.Config.EFFECTS_VOLUME_LEVEL);
            }
        };
        _this.on(ButtonEvent_1.ButtonEvent.TOUCH, _this.touchListener);
        _this.onAddedToStage();
        return _this;
    }
    Cross.prototype.onAddedToStage = function () {
        this.createCrossArt();
    };
    Cross.prototype.createCrossArt = function () {
        this.crossTurnedOn = pixi_js_1.Sprite.fromFrame("waitingRoom_plusOn");
        this.addChild(this.crossTurnedOn);
        this.crossTurnedOn.alpha = 0;
    };
    Cross.prototype.destroy = function () {
        this.off(ButtonEvent_1.ButtonEvent.TOUCH, this.touchListener);
        if (this.crossTurnedOn != null) {
            this.removeChild(this.crossTurnedOn);
        }
    };
    return Cross;
}(pixi_js_1.Sprite));
exports.Cross = Cross;
//# sourceMappingURL=Cross.js.map
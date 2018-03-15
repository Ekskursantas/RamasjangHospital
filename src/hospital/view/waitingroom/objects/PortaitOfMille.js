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
var PortaitOfMille = /** @class */ (function (_super) {
    __extends(PortaitOfMille, _super);
    // private sndMan:SoundManager;
    function PortaitOfMille() {
        var _this = _super.call(this) || this;
        _this.touchListener = function (event) {
            _this.movePortrait();
            AudioPlayer_1.AudioPlayer.getInstance().playSound("picture", 0, Config_1.Config.EFFECTS_VOLUME_LEVEL);
        };
        _this.on(ButtonEvent_1.ButtonEvent.CLICKED, _this.touchListener);
        _this.onAddedToStage();
        return _this;
    }
    PortaitOfMille.prototype.onAddedToStage = function () {
        this.interactive = true;
        this.createPortraitArt();
    };
    PortaitOfMille.prototype.movePortrait = function () {
        TweenLite.killTweensOf(this);
        var tl = new TimelineLite();
        //add a from() tween at the beginning of the timline
        tl.to(this, 0.5, { rotation: 0.2, ease: Sine.easeInOut });
        tl.to(this, 0.9, { rotation: -0.12, ease: Sine.easeInOut });
        tl.to(this, 0.7, { rotation: 0.08, ease: Sine.easeInOut });
        tl.to(this, 0.6, { rotation: -0.03, ease: Sine.easeInOut });
        tl.to(this, 0.5, { rotation: 0, ease: Sine.easeInOut });
        tl.play();
    };
    PortaitOfMille.prototype.createPortraitArt = function () {
        this.portrait = pixi_js_1.Sprite.fromFrame("waitingRoom_motorMille");
        this.addChild(this.portrait);
        this.portrait.x = -139;
        this.portrait.y = -2;
    };
    PortaitOfMille.prototype.destroy = function () {
        this.off(ButtonEvent_1.ButtonEvent.CLICKED, this.touchListener);
        TweenLite.killTweensOf(this);
        if (this.portrait != null) {
            this.removeChild(this.portrait);
            this.portrait = null;
        }
    };
    return PortaitOfMille;
}(pixi_js_1.Sprite));
exports.PortaitOfMille = PortaitOfMille;
//# sourceMappingURL=PortaitOfMille.js.map
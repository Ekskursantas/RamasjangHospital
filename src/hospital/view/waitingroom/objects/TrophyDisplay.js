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
var Button_1 = require("../../../../loudmotion/ui/Button");
var Config_1 = require("../../../Config");
var Level_1 = require("../../../vo/Level");
var ButtonEvent_1 = require("../../../event/ButtonEvent");
var pixi_js_1 = require("pixi.js");
var AudioPlayer_1 = require("../../../../loudmotion/utils/AudioPlayer");
var TrophyDisplay = /** @class */ (function (_super) {
    __extends(TrophyDisplay, _super);
    function TrophyDisplay() {
        var _this = _super.call(this) || this;
        _this.SPACING_HORIZONTAL = 60;
        _this.SPACING_VERTICAL = 60;
        _this.btnOpenCloseTriggered = function (event) {
            _this.onState = !_this.onState;
            _this.trophyContainer.visible = _this.onState;
            if (_this.onState) {
                _this.emit(TrophyDisplay.OPENED);
                AudioPlayer_1.AudioPlayer.getInstance().playSound("toj_swipe_swoosh", 0, Config_1.Config.EFFECTS_VOLUME_LEVEL);
            }
            else {
                AudioPlayer_1.AudioPlayer.getInstance().playSound("toj_swipe_swoosh", 0, Config_1.Config.EFFECTS_VOLUME_LEVEL);
            }
        };
        _this.onAddedToStage();
        return _this;
    }
    TrophyDisplay.prototype.onAddedToStage = function () {
        this.interactive = true;
        this.createTrophyDisplayArt();
        this.update();
        this.initOpenCloseButton();
        this.onState = false;
        this.trophyContainer.visible = this.onState;
    };
    TrophyDisplay.prototype.close = function () {
        this.onState = false;
        this.trophyContainer.visible = this.onState;
    };
    TrophyDisplay.prototype.initOpenCloseButton = function () {
        this.btnOpenClose.on(ButtonEvent_1.ButtonEvent.CLICKED, this.btnOpenCloseTriggered);
    };
    TrophyDisplay.prototype.createTrophyDisplayArt = function () {
        this.btnOpenClose = new Button_1.Button();
        this.btnOpenClose.addTexture(pixi_js_1.Texture.fromFrame("medalje"));
        this.addChild(this.btnOpenClose);
        this.btnOpenClose.pivot.x = this.btnOpenClose.width * .5;
        this.btnOpenClose.pivot.y = this.btnOpenClose.height * .5;
        this.trophyContainer = new pixi_js_1.Sprite();
        var backgroundImage = pixi_js_1.Sprite.fromFrame("bg");
        backgroundImage.scale.x = backgroundImage.scale.y = 2;
        this.trophyContainer.addChild(backgroundImage);
        this.addChild(this.trophyContainer);
        this.trophyContainer.x = 76;
        this.trophyContainer.y = -95;
    };
    TrophyDisplay.prototype.update = function () {
        if (this.diseaseCured(Level_1.Level.BURN) || this.diseaseCured(Level_1.Level.INSECT_BITE)) {
            this.trophySkinDiseases = pixi_js_1.Sprite.fromFrame("medalje_hud");
        }
        else {
            this.trophySkinDiseases = pixi_js_1.Sprite.fromFrame("medalje_hud_locked");
            this.trophySkinDiseases.alpha = 0.4;
        }
        this.trophyContainer.addChild(this.trophySkinDiseases);
        this.trophySkinDiseases.x = this.SPACING_HORIZONTAL;
        this.trophySkinDiseases.y = this.SPACING_VERTICAL;
        if (this.diseaseCured(Level_1.Level.FRACTURE_HAND) || this.diseaseCured(Level_1.Level.FRACTURE_RADIUS)) {
            this.trophyBonesDiseases = pixi_js_1.Sprite.fromFrame("medalje_skelet");
        }
        else {
            this.trophyBonesDiseases = pixi_js_1.Sprite.fromFrame("medalje_skelet_locked");
            this.trophyBonesDiseases.alpha = 0.4;
        }
        this.trophyContainer.addChild(this.trophyBonesDiseases);
        this.trophyBonesDiseases.x = this.SPACING_HORIZONTAL * 2 + this.trophySkinDiseases.width * 1;
        this.trophyBonesDiseases.y = this.SPACING_VERTICAL;
        if (this.diseaseCured(Level_1.Level.PNEUMONIA)) {
            this.trophyLungsDiseases = pixi_js_1.Sprite.fromFrame("medalje_lunger");
        }
        else {
            this.trophyLungsDiseases = pixi_js_1.Sprite.fromFrame("medalje_lunger_locked");
            this.trophyLungsDiseases.alpha = 0.4;
        }
        this.trophyContainer.addChild(this.trophyLungsDiseases);
        this.trophyLungsDiseases.x = this.SPACING_HORIZONTAL * 3 + this.trophySkinDiseases.width * 2;
        this.trophyLungsDiseases.y = this.SPACING_VERTICAL;
        if (this.diseaseCured(Level_1.Level.POISONING)) {
            this.trophyIntestinesDiseases = pixi_js_1.Sprite.fromFrame("medalje_tarm");
        }
        else {
            this.trophyIntestinesDiseases = pixi_js_1.Sprite.fromFrame("medalje_tarm_locked");
            this.trophyIntestinesDiseases.alpha = 0.4;
        }
        this.trophyContainer.addChild(this.trophyIntestinesDiseases);
        this.trophyIntestinesDiseases.x = this.SPACING_HORIZONTAL * 4 + this.trophySkinDiseases.width * 3;
        this.trophyIntestinesDiseases.y = this.SPACING_VERTICAL;
        if (this.diseaseCured(Level_1.Level.SPRAIN)) {
            this.trophyMusclesDiseases = pixi_js_1.Sprite.fromFrame("medalje_muskler");
        }
        else {
            this.trophyMusclesDiseases = pixi_js_1.Sprite.fromFrame("medalje_muskler_locked");
            this.trophyMusclesDiseases.alpha = 0.4;
        }
        this.trophyContainer.addChild(this.trophyMusclesDiseases);
        this.trophyMusclesDiseases.x = this.SPACING_HORIZONTAL * 5 + this.trophySkinDiseases.width * 4;
        this.trophyMusclesDiseases.y = this.SPACING_VERTICAL;
    };
    TrophyDisplay.prototype.diseaseCured = function (disease) {
        var toReturn;
        for (var i = 0; i < Config_1.Config.curedDiseases.length; i++) {
            if (Config_1.Config.curedDiseases[i] == disease) {
                toReturn = true;
            }
        }
        return toReturn;
    };
    TrophyDisplay.prototype.destroy = function () {
        if (this.btnOpenClose != null) {
            this.btnOpenClose.off(ButtonEvent_1.ButtonEvent.CLICKED, this.btnOpenCloseTriggered);
            this.removeChild(this.btnOpenClose);
            this.btnOpenClose = null;
        }
        if (this.trophyContainer != null) {
            this.removeChild(this.trophyContainer);
            this.trophyContainer.removeChildren();
            this.trophyContainer = null;
        }
    };
    TrophyDisplay.OPENED = "appdrhospital.view.waitingroom.objects.TrophyDisplay.OPENED";
    return TrophyDisplay;
}(pixi_js_1.Sprite));
exports.TrophyDisplay = TrophyDisplay;
//# sourceMappingURL=TrophyDisplay.js.map
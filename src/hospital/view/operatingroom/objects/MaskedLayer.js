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
var AssetLoader_1 = require("../../../utils/AssetLoader");
var Logger_1 = require("../../../../loudmotion/utils/debug/Logger");
var Scanner_1 = require("./Scanner");
var pixi_js_1 = require("pixi.js");
// export class MaskedLayer extends ClippedSprite { //TODO do we have this in PIXI?
var MaskedLayer = /** @class */ (function (_super) {
    __extends(MaskedLayer, _super);
    function MaskedLayer() {
        var _this = _super.call(this) || this;
        _this.createLayers();
        return _this;
    }
    MaskedLayer.prototype.createLayers = function () {
        Logger_1.Logger.log(this, "MaskedLayer createLayers");
        this.maskedLayerBG = new pixi_js_1.Graphics();
        this.maskedLayerBG.beginFill(0x222222);
        // set the line style to have a width of 5 and set the color to red
        // this.background.lineStyle(5, 0xFF0000);
        // draw a rectangle
        this.maskedLayerBG.drawRect(0, 0, AssetLoader_1.AssetLoader.STAGE_WIDTH, AssetLoader_1.AssetLoader.STAGE_HEIGHT);
        var maskedLayerSilhouette = pixi_js_1.Sprite.fromFrame("insideLayers_silhouette");
        this.addChild(this.maskedLayerBG);
        this.addChild(maskedLayerSilhouette);
        maskedLayerSilhouette.scale.x = maskedLayerSilhouette.scale.y = 2;
        // offset layers so they correspond with skin layer
        maskedLayerSilhouette.x = 107;
        Logger_1.Logger.log(this, "MaskedLayer createLayers  maskedLayerSilhouette == " + maskedLayerSilhouette + " : maskedLayerSilhouette.x == " + maskedLayerSilhouette.x);
        this.patientLayerSkeletal = this.createAndAddLayer("insideLayers_skeletalSystem");
        this.patientLayerCardioVascular = this.createAndAddLayer("insideLayers_cardiovascularSystem");
        this.patientLayerMuscular = this.createAndAddLayer("insideLayers_muscularSystem");
        this.patientLayerDigestive = this.createAndAddLayer("insideLayers_digestiveSystem");
        this.patientLayerRespiratoryAndUrinary = this.createAndAddLayer("insideLayers_respiratoryAndUrinarySystem");
        this.patientLayerNervous = this.createAndAddLayer("insideLayers_nervousSystem");
    };
    MaskedLayer.prototype.createAndAddLayer = function (texture) {
        Logger_1.Logger.log(this, "MaskedLayer createAndAddLayer");
        var patientLayer = pixi_js_1.Sprite.fromFrame(texture);
        this.addChild(patientLayer);
        // offset layers so they correspond with skin layer
        patientLayer.x = 107;
        return patientLayer;
    };
    MaskedLayer.prototype.update = function (state) {
        this.patientLayerSkeletal.visible = false;
        this.patientLayerCardioVascular.visible = false;
        this.patientLayerMuscular.visible = false;
        this.patientLayerDigestive.visible = false;
        this.patientLayerRespiratoryAndUrinary.visible = false;
        this.patientLayerNervous.visible = false;
        Logger_1.Logger.log(this, "MaskedLayer update state == " + state);
        switch (state) {
            case Scanner_1.Scanner.SKELETAL:
                this.patientLayerSkeletal.visible = true;
                break;
            case Scanner_1.Scanner.CARDIOVASCULAR:
                this.patientLayerCardioVascular.visible = true;
                break;
            case Scanner_1.Scanner.MUSCULAR:
                this.patientLayerMuscular.visible = true;
                break;
            case Scanner_1.Scanner.DIGESTIVE:
                this.patientLayerDigestive.visible = true;
                break;
            case Scanner_1.Scanner.RESPIRATORY_AND_UNINARY:
                this.patientLayerRespiratoryAndUrinary.visible = true;
                break;
            case Scanner_1.Scanner.NERVOUS:
                this.patientLayerNervous.visible = true;
                break;
            default:
                break;
        }
    };
    MaskedLayer.prototype.destroy = function () {
        this.removeChildren();
        //TODO is the above enough or should we use below to remove children
        // this.patientLayerSkeletal = this.createAndAddLayer("insideLayers_skeletalSystem");
        // this.patientLayerCardioVascular = this.createAndAddLayer("insideLayers_cardiovascularSystem");
        // this.patientLayerMuscular = this.createAndAddLayer("insideLayers_muscularSystem");
        // this.patientLayerDigestive = this.createAndAddLayer("insideLayers_digestiveSystem");
        // this.patientLayerRespiratoryAndUrinary = this.createAndAddLayer("insideLayers_respiratoryAndUrinarySystem");
        // this.patientLayerNervous = this.createAndAddLayer("insideLayers_nervousSystem");
    };
    return MaskedLayer;
}(pixi_js_1.Sprite));
exports.MaskedLayer = MaskedLayer;
//# sourceMappingURL=MaskedLayer.js.map
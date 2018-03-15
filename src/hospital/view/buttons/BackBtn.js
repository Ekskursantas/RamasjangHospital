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
var ButtonEvent_1 = require("../../event/ButtonEvent");
var HospitalEvent_1 = require("../../event/HospitalEvent");
var Logger_1 = require("../../../loudmotion/utils/debug/Logger");
var Button_1 = require("../../../loudmotion/ui/Button");
var pixi_js_1 = require("pixi.js");
var AssetLoader_1 = require("../../utils/AssetLoader");
var AudioPlayer_1 = require("../../../loudmotion/utils/AudioPlayer");
var Config_1 = require("../../Config");
/**
 * Created by loudmotion on 01/03/2017.
 */
var BackBtn = /** @class */ (function (_super) {
    __extends(BackBtn, _super);
    function BackBtn(sprite, destination, textureName, posRight) {
        if (destination === void 0) { destination = HospitalEvent_1.HospitalEvent.QUIT_APP; }
        if (textureName === void 0) { textureName = "ramasjang_tilbagepil"; }
        if (posRight === void 0) { posRight = false; }
        var _this = _super.call(this) || this;
        _this.btnBackPressed = function (event) {
            Logger_1.Logger.log(_this, "BackBtn btnBackPressed");
            _this.btnBack.off(ButtonEvent_1.ButtonEvent.CLICKED, _this.btnBackPressed);
            // sndMan.stopSound(Config.currentSpeakSound); //TODO sound
            if (Config_1.Config.currentSpeakSound != null) {
                AudioPlayer_1.AudioPlayer.getInstance().stopSound(Config_1.Config.currentSpeakSound);
            }
            _this.emit(_this.destination);
        };
        _this.sprite = sprite;
        _this.destination = destination;
        _this.textureName = textureName;
        _this.createButton(posRight);
        return _this;
    }
    //TODO minigames and sound
    // private btnBackPressed(event:Event):void {
    //     clearTimeout(Config.currentTimeout);
    //     // sndMan.stopSound(Config.currentSpeakSound); //TODO sound
    //
    //     // dispatchEvent(new HospitalEvent(HospitalEvent.BACK_FROM_OPERATING_ROOM, true));
    //     this.emit(HospitalEvent.BACK_FROM_OPERATING_ROOM);
    // }
    //
    // private btnToWaitingRoomPressed(event:Event):void {
    //     clearTimeout(Config.currentTimeout);
    //     // sndMan.stopSound(Config.currentSpeakSound); //TODO sound
    //
    //     // dispatchEvent(new HospitalEvent(HospitalEvent.BACK_FROM_OPERATING_ROOM, true));
    //     this.emit(HospitalEvent.BACK_FROM_OPERATING_ROOM);
    // }
    BackBtn.prototype.createButton = function (posRight) {
        if (posRight === void 0) { posRight = false; }
        this.btnBack = new Button_1.Button();
        this.btnBack.addTexture(pixi_js_1.Texture.fromFrame(this.textureName));
        this.sprite.addChild(this.btnBack);
        this.btnBack.pivot.x = Math.floor(this.btnBack.width * .5);
        this.btnBack.pivot.y = Math.floor(this.btnBack.height * .5);
        this.btnBack.name = "back";
        if (posRight) {
            this.btnBack.x = Math.floor(AssetLoader_1.AssetLoader.STAGE_WIDTH - (BackBtn.OFFSET_X + Math.abs(Math.floor(AssetLoader_1.AssetLoader.getInstance().ratioX / 2))) - 15);
        }
        else {
            this.btnBack.x = Math.floor(this.btnBack.width + (BackBtn.OFFSET_X + Math.abs(Math.floor(AssetLoader_1.AssetLoader.getInstance().ratioX / 2))));
        }
        var addedY = posRight ? 20 : 0;
        this.btnBack.y = Math.floor(this.btnBack.height + BackBtn.OFFSET_Y + addedY + Math.abs(Math.floor(AssetLoader_1.AssetLoader.getInstance().ratioY / 2)) + addedY);
        this.btnBack.on(ButtonEvent_1.ButtonEvent.CLICKED, this.btnBackPressed);
    };
    BackBtn.prototype.destroy = function () {
        this.btnBack.off(ButtonEvent_1.ButtonEvent.CLICKED, this.btnBackPressed);
        this.sprite.removeChild(this.btnBack);
        Logger_1.Logger.log(this, "BackBtn this.btnBack destroy");
    };
    BackBtn.OFFSET_X = 20;
    BackBtn.OFFSET_Y = 600;
    return BackBtn;
}(pixi_js_1.Sprite));
exports.BackBtn = BackBtn;
//# sourceMappingURL=BackBtn.js.map
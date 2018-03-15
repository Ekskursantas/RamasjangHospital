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
var Button_1 = require("../../../loudmotion/ui/Button");
var ButtonEvent_1 = require("../../event/ButtonEvent");
var ItemsSelector_1 = require("./ItemsSelector");
var Config_1 = require("../../Config");
var Scanner_1 = require("../operatingroom/objects/Scanner");
var pixi_js_1 = require("pixi.js");
var Logger_1 = require("../../../loudmotion/utils/debug/Logger");
var AudioPlayer_1 = require("../../../loudmotion/utils/AudioPlayer");
var Graphics = PIXI.Graphics;
var HospitalGameView_1 = require("../HospitalGameView");
var UnlockedScreen = /** @class */ (function (_super) {
    __extends(UnlockedScreen, _super);
    function UnlockedScreen(giftDestination, contentType) {
        var _this = _super.call(this) || this;
        _this.wrappedGiftPressed = function (event) {
            _this.endHighlight();
            _this.wrappedGift.visible = false;
            _this.showUnlockedItem();
            _this.emit(UnlockedScreen.WRAPPED_GIFT_PRESSED);
        };
        _this.giftDestination = giftDestination;
        Logger_1.Logger.log(_this, "UnlockedScreen giftDestination == " + giftDestination.x + " : " + giftDestination.y);
        _this.contentType = contentType;
        _this.onAddedToStage();
        return _this;
    }
    UnlockedScreen.prototype.onAddedToStage = function () {
        this.createScreenArt();
        this.showWrappedGift();
        this.highlight();
    };
    UnlockedScreen.prototype.highlight = function () {
        TweenMax.to(this.wrappedGift, 0.5, { width: "+=40", height: "+=40", x: "+=20", y: "+=20", repeat: -1, yoyo: true, ease: Linear.easeNone });
    };
    UnlockedScreen.prototype.endHighlight = function () {
        TweenMax.killTweensOf(this.wrappedGift);
        this.wrappedGift.scale.x = this.wrappedGift.scale.y = 1;
        this.positionWrappedGift();
    };
    UnlockedScreen.prototype.showWrappedGift = function () {
        this.wrappedGift.visible = true;
        this.wrappedGift.on(ButtonEvent_1.ButtonEvent.CLICKED, this.wrappedGiftPressed);
    };
    UnlockedScreen.prototype.showUnlockedItem = function () {
        var unlockedItem;
        // Make sure level is not out of range (if patientsCured exceeds number of levels)
        var index = Config_1.Config.patientsCured < Config_1.Config.levels.length ? Config_1.Config.patientsCured : Config_1.Config.levels.length - 1;
        if (this.contentType == ItemsSelector_1.ItemsSelector.CLOTHES) {
            if (Config_1.Config.levels[index].unlockedClothes.length > 0) {
                unlockedItem = Config_1.Config.levels[index].unlockedClothes[0];
            }
        }
        else if (this.contentType == ItemsSelector_1.ItemsSelector.TREATS) {
            // Check if unlocked item of current level is Bandage
            if (Config_1.Config.levels[index].unlockedBandage.length > 0) {
                unlockedItem = Config_1.Config.levels[index].unlockedBandage[0];
            }
            // Check if unlocked item of current level is Band aid
            if (Config_1.Config.levels[index].unlockedBandAid.length > 0) {
                unlockedItem = Config_1.Config.levels[index].unlockedBandAid[0];
            }
            // Check if unlocked item of current level is Lemonade
            if (Config_1.Config.levels[index].unlockedLemonade.length > 0) {
                unlockedItem = Config_1.Config.levels[index].unlockedLemonade[0];
            }
        }
        if (unlockedItem) {
            this.unlockedItemSprite = pixi_js_1.Sprite.fromFrame(unlockedItem);
            var rectCover = new Graphics(); //TODO THIS IS IMPORTANT to get scaling to work.
            rectCover.beginFill(0xFFFFFF);
            rectCover.alpha = HospitalGameView_1.HospitalGameView.RECT_COVER_ALPHA;
            this.unlockedItemSprite.addChild(rectCover);
            rectCover.drawRect(this.unlockedItemSprite.x, this.unlockedItemSprite.y, this.unlockedItemSprite.width, this.unlockedItemSprite.height);
            this.addChild(this.unlockedItemSprite);
            this.unlockedItemSprite.pivot.x = this.unlockedItemSprite.width * .5;
            this.unlockedItemSprite.pivot.y = this.unlockedItemSprite.height * .5;
            this.unlockedItemSprite.x = this.wrappedGift.x - this.unlockedItemSprite.width * .5;
            this.unlockedItemSprite.y = this.wrappedGift.y - this.unlockedItemSprite.height * .5;
            TweenLite.to(this.unlockedItemSprite, 1, { x: this.giftDestination.x, y: this.giftDestination.y, delay: 1 });
            TweenLite.to(this.unlockedItemSprite.scale, 0.75, { x: 0.5, y: 0.5, delay: 1 });
            AudioPlayer_1.AudioPlayer.getInstance().playSound("klapsalve", 0, Config_1.Config.EFFECTS_VOLUME_LEVEL);
        }
    };
    UnlockedScreen.prototype.createScreenArt = function () {
        this.wrappedGift = new Button_1.Button();
        this.wrappedGift.addTexture(pixi_js_1.Texture.fromFrame("unlock_pakke"));
        this.wrappedGift.pivot.x = this.wrappedGift.width * .5;
        this.wrappedGift.pivot.y = this.wrappedGift.height * .5;
        this.addChild(this.wrappedGift);
        this.wrappedGift.visible = false;
        this.positionWrappedGift();
    };
    UnlockedScreen.prototype.positionWrappedGift = function () {
        if (this.contentType == ItemsSelector_1.ItemsSelector.CLOTHES) {
            this.wrappedGift.x = 800 + this.wrappedGift.width * .5;
            this.wrappedGift.y = 600;
        }
        else if (this.contentType == ItemsSelector_1.ItemsSelector.TREATS) {
            this.wrappedGift.x = 1000 + this.wrappedGift.width * .5;
            this.wrappedGift.y = 330 + this.wrappedGift.height * .25;
        }
    };
    UnlockedScreen.prototype.update = function () {
        // Make sure level is not out of range (if patientsCured exceeds number of levels)
        var index = Config_1.Config.patientsCured < Config_1.Config.levels.length ? Config_1.Config.patientsCured : Config_1.Config.levels.length - 1;
        // Bandage
        var bandageTexture = Config_1.Config.levels[index].unlockedBandage[0];
        if (bandageTexture) {
            this.bandageImage = pixi_js_1.Sprite.fromFrame(bandageTexture);
            this.addChild(this.bandageImage);
            this.bandageImage.pivot.x = this.bandageImage.width * .5;
            this.bandageImage.pivot.y = this.bandageImage.height * .5;
            this.bandageImage.x = 66 + this.bandageImage.width * .5;
            this.bandageImage.y = 90 + this.bandageImage.height * .5;
        }
        // Clothes
        var clothesTexture = Config_1.Config.levels[index].unlockedClothes[0];
        if (clothesTexture) {
            this.clothesImage = pixi_js_1.Sprite.fromFrame(clothesTexture);
            this.addChild(this.clothesImage);
            this.clothesImage.pivot.x = this.clothesImage.width * .5;
            this.clothesImage.pivot.y = this.clothesImage.height * .5;
            this.clothesImage.x = 340 + this.clothesImage.width * .5;
            this.clothesImage.y = 40 + this.clothesImage.height * .5;
        }
        var clothesTexture2 = Config_1.Config.levels[index].unlockedClothes[1];
        if (clothesTexture2) {
            this.clothesImage2 = pixi_js_1.Sprite.fromFrame(clothesTexture2);
            this.addChild(this.clothesImage2);
            this.clothesImage2.pivot.x = this.clothesImage2.width * .5;
            this.clothesImage2.pivot.y = this.clothesImage2.height * .5;
            this.clothesImage2.x = 340 + this.clothesImage2.width * .5;
            this.clothesImage2.y = 350 + this.clothesImage2.height * .5;
        }
        // Scanner
        this.scanner = new Scanner_1.Scanner();
        this.addChild(this.scanner);
        this.scanner.x = 36;
        this.scanner.y = 370;
        this.scanner.setUnlockedMode();
        var unlockedTool = Config_1.Config.levels[index].unlockedTools[0];
        if (unlockedTool) {
            this.scanner.highlightButton(unlockedTool, true);
        }
        this.scanner.scale.x = this.scanner.scale.y = 0.5;
    };
    UnlockedScreen.prototype.destroy = function () {
        if (this.wrappedGift != null) {
            this.removeChild(this.wrappedGift);
            this.wrappedGift = null;
        }
        if (this.unlockedItemSprite != null) {
            this.removeChild(this.unlockedItemSprite);
            this.unlockedItemSprite = null;
        }
        if (this.bandageImage != null) {
            this.removeChild(this.bandageImage);
            this.bandageImage = null;
        }
        if (this.clothesImage != null) {
            this.removeChild(this.clothesImage);
            this.clothesImage = null;
        }
        if (this.clothesImage2 != null) {
            this.removeChild(this.clothesImage2);
            this.clothesImage2 = null;
        }
        if (this.scanner != null) {
            this.removeChild(this.scanner);
            this.scanner.destroy();
            this.scanner = null;
        }
        // super.destroy();
    };
    UnlockedScreen.WRAPPED_GIFT_PRESSED = "appdrhospital.view.objects.UnlockedScreen.WRAPPED_GIFT_PRESSED";
    return UnlockedScreen;
}(pixi_js_1.Sprite));
exports.UnlockedScreen = UnlockedScreen;
//# sourceMappingURL=UnlockedScreen.js.map
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
var InflatableButton_1 = require("./InflatableButton");
var Button_1 = require("../../../loudmotion/ui/Button");
var Config_1 = require("../../Config");
var TreatItem_1 = require("../operatingroom/objects/TreatItem");
var ClothesItem_1 = require("../waitingroom/objects/ClothesItem");
var ButtonEvent_1 = require("../../event/ButtonEvent");
var Logger_1 = require("../../../loudmotion/utils/debug/Logger");
var pixi_js_1 = require("pixi.js");
var AudioPlayer_1 = require("../../../loudmotion/utils/AudioPlayer");
var AssetLoader_1 = require("../../utils/AssetLoader");
var Rectangle = PIXI.Rectangle;
var ItemsSelector = /** @class */ (function (_super) {
    __extends(ItemsSelector, _super);
    function ItemsSelector(contentType, draggableObjectTarget) {
        if (draggableObjectTarget === void 0) { draggableObjectTarget = null; }
        var _this = _super.call(this) || this;
        _this.navigationButtonListener = function (event) {
            var nextIndex;
            nextIndex = (_this.items.indexOf(_this.focusedItem_1) + 4) % _this.items.length;
            _this.focusItems(nextIndex);
        };
        _this.bagPressed = function (event) {
            Logger_1.Logger.log(_this, "Bag Was Pressed");
            console.log("Bag was Pressed");
            _this.hasBeenClicked = true;
            _this.endHighlight();
            if (_this.state == ItemsSelector.CLOSED) {
                _this.setState(ItemsSelector.OPEN);
                _this.emit(ItemsSelector.OPEN);
            }
            else if (_this.state == ItemsSelector.OPEN) {
                _this.setState(ItemsSelector.CLOSED);
                _this.emit(ItemsSelector.CLOSED);
            }
            AudioPlayer_1.AudioPlayer.getInstance().playSound("toj_swipe_swoosh", 0, Config_1.Config.EFFECTS_VOLUME_LEVEL);
        };
        _this.contentType = contentType;
        _this.draggableObjectTarget = draggableObjectTarget;
        _this.clothesSpeakCounter = 0;
        _this.placedBandageItem = null;
        _this.placedLemonadeItem = null;
        _this.placedBandAidItem_1 = null;
        _this.placedBandAidItem_2 = null;
        _this.placedBandAidItem_3 = null;
        _this._offSetPosX = AssetLoader_1.AssetLoader.STAGE_WIDTH * .5;
        _this._offSetPosY = 630;
        _this.onAddedToStage();
        return _this;
    }
    Object.defineProperty(ItemsSelector.prototype, "offSetPosY", {
        get: function () {
            return this._offSetPosY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemsSelector.prototype, "offSetPosX", {
        get: function () {
            return this._offSetPosX;
        },
        enumerable: true,
        configurable: true
    });
    ItemsSelector.prototype.onAddedToStage = function () {
        if (this.contentType == ItemsSelector.TREATS) {
            this.createTreatTargets();
        }
        this.createSelectorArt();
        if (this.contentType == ItemsSelector.CLOTHES) {
            this.createClothesItems();
            ClothesItem_1.ClothesItem.clothesSpeakCounter = 0;
        }
        if (this.contentType == ItemsSelector.TREATS) {
            this.createTreatItems();
        }
        this.createBagButtons();
        this.initNavigationButtons();
        this.focusItems(0);
        this.setState(ItemsSelector.CLOSED);
        // sndMan = SoundManager.getInstance(); //TODO sound
    };
    ItemsSelector.prototype.highlight = function () {
        // TweenMax.to(this.bagClosed, 0.5, {width:"+=40", height:"+=40", x:"-=20", y:"-20", repeat:-1, yoyo:true, ease:Linear.easeNone});
        TweenMax.to(this.bagClosed, 0.5, { width: "+=40", height: "+=40", repeat: -1, yoyo: true, ease: Linear.easeNone });
    };
    Object.defineProperty(ItemsSelector.prototype, "bagClosedPos", {
        get: function () {
            Logger_1.Logger.log(this, "ItemSelector bagClosedPos this.bagClosed.height == " + this.bagClosed.height);
            return new Rectangle(this.x + this.bagClosed.x, this.y + this.bagClosed.y, this.bagClosed.width, this.bagClosed.height);
        },
        enumerable: true,
        configurable: true
    });
    ItemsSelector.prototype.endHighlight = function () {
        this.bagClosed.scale.x = this.bagClosed.scale.y = 1;
        // this.bagClosed.x = AssetLoader.STAGE_WIDTH - this.background.width * .5;
        // this.bagClosed.y = AssetLoader.STAGE_HEIGHT - this.bagClosed.height * .5 - 20;
        TweenMax.killTweensOf(this.bagClosed);
    };
    ItemsSelector.prototype.setState = function (state) {
        Logger_1.Logger.log(this, "ItemSelector setState  state == " + state);
        Logger_1.Logger.log(this, "ItemSelector this.focusedItem_1 == " + this.focusedItem_1);
        Logger_1.Logger.log(this, "ItemSelector this.focusedItem_2 == " + this.focusedItem_2);
        Logger_1.Logger.log(this, "ItemSelector this.focusedItem_3 == " + this.focusedItem_3);
        Logger_1.Logger.log(this, "ItemSelector this.focusedItem_4 == " + this.focusedItem_4);
        this.state = state;
        this.background.visible = false;
        this.btnPrevious.visible = false;
        this.bagClosed.visible = false;
        this.bagOpen.visible = false;
        if (this.focusedItem_1 != null) {
            this.focusedItem_1.visible = false;
        }
        if (this.focusedItem_2 != null) {
            this.focusedItem_2.visible = false;
        }
        if (this.focusedItem_3 != null) {
            this.focusedItem_3.visible = false;
        }
        if (this.focusedItem_4 != null) {
            this.focusedItem_4.visible = false;
        }
        switch (state) {
            case ItemsSelector.CLOSED:
                this.bagClosed.visible = true;
                break;
            case ItemsSelector.OPEN:
                this.bagOpen.visible = true;
                this.background.visible = true;
                if (this.items.length > 4) {
                    this.btnPrevious.visible = true;
                }
                if (this.focusedItem_1) {
                    this.focusedItem_1.visible = true;
                }
                if (this.focusedItem_2) {
                    this.focusedItem_2.visible = true;
                }
                if (this.focusedItem_3) {
                    this.focusedItem_3.visible = true;
                }
                if (this.focusedItem_4) {
                    this.focusedItem_4.visible = true;
                }
                break;
            case ItemsSelector.OPEN_BAG_ONLY:
                this.bagOpen.visible = true;
                break;
            default:
                break;
        }
    };
    ItemsSelector.prototype.placeTreatItem = function (treatItem, bandAidTarget) {
        var _this = this;
        if (bandAidTarget === void 0) { bandAidTarget = ""; }
        Logger_1.Logger.log(this, "ItemSelector placeTreatItem  treatItem == " + treatItem + " : treatItem.type == " + treatItem.type + " : bandAidTarget == " + bandAidTarget);
        switch (treatItem.type) {
            case TreatItem_1.TreatItem.BANDAGE:
                Logger_1.Logger.log(this, "ItemSelector placeTreatItem TreatItem.BANDAGE this.placedBandageItem == " + this.placedBandageItem);
                if (this.placedBandageItem != null) {
                    this.draggableObjectBandageTarget.removeChild(this.placedBandageItem);
                    this.placedBandageItem = null;
                }
                this.placedBandageItem = treatItem;
                this.draggableObjectBandageTarget.addChild(this.placedBandageItem);
                Logger_1.Logger.log(this, "ItemSelector placeTreatItem TreatItem.BANDAGE this.placedBandageItem == " + this.placedBandageItem);
                break;
            case TreatItem_1.TreatItem.BAND_AID:
                if (bandAidTarget == TreatItem_1.TreatItem.BAND_AID_TARGET_1) {
                    if (this.placedBandAidItem_1 != null) {
                        this.draggableObjectBandAidTarget_1.removeChild(this.placedBandAidItem_1);
                        this.placedBandAidItem_1 = null;
                    }
                    this.placedBandAidItem_1 = treatItem;
                    this.draggableObjectBandAidTarget_1.addChild(this.placedBandAidItem_1);
                    break;
                }
                else if (bandAidTarget == TreatItem_1.TreatItem.BAND_AID_TARGET_2) {
                    if (this.placedBandAidItem_2 != null) {
                        this.draggableObjectBandAidTarget_2.removeChild(this.placedBandAidItem_2);
                        this.placedBandAidItem_2 = null;
                    }
                    this.placedBandAidItem_2 = treatItem;
                    this.draggableObjectBandAidTarget_2.addChild(this.placedBandAidItem_2);
                    break;
                }
                else if (bandAidTarget == TreatItem_1.TreatItem.BAND_AID_TARGET_3) {
                    if (this.placedBandAidItem_3 != null) {
                        this.draggableObjectBandAidTarget_3.removeChild(this.placedBandAidItem_3);
                        this.placedBandAidItem_3 = null;
                    }
                    this.placedBandAidItem_3 = treatItem;
                    this.draggableObjectBandAidTarget_3.addChild(this.placedBandAidItem_3);
                    break;
                }
                break;
            case TreatItem_1.TreatItem.LEMONADE:
                if (this.placedLemonadeItem != null) {
                    this.draggableObjectGlassTarget.removeChild(this.placedLemonadeItem);
                    this.placedLemonadeItem = null;
                }
                this.placedLemonadeItem = treatItem;
                this.draggableObjectGlassTarget.addChild(this.placedLemonadeItem);
                TweenLite.to(this.placedLemonadeItem, 1, { alpha: 0, delay: 1, onComplete: function () {
                        _this.draggableObjectGlassTarget.visible = false;
                    } });
                AudioPlayer_1.AudioPlayer.getInstance().playSound("drink_water", 0, Config_1.Config.SPEAK_VOLUME_LEVEL);
                break;
            default:
                break;
        }
    };
    ItemsSelector.prototype.updateTreatItemTargets = function (treatItem, active, delay) {
        if (delay === void 0) { delay = false; }
        switch (treatItem.type) {
            case TreatItem_1.TreatItem.BANDAGE:
                this.draggableObjectBandageTarget.visible = active || this.placedBandageItem != null;
                break;
            case TreatItem_1.TreatItem.BAND_AID:
                this.draggableObjectBandAidTarget_1.visible = active || this.placedBandAidItem_1 != null;
                this.draggableObjectBandAidTarget_2.visible = active || this.placedBandAidItem_2 != null;
                this.draggableObjectBandAidTarget_3.visible = active || this.placedBandAidItem_3 != null;
                if (active) {
                    this.draggableObjectBandAidTarget_1.scale.x = this.draggableObjectBandAidTarget_1.scale.y = 1;
                    this.draggableObjectBandAidTarget_2.scale.x = this.draggableObjectBandAidTarget_2.scale.y = 1;
                    this.draggableObjectBandAidTarget_3.scale.x = this.draggableObjectBandAidTarget_3.scale.y = 1;
                }
                else {
                }
                break;
            case TreatItem_1.TreatItem.LEMONADE:
                if (delay) {
                    this.draggableObjectGlassTarget.visible = true;
                }
                else {
                    this.draggableObjectGlassTarget.visible = active;
                }
                break;
            default:
                break;
        }
    };
    ItemsSelector.prototype.initNavigationButtons = function () {
        this.btnPrevious.on(ButtonEvent_1.ButtonEvent.CLICKED, this.navigationButtonListener);
        this.btnPrevious.padding = 50;
    };
    ItemsSelector.prototype.focusItems = function (firstItemIndex) {
        if (this.items.length < 5) {
            this.btnPrevious.visible = false;
        }
        if (this.focusedItem_1 != null) {
            this.removeChild(this.focusedItem_1);
            this.focusedItem_1 = null;
        }
        if (this.focusedItem_2 != null) {
            this.removeChild(this.focusedItem_2);
            this.focusedItem_2 = null;
        }
        if (this.focusedItem_3 != null) {
            this.removeChild(this.focusedItem_3);
            this.focusedItem_3 = null;
        }
        if (this.focusedItem_4 != null) {
            this.removeChild(this.focusedItem_4);
            this.focusedItem_4 = null;
        }
        this.focusedItem_1 = this.items[firstItemIndex];
        if (this.focusedItem_1 != null) {
            this.addChild(this.focusedItem_1);
            this.focusedItem_1.x = this.offSetPosX - 270;
            if (this.contentType == ItemsSelector.TREATS && this.focusedItem_1.type == TreatItem_1.TreatItem.LEMONADE) {
                this.focusedItem_1.y = this.offSetPosY - 50;
            }
            else {
                this.focusedItem_1.y = this.offSetPosY + 0;
            }
            this.focusedItem_1.initialPosition = new pixi_js_1.Point(this.focusedItem_1.x, this.focusedItem_1.y);
        }
        if (this.items.length > firstItemIndex + 1) {
            this.focusedItem_2 = this.items[firstItemIndex + 1];
        }
        else {
            this.focusedItem_2 = this.items[(firstItemIndex + 1) % this.items.length];
        }
        if (this.focusedItem_2 != null) {
            this.addChild(this.focusedItem_2);
            this.focusedItem_2.x = this.offSetPosX - 90;
            if (this.contentType == ItemsSelector.TREATS && this.focusedItem_2.type == TreatItem_1.TreatItem.LEMONADE) {
                this.focusedItem_2.y = this.offSetPosY - 50;
            }
            else {
                this.focusedItem_2.y = this.offSetPosY + 0;
            }
            this.focusedItem_2.initialPosition = new pixi_js_1.Point(this.focusedItem_2.x, this.focusedItem_2.y);
        }
        if (this.items.length > firstItemIndex + 2) {
            this.focusedItem_3 = this.items[firstItemIndex + 2];
        }
        else {
            this.focusedItem_3 = this.items[(firstItemIndex + 2) % this.items.length];
        }
        if (this.focusedItem_3 != null) {
            this.addChild(this.focusedItem_3);
            this.focusedItem_3.x = this.offSetPosX + 90;
            if (this.contentType == ItemsSelector.TREATS && this.focusedItem_3.type == TreatItem_1.TreatItem.LEMONADE) {
                this.focusedItem_3.y = this.offSetPosY - 50;
            }
            else {
                this.focusedItem_3.y = this.offSetPosY + 0;
            }
            this.focusedItem_3.initialPosition = new pixi_js_1.Point(this.focusedItem_3.x, this.focusedItem_3.y);
        }
        if (this.items.length > firstItemIndex + 3) {
            this.focusedItem_4 = this.items[firstItemIndex + 3];
        }
        else {
            this.focusedItem_4 = this.items[(firstItemIndex + 3) % this.items.length];
        }
        if (this.focusedItem_4 != null) {
            this.addChild(this.focusedItem_4);
            this.focusedItem_4.x = this.offSetPosX + 270;
            if (this.contentType == ItemsSelector.TREATS && this.focusedItem_4.type == TreatItem_1.TreatItem.LEMONADE) {
                this.focusedItem_4.y = this.offSetPosY - 50;
            }
            else {
                this.focusedItem_4.y = this.offSetPosY + 0;
            }
            this.focusedItem_4.initialPosition = new pixi_js_1.Point(this.focusedItem_4.x, this.focusedItem_4.y);
        }
    };
    ItemsSelector.prototype.createClothesItems = function () {
        this.items = [];
        var unlockedClothes = Config_1.Config.getUnlockedClothes();
        // Sort in upper and under
        for (var k = 0; k < unlockedClothes.length; k++) {
            var nextClothesTextureBottom = unlockedClothes[k];
            if (nextClothesTextureBottom.substr(0, 12) == "clothesLower") {
                var clothesItemBottom = new ClothesItem_1.ClothesItem(nextClothesTextureBottom, ClothesItem_1.ClothesItem.BOTTOM);
                this.items.push(clothesItemBottom);
            }
        }
        for (var l = 0; l < unlockedClothes.length; l++) {
            var nextClothesTextureTop = unlockedClothes[l];
            if (nextClothesTextureTop.substr(0, 12) == "clothesUpper") {
                var clothesItemTop = new ClothesItem_1.ClothesItem(nextClothesTextureTop, ClothesItem_1.ClothesItem.TOP);
                this.items.push(clothesItemTop);
            }
        }
    };
    ItemsSelector.prototype.createTreatItems = function () {
        this.items = [];
        var unlockedBandages = Config_1.Config.getUnlockedBandages();
        for (var i = 0; i < unlockedBandages.length; i++) {
            var nextBandageTexture = unlockedBandages[i];
            var nextBandage = new TreatItem_1.TreatItem(this, nextBandageTexture, TreatItem_1.TreatItem.BANDAGE, this.draggableObjectBandageTarget);
            this.items.push(nextBandage);
        }
        var unlockedLemonades = Config_1.Config.getUnlockedLemonades();
        for (var j = 0; j < unlockedLemonades.length; j++) {
            var nextLemonadeTexture = unlockedLemonades[j];
            var nextLemonade = new TreatItem_1.TreatItem(this, nextLemonadeTexture, TreatItem_1.TreatItem.LEMONADE, this.draggableObjectGlassTarget);
            this.items.push(nextLemonade);
        }
        var unlockedBandAids = Config_1.Config.getUnlockedbandAids();
        for (var k = 0; k < unlockedBandAids.length; k++) {
            var nextBandAidTexture = unlockedBandAids[k];
            var nextBandAid = new TreatItem_1.TreatItem(this, nextBandAidTexture, TreatItem_1.TreatItem.BAND_AID, this.draggableObjectBandAidTarget_1, this.draggableObjectBandAidTarget_2, this.draggableObjectBandAidTarget_3);
            this.items.push(nextBandAid);
        }
    };
    ItemsSelector.prototype.createTreatTargets = function () {
        // Show bandage target
        var draggableObjectBandageTargetImage = pixi_js_1.Sprite.fromFrame("forbinding_gips_01");
        draggableObjectBandageTargetImage.alpha = ItemsSelector.DRAGGABLE_ON_ALPHA;
        this.draggableObjectBandageTarget = new pixi_js_1.Sprite();
        this.draggableObjectBandageTarget.addChild(draggableObjectBandageTargetImage);
        draggableObjectBandageTargetImage.pivot.x = draggableObjectBandageTargetImage.width * .5;
        draggableObjectBandageTargetImage.pivot.y = draggableObjectBandageTargetImage.height * .5;
        this.addChild(this.draggableObjectBandageTarget);
        this.draggableObjectBandageTarget.x = 480 - this.x; //TODO
        this.draggableObjectBandageTarget.y = 523 - this.y;
        this.draggableObjectBandageTarget.visible = false;
        // Show glass target
        var draggableObjectGlassTargetImage = pixi_js_1.Sprite.fromFrame("saftevand_02");
        draggableObjectGlassTargetImage.alpha = ItemsSelector.DRAGGABLE_ON_ALPHA;
        this.draggableObjectGlassTarget = new pixi_js_1.Sprite();
        this.draggableObjectGlassTarget.addChild(draggableObjectGlassTargetImage);
        draggableObjectGlassTargetImage.pivot.x = draggableObjectGlassTargetImage.width * .5;
        draggableObjectGlassTargetImage.pivot.y = draggableObjectGlassTargetImage.height * .5;
        this.addChild(this.draggableObjectGlassTarget);
        this.draggableObjectGlassTarget.x = 625 - this.x;
        this.draggableObjectGlassTarget.y = 360 - this.y;
        this.draggableObjectGlassTarget.visible = false;
        // Show band aid targets
        var draggableObjectBandAidTargetImage = pixi_js_1.Sprite.fromFrame("plaster_01");
        draggableObjectBandAidTargetImage.alpha = ItemsSelector.DRAGGABLE_ON_ALPHA;
        this.draggableObjectBandAidTarget_1 = new pixi_js_1.Sprite();
        this.draggableObjectBandAidTarget_1.addChild(draggableObjectBandAidTargetImage);
        draggableObjectBandAidTargetImage.pivot.x = draggableObjectBandAidTargetImage.width * .5;
        draggableObjectBandAidTargetImage.pivot.y = draggableObjectBandAidTargetImage.height * .5;
        this.addChild(this.draggableObjectBandAidTarget_1);
        this.draggableObjectBandAidTarget_1.x = 690 - this.x;
        this.draggableObjectBandAidTarget_1.y = 504 - this.y;
        this.draggableObjectBandAidTarget_1.visible = false;
        var draggableObjectBandAidTargetImage_2 = pixi_js_1.Sprite.fromFrame("plaster_01");
        draggableObjectBandAidTargetImage_2.alpha = ItemsSelector.DRAGGABLE_ON_ALPHA;
        this.draggableObjectBandAidTarget_2 = new pixi_js_1.Sprite();
        this.draggableObjectBandAidTarget_2.addChild(draggableObjectBandAidTargetImage_2);
        draggableObjectBandAidTargetImage_2.pivot.x = draggableObjectBandAidTargetImage_2.width * .5;
        draggableObjectBandAidTargetImage_2.pivot.y = draggableObjectBandAidTargetImage_2.height * .5;
        this.addChild(this.draggableObjectBandAidTarget_2);
        this.draggableObjectBandAidTarget_2.x = 550 - this.x;
        this.draggableObjectBandAidTarget_2.y = 300 - this.y;
        this.draggableObjectBandAidTarget_2.visible = false;
        var draggableObjectBandAidTargetImage_3 = pixi_js_1.Sprite.fromFrame("plaster_01");
        draggableObjectBandAidTargetImage_3.alpha = ItemsSelector.DRAGGABLE_ON_ALPHA;
        this.draggableObjectBandAidTarget_3 = new pixi_js_1.Sprite();
        this.draggableObjectBandAidTarget_3.addChild(draggableObjectBandAidTargetImage_3);
        draggableObjectBandAidTargetImage_3.pivot.x = draggableObjectBandAidTargetImage_3.width * .5;
        draggableObjectBandAidTargetImage_3.pivot.y = draggableObjectBandAidTargetImage_3.height * .5;
        this.addChild(this.draggableObjectBandAidTarget_3);
        this.draggableObjectBandAidTarget_3.x = 565 - this.x;
        this.draggableObjectBandAidTarget_3.y = 700 - this.y;
        this.draggableObjectBandAidTarget_3.visible = false;
    };
    ItemsSelector.prototype.createSelectorArt = function () {
        this.background = pixi_js_1.Sprite.fromFrame("unlock_bg");
        this.addChild(this.background);
        this.background.scale.x = this.background.scale.y = 2;
        this.background.pivot.x = this.background.width * .5;
        this.background.pivot.y = this.background.height * .5;
        this.background.x = this._offSetPosX + this.background.width * .5 - 10;
        this.background.y = this._offSetPosY + this.background.height * .5;
        this.btnPrevious = new InflatableButton_1.InflatableButton();
        this.btnPrevious.addTexture(pixi_js_1.Texture.fromFrame("unlock_leftArrow"));
        this.addChild(this.btnPrevious);
        this.btnPrevious.x = this._offSetPosX - this.background.width * .5;
        this.btnPrevious.y = this._offSetPosY;
    };
    ItemsSelector.prototype.createBagButtons = function () {
        var offSetPosY = 0;
        if (this.contentType == ItemsSelector.CLOTHES) {
            this.bagOpen = new Button_1.Button();
            this.bagOpen.addTexture(pixi_js_1.Texture.fromFrame("kuffert_aaben"));
            this.bagClosed = new Button_1.Button();
            this.bagClosed.addTexture(pixi_js_1.Texture.fromFrame("kuffert_lukket"));
        }
        else if (this.contentType == ItemsSelector.TREATS) {
            this.bagOpen = new Button_1.Button();
            this.bagOpen.addTexture(pixi_js_1.Texture.fromFrame("laegetaske_aaben"));
            this.bagClosed = new Button_1.Button();
            this.bagClosed.addTexture(pixi_js_1.Texture.fromFrame("laegetaske_lukket"));
            offSetPosY = this.bagClosed.height * .25;
        }
        this.addChild(this.bagOpen);
        this.bagOpen.x = this._offSetPosX + this.background.width * .5;
        this.bagOpen.y = this._offSetPosY + offSetPosY;
        this.addChild(this.bagClosed);
        this.bagClosed.x = this.bagOpen.x; //this.background.width * .5;
        this.bagClosed.y = this.bagOpen.y; //this.bagClosed.height * .5 - 20;
        this.bagOpen.on(ButtonEvent_1.ButtonEvent.CLICKED, this.bagPressed);
        this.bagClosed.on(ButtonEvent_1.ButtonEvent.CLICKED, this.bagPressed);
    };
    ItemsSelector.prototype.destroy = function () {
        if (this.background != null) {
            this.removeChild(this.background);
            this.background = null;
        }
        if (this.bagOpen != null) {
            this.removeChild(this.bagOpen);
            this.bagOpen.off(ButtonEvent_1.ButtonEvent.CLICKED, this.bagPressed);
            this.bagOpen = null;
        }
        if (this.bagClosed != null) {
            this.removeChild(this.bagClosed);
            this.bagClosed.off(ButtonEvent_1.ButtonEvent.CLICKED, this.bagPressed);
            this.bagClosed = null;
        }
        if (this.btnPrevious != null) {
            this.removeChild(this.btnPrevious);
            this.btnPrevious.off(ButtonEvent_1.ButtonEvent.CLICKED, this.navigationButtonListener);
            this.btnPrevious = null;
        }
        if (this.focusedItem_1 != null) {
            this.removeChild(this.focusedItem_1);
            this.focusedItem_1 = null;
        }
        if (this.focusedItem_2 != null) {
            this.removeChild(this.focusedItem_2);
            this.focusedItem_2 = null;
        }
        if (this.focusedItem_3 != null) {
            this.removeChild(this.focusedItem_3);
            this.focusedItem_3 = null;
        }
        if (this.focusedItem_4 != null) {
            this.removeChild(this.focusedItem_4);
            this.focusedItem_4 = null;
        }
        if (this.draggableObjectTarget != null) {
            this.draggableObjectTarget = null;
        }
        if (this.draggableObjectBandageTarget != null) {
            this.removeChild(this.draggableObjectBandageTarget);
            this.draggableObjectBandageTarget = null;
        }
        if (this.draggableObjectGlassTarget != null) {
            this.removeChild(this.draggableObjectGlassTarget);
            this.draggableObjectGlassTarget.removeChildren();
            this.draggableObjectGlassTarget = null;
        }
        if (this.draggableObjectBandAidTarget_1 != null) {
            this.removeChild(this.draggableObjectBandAidTarget_1);
            this.draggableObjectBandAidTarget_1.removeChildren();
            this.draggableObjectBandAidTarget_1 = null;
        }
        if (this.draggableObjectBandAidTarget_2 != null) {
            this.removeChild(this.draggableObjectBandAidTarget_2);
            this.draggableObjectBandAidTarget_2.removeChildren();
            this.draggableObjectBandAidTarget_2 = null;
        }
        if (this.draggableObjectBandAidTarget_3 != null) {
            this.removeChild(this.draggableObjectBandAidTarget_3);
            this.draggableObjectBandAidTarget_3.removeChildren();
            this.draggableObjectBandAidTarget_3 = null;
        }
    };
    ItemsSelector.DRAGGABLE_ON_ALPHA = 0.5;
    ItemsSelector.CLOTHES = "appdrhospital.view.objects.ItemsSelector.clothes";
    ItemsSelector.TREATS = "appdrhospital.view.objects.ItemsSelector.treats";
    ItemsSelector.CLOSED = "appdrhospital.view.objects.ItemsSelector.CLOSED";
    ItemsSelector.OPEN = "appdrhospital.view.objects.ItemsSelector.OPEN";
    ItemsSelector.OPEN_BAG_ONLY = "appdrhospital.view.objects.ItemsSelector.OPEN_BAG_ONLY";
    ItemsSelector.OPENED = "appdrhospital.view.objects.ItemsSelector.OPENED";
    ItemsSelector.HAS_CLOSED = "appdrhospital.view.objects.ItemsSelector.HAS_CLOSED";
    return ItemsSelector;
}(pixi_js_1.Sprite));
exports.ItemsSelector = ItemsSelector;
//# sourceMappingURL=ItemsSelector.js.map
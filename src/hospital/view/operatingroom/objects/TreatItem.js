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
var DraggableItem_1 = require("../../objects/DraggableItem");
var Config_1 = require("../../../Config");
var TouchLoudEvent_1 = require("../../../../loudmotion/events/TouchLoudEvent");
var ItemsSelector_1 = require("../../objects/ItemsSelector");
var HospitalEvent_1 = require("../../../event/HospitalEvent");
var pixi_js_1 = require("pixi.js");
var SpriteHelper_1 = require("../../../../loudmotion/utils/SpriteHelper");
var Logger_1 = require("../../../../loudmotion/utils/debug/Logger");
var AssetLoader_1 = require("../../../utils/AssetLoader");
var AudioPlayer_1 = require("../../../../loudmotion/utils/AudioPlayer");
var HospitalGameView_1 = require("../../HospitalGameView");
var TreatItem = /** @class */ (function (_super) {
    __extends(TreatItem, _super);
    function TreatItem(itemsSelector, treatTexture, type, draggableObjectTarget_1, draggableObjectTarget_2, draggableObjectTarget_3, interactive) {
        if (type === void 0) { type = TreatItem.BANDAGE; }
        if (draggableObjectTarget_1 === void 0) { draggableObjectTarget_1 = null; }
        if (draggableObjectTarget_2 === void 0) { draggableObjectTarget_2 = null; }
        if (draggableObjectTarget_3 === void 0) { draggableObjectTarget_3 = null; }
        if (interactive === void 0) { interactive = true; }
        var _this = _super.call(this) || this;
        _this.touchDown = function (event) {
            Logger_1.Logger.log(_this, "TreatItem touchDown  event.type == " + event.type);
            _this.mouseDown = true;
            _this.parent.setChildIndex(_this, _this.parent.children.length - 1);
            _this.removeChild(_this.treatImage);
            _this.addChild(_this.specificTreatImage);
            var parentItem = _this.parent;
            parentItem.setState(ItemsSelector_1.ItemsSelector.CLOSED);
            parentItem.updateTreatItemTargets(_this, true);
            if (_this.draggableObjectTarget_1 != null) {
                Logger_1.Logger.log(_this, "TreatItem touchDown  this.draggableObjectTarget_1 == " + _this.draggableObjectTarget_1 + " : SpriteHelper.hitTest(this.getBounds(), this.draggableObjectTarget_1.getBounds()) == " + SpriteHelper_1.SpriteHelper.hitTest(_this.rectCover.getBounds(), _this.draggableObjectTarget_1.getBounds()));
            }
            _this.visible = true;
            Logger_1.Logger.log(_this, "TreatItem touchDown  this.x == " + _this.x + " : this.y == " + _this.y);
        };
        _this.touchMove = function (event) {
            if (_this.mouseDown) {
                var parentItem = _this.parent;
                var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
                _this.x = mousePositionCanvas.x - parentItem.x;
                _this.y = mousePositionCanvas.y - parentItem.y;
                _this.checkCollisionWithTarget();
                // Logger.log(this, "TreatItem touchMove  this.x == "+this.x+" : this.y == "+this.y);
            }
        };
        _this.touchDone = function (event) {
            Logger_1.Logger.log(_this, "TreatItem touchDone  event.type == " + event.type);
            _this.mouseDown = false;
            // if(this.checkCollision(this, this.draggableObjectTarget_1)){
            var hit1 = (_this.draggableObjectTarget_1 != null && SpriteHelper_1.SpriteHelper.hitTest(_this.rectCover.getBounds(), _this.draggableObjectTarget_1.getBounds()));
            var hit2 = (_this.draggableObjectTarget_2 != null && SpriteHelper_1.SpriteHelper.hitTest(_this.rectCover.getBounds(), _this.draggableObjectTarget_2.getBounds()));
            var hit3 = (_this.draggableObjectTarget_3 != null && SpriteHelper_1.SpriteHelper.hitTest(_this.rectCover.getBounds(), _this.draggableObjectTarget_3.getBounds()));
            Logger_1.Logger.log(_this, "TreatItem touchDone  hit1 == " + hit1);
            Logger_1.Logger.log(_this, "TreatItem touchDone  hit2 == " + hit2);
            Logger_1.Logger.log(_this, "TreatItem touchDone  hit3 == " + hit3);
            if (hit1) {
                _this.draggableObjectTarget_1.alpha = 1;
                if (_this._type == TreatItem.LEMONADE) {
                    TweenLite.to(_this, 0.5, { x: _this.draggableObjectTarget_1.x, y: _this.draggableObjectTarget_1.y, onComplete: _this.onSnappedToTarget });
                }
                else if (_this._type == TreatItem.BAND_AID) {
                    TweenLite.to(_this, 0.5, { x: _this.draggableObjectTarget_1.x, y: _this.draggableObjectTarget_1.y, onComplete: _this.onSnappedToTarget, onCompleteParams: [TreatItem.BAND_AID_TARGET_1] });
                    TweenLite.to(_this.draggableObjectTarget_1, 0.5, { scaleX: 0.3, scaleY: 0.3, delay: 0.5 });
                    TweenLite.to(_this.draggableObjectTarget_2, 0.5, { scaleX: 0.3, scaleY: 0.3, delay: 0.5 });
                    TweenLite.to(_this.draggableObjectTarget_3, 0.5, { scaleX: 0.3, scaleY: 0.3, delay: 0.5 });
                    AudioPlayer_1.AudioPlayer.getInstance().playSound("gips", 0, Config_1.Config.EFFECTS_VOLUME_LEVEL);
                }
                else {
                    TweenLite.to(_this, 0.5, { x: _this.draggableObjectTarget_1.x, y: _this.draggableObjectTarget_1.y, onComplete: _this.onSnappedToTarget });
                    AudioPlayer_1.AudioPlayer.getInstance().playSound("gips", 0, Config_1.Config.EFFECTS_VOLUME_LEVEL);
                }
                _this.alpha = 0;
                TweenLite.to(_this, .3, { alpha: 1 });
                // }else if(this.draggableObjectTarget_2 && this.checkCollision(this, this.draggableObjectTarget_2)){
            }
            else if (hit2) {
                _this.draggableObjectTarget_2.alpha = 1;
                // Only band aid has more than one target
                TweenLite.to(_this, 0.5, { x: _this.draggableObjectTarget_2.x, y: _this.draggableObjectTarget_2.y, onComplete: _this.onSnappedToTarget, onCompleteParams: [TreatItem.BAND_AID_TARGET_2] });
                TweenLite.to(_this.draggableObjectTarget_1, 0.5, { scaleX: 0.3, scaleY: 0.3, delay: 0.5 });
                TweenLite.to(_this.draggableObjectTarget_2, 0.5, { scaleX: 0.3, scaleY: 0.3, delay: 0.5 });
                TweenLite.to(_this.draggableObjectTarget_3, 0.5, { scaleX: 0.3, scaleY: 0.3, delay: 0.5 });
                // sndMan.playSound("gips"); //TODO sound
                AudioPlayer_1.AudioPlayer.getInstance().playSound("gips", 0, Config_1.Config.EFFECTS_VOLUME_LEVEL);
                _this.alpha = 0;
                TweenLite.to(_this, .3, { alpha: 1 });
                // }else if(this.draggableObjectTarget_3 && this.checkCollision(this, this.draggableObjectTarget_3)){
            }
            else if (hit3) {
                _this.draggableObjectTarget_3.alpha = 1;
                // Only band aid has more than one target
                TweenLite.to(_this, 0.5, { x: _this.draggableObjectTarget_3.x, y: _this.draggableObjectTarget_3.y, onComplete: _this.onSnappedToTarget, onCompleteParams: [TreatItem.BAND_AID_TARGET_3] });
                TweenLite.to(_this.draggableObjectTarget_1, 0.5, { scaleX: 0.3, scaleY: 0.3, delay: 0.5 });
                TweenLite.to(_this.draggableObjectTarget_2, 0.5, { scaleX: 0.3, scaleY: 0.3, delay: 0.5 });
                TweenLite.to(_this.draggableObjectTarget_3, 0.5, { scaleX: 0.3, scaleY: 0.3, delay: 0.5 });
                // sndMan.playSound("gips"); //TODO sound
                AudioPlayer_1.AudioPlayer.getInstance().playSound("gips", 0, Config_1.Config.EFFECTS_VOLUME_LEVEL);
                _this.alpha = 0;
                TweenLite.to(_this, .3, { alpha: 1 });
            }
            else {
                TweenLite.to(_this, .3, { x: _this._initialPosition.x, y: _this._initialPosition.y });
                _this.removeChild(_this.specificTreatImage);
                _this.addChild(_this.treatImage);
                // ItemsSelector(this.parent).setState(ItemsSelector.OPEN); //TODO
                // ItemsSelector(this.parent).updateTreatItemTargets(this, false); //TODO
                var parentItem = _this.parent;
                parentItem.setState(ItemsSelector_1.ItemsSelector.OPEN);
                parentItem.updateTreatItemTargets(_this, false);
                if (_this._type == TreatItem.BAND_AID) {
                    _this.draggableObjectTarget_1.scale.x = _this.draggableObjectTarget_1.scale.y = 0.3;
                    _this.draggableObjectTarget_2.scale.x = _this.draggableObjectTarget_2.scale.y = 0.3;
                    _this.draggableObjectTarget_3.scale.x = _this.draggableObjectTarget_3.scale.y = 0.3;
                }
            }
        };
        _this.onSnappedToTarget = function (bandAidTarget) {
            if (bandAidTarget === void 0) { bandAidTarget = ""; }
            Logger_1.Logger.log(_this, "TreatItem onSnappedToTarget");
            // dispatchEvent(new HospitalEvent(HospitalEvent.BANDAGE_PLACED, true));
            _this.emit(HospitalEvent_1.HospitalEvent.BANDAGE_PLACED);
            var clone = new TreatItem(_this.itemsSelector, _this._treatTexture, _this._type, null, null, null, false);
            clone.touchable = false;
            clone.showSpecificTreatImage();
            var itemSelector = _this.parent;
            itemSelector.placeTreatItem(clone, bandAidTarget); //TODO
            // ItemsSelector(this.parent).placeTreatItem(clone, bandAidTarget); //TODO
            _this.x = _this._initialPosition.x;
            _this.y = _this._initialPosition.y;
            _this.scale.x = _this.scale.y = 1;
            _this.removeChild(_this.specificTreatImage);
            _this.addChild(_this.treatImage);
            itemSelector.setState(ItemsSelector_1.ItemsSelector.OPEN); //TODO
            itemSelector.updateTreatItemTargets(_this, false, _this._type == TreatItem.LEMONADE); //TODO
            // ItemsSelector(this.parent).setState(ItemsSelector.OPEN); //TODO ORIG
            // ItemsSelector(this.parent).updateTreatItemTargets(this, false, this._type == TreatItem.LEMONADE); //TODO
        };
        _this.itemsSelector = itemsSelector;
        _this._type = type;
        _this._treatTexture = treatTexture;
        _this.draggableObjectTarget_1 = draggableObjectTarget_1;
        _this.draggableObjectTarget_2 = draggableObjectTarget_2;
        _this.draggableObjectTarget_3 = draggableObjectTarget_3;
        _this._initialPosition = new pixi_js_1.Point(_this.itemsSelector.offSetPosX, _this.itemsSelector.offSetPosY);
        _this.treatImage = pixi_js_1.Sprite.fromFrame(treatTexture);
        _this.addChild(_this.treatImage);
        _this.treatImage.pivot.x = _this.treatImage.width * .5;
        _this.treatImage.pivot.y = _this.treatImage.height * .5;
        var specificBandageImageTexture;
        if (_this._type == TreatItem.BANDAGE) {
            specificBandageImageTexture = "forbinding_gips_" + _this.treatTexture.substr(_this.treatTexture.length - 2, 2);
        }
        else {
            specificBandageImageTexture = _this.treatTexture;
        }
        _this.specificTreatImage = pixi_js_1.Sprite.fromFrame(specificBandageImageTexture);
        _this.specificTreatImage.pivot.x = _this.specificTreatImage.width * .5;
        _this.specificTreatImage.pivot.y = _this.specificTreatImage.height * .5;
        if (interactive) {
            _this.rectCover = new pixi_js_1.Graphics(); //TODO temp to check area
            _this.rectCover.beginFill(0xFF4444);
            _this.rectCover.alpha = HospitalGameView_1.HospitalGameView.RECT_COVER_ALPHA;
            _this.addChild(_this.rectCover);
            _this.rectCover.drawRect(_this.treatImage.x, _this.treatImage.y, _this.treatImage.width, _this.treatImage.height);
            _this.rectCover.pivot.x = _this.treatImage.width * .5;
            _this.rectCover.pivot.y = _this.treatImage.height * .5;
            _this.on(TouchLoudEvent_1.TouchEvent.TOUCH, _this.touchDown);
            _this.on(TouchLoudEvent_1.TouchEvent.TOUCH_END, _this.touchDone);
            _this.on(TouchLoudEvent_1.TouchEvent.TOUCH_OUT, _this.touchDone);
            _this.on(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, _this.touchMove);
        }
        return _this;
        // sndMan = SoundManager.getInstance(); //TODO  sound
    }
    TreatItem.prototype.showSpecificTreatImage = function () {
        Logger_1.Logger.log(this, "TreatItem showSpecificTreatImage");
        this.removeChild(this.treatImage);
        this.addChild(this.specificTreatImage);
    };
    TreatItem.prototype.checkCollisionWithTarget = function () {
        var itemSelector = this.parent;
        Logger_1.Logger.log(this, "TreatItem checkCollisionWithTarget");
        Logger_1.Logger.log(this, "TreatItem checkCollisionWithTarget  this.draggableObjectTarget_1 == " + this.draggableObjectTarget_1);
        Logger_1.Logger.log(this, "TreatItem checkCollisionWithTarget  itemSelector.x == " + itemSelector.x + " : itemSelector.y == " + itemSelector.y);
        Logger_1.Logger.log(this, "TreatItem checkCollisionWithTarget  this.draggableObjectTarget_1.x == " + this.draggableObjectTarget_1.x + " : this.draggableObjectTarget_1.y == " + this.draggableObjectTarget_1.y);
        Logger_1.Logger.log(this, "TreatItem checkCollisionWithTarget  this.rectCover.getBounds() == " + this.rectCover.getBounds().x + " : " + this.rectCover.getBounds().y + " : " + this.rectCover.getBounds().width + " : " + this.rectCover.getBounds().height);
        Logger_1.Logger.log(this, "TreatItem checkCollisionWithTarget  this.draggableObjectTarget_1.getBounds() == " + this.draggableObjectTarget_1.getBounds().x + " : " + this.draggableObjectTarget_1.getBounds().y + " : " + this.draggableObjectTarget_1.getBounds().width + " : " + this.draggableObjectTarget_1.getBounds().height);
        Logger_1.Logger.log(this, "TreatItem checkCollisionWithTarget  SpriteHelper.hitTest(this.rectCover.getBounds(), this.draggableObjectTarget_1.getBounds()) == " + SpriteHelper_1.SpriteHelper.hitTest(this.rectCover.getBounds(), this.draggableObjectTarget_1.getBounds()));
        // if(this.checkCollision(this, this.draggableObjectTarget_1)){
        if (SpriteHelper_1.SpriteHelper.hitTest(this.rectCover.getBounds(), this.draggableObjectTarget_1.getBounds())) {
            this.draggableObjectTarget_1.alpha = 0.6;
        }
        else {
            this.draggableObjectTarget_1.alpha = 1;
        }
        if (this.draggableObjectTarget_2) {
            if (SpriteHelper_1.SpriteHelper.hitTest(this.rectCover.getBounds(), this.draggableObjectTarget_2.getBounds())) {
                this.draggableObjectTarget_2.alpha = 0.6;
            }
            else {
                this.draggableObjectTarget_2.alpha = 1;
            }
        }
        if (this.draggableObjectTarget_3) {
            if (SpriteHelper_1.SpriteHelper.hitTest(this.rectCover.getBounds(), this.draggableObjectTarget_3.getBounds())) {
                this.draggableObjectTarget_3.alpha = 0.6;
            }
            else {
                this.draggableObjectTarget_3.alpha = 1;
            }
        }
    };
    Object.defineProperty(TreatItem.prototype, "type", {
        // private getCollidedPatient():Patient {
        // 	Logger.log(this, "TreatItem getCollidedPatient");
        // 	let collide:Patient;
        // 	// if(Config.patientWaitingInSlot_1 && this.checkCollision(this, Config.patientWaitingInSlot_1)){
        // 	if(Config.patientWaitingInSlot_1 && SpriteHelper.hitTest(this.rectCover.getBounds(), Config.patientWaitingInSlot_1.getBounds())){
        // 		collide = Config.patientWaitingInSlot_1;
        // 	}else if(Config.patientWaitingInSlot_2 && SpriteHelper.hitTest(this.rectCover.getBounds(), Config.patientWaitingInSlot_2.getBounds())){
        // 		collide = Config.patientWaitingInSlot_2;
        // 	}else if(Config.patientWaitingInSlot_3 && SpriteHelper.hitTest(this.rectCover.getBounds(), Config.patientWaitingInSlot_3.getBounds())){
        // 		collide = Config.patientWaitingInSlot_3;
        // 	}
        // 	Logger.log(this, "TreatItem getCollidedPatient RETURN collide == "+collide);
        // 	return collide;
        // }
        // 	private checkCollision(obj1: Sprite, obj2: Sprite):boolean{
        // 		let p1:Point = new Point(obj1.x , obj1.y);
        // //			var p2:Point = new Point(obj2.x + obj2.width/2, obj2.y + obj2.height/2);
        // 		let p2:Point = new Point(obj2.x, obj2.y);
        //
        // 		// let distance:Number = Point.distance(p1, p2); //TODO Point.distance
        // 		// let radius1:Number = 60;
        // 		// let radius2:Number = 60;
        //         //
        // 		// return (distance < radius1 + radius2);
        // 		return false; //TODO temp
        // 	}
        get: function () {
            return this._type;
        },
        set: function (value) {
            this._type = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreatItem.prototype, "treatTexture", {
        get: function () {
            return this._treatTexture;
        },
        set: function (value) {
            this._treatTexture = value;
        },
        enumerable: true,
        configurable: true
    });
    TreatItem.prototype.destroy = function () {
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.touchDown);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.touchDone);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH_OUT, this.touchDone);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.touchMove);
    };
    TreatItem.BANDAGE = "appdrhospital.view.operatingroom.objects.TreatItem.BANDAGE";
    TreatItem.BAND_AID = "appdrhospital.view.operatingroom.objects.TreatItem.BAND_AID";
    TreatItem.LEMONADE = "appdrhospital.view.operatingroom.objects.TreatItem.LEMONADE";
    TreatItem.BAND_AID_TARGET_1 = "appdrhospital.view.operatingroom.objects.TreatItem.TARGET_1";
    TreatItem.BAND_AID_TARGET_2 = "appdrhospital.view.operatingroom.objects.TreatItem.TARGET_2";
    TreatItem.BAND_AID_TARGET_3 = "appdrhospital.view.operatingroom.objects.TreatItem.TARGET_3";
    TreatItem.DRAGGABLE_OBJECT_TOUCH_OFFSET = 100;
    return TreatItem;
}(DraggableItem_1.DraggableItem));
exports.TreatItem = TreatItem;
//# sourceMappingURL=TreatItem.js.map
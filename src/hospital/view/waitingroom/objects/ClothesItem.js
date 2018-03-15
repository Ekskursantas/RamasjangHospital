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
var TouchLoudEvent_1 = require("../../../../loudmotion/events/TouchLoudEvent");
var Logger_1 = require("../../../../loudmotion/utils/debug/Logger");
var ItemsSelector_1 = require("../../objects/ItemsSelector");
var Config_1 = require("../../../Config");
var pixi_js_1 = require("pixi.js");
var AssetLoader_1 = require("../../../utils/AssetLoader");
var SpriteHelper_1 = require("../../../../loudmotion/utils/SpriteHelper");
var ClothesItem = /** @class */ (function (_super) {
    __extends(ClothesItem, _super);
    function ClothesItem(clothesTexture, type) {
        var _this = _super.call(this) || this;
        _this.DRAGGABLE_OBJECT_TOUCH_OFFSET = -100;
        _this.touchDown = function (event) {
            Logger_1.Logger.log(_this, "ClothesItem touchDown  event.type == " + event.type);
            _this.mouseDown = true;
            _this.parent.setChildIndex(_this, _this.parent.children.length - 1);
            // ItemsSelector(this.parent).setState(ItemsSelector.CLOSED); //TODO
            var parentItem = _this.parent;
            parentItem.setState(ItemsSelector_1.ItemsSelector.CLOSED);
            _this.visible = true;
        };
        _this.touchMove = function (event) {
            // Logger.log(this, "ClothesItem touchMove  event.type == "+event.type);
            if (_this.mouseDown) {
                var parentItem = _this.parent;
                var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
                _this.x = mousePositionCanvas.x - parentItem.x;
                _this.y = mousePositionCanvas.y - parentItem.y;
                _this.checkCollisionWithPatients();
            }
        };
        _this.touchDone = function (event) {
            Logger_1.Logger.log(_this, "ClothesItem touchDone  event.type == " + event.type);
            _this.mouseDown = false;
            var patientCollided = _this.getCollidedPatient();
            if (patientCollided) {
                patientCollided.setClothes(_this._clothesTexture, _this._type);
                patientCollided.alpha = 1;
                _this.x = _this._initialPosition.x;
                _this.y = _this._initialPosition.y;
                _this.alpha = 0;
                TweenLite.to(_this, .3, { alpha: 1 });
            }
            else {
                TweenLite.to(_this, .3, { x: _this._initialPosition.x, y: _this._initialPosition.y });
            }
            var parentItem = _this.parent;
            parentItem.setState(ItemsSelector_1.ItemsSelector.OPEN);
        };
        _this.type = type;
        _this.interactive = true;
        _this.buttonMode = true;
        _this.clothesTexture = clothesTexture;
        _this.clothesImage = pixi_js_1.Sprite.fromFrame(clothesTexture);
        _this.addChild(_this.clothesImage);
        _this.clothesImage.scale.x = _this.clothesImage.scale.y = ClothesItem.CLOTHES_IMAGE_SCALE;
        _this.clothesImage.x = -_this.clothesImage.width / 2;
        _this.clothesImage.y = -_this.clothesImage.height / 2;
        // this.clothesImage.pivot.x = this.clothesImage.width * .5;
        // this.clothesImage.pivot.y = this.clothesImage.height * .5;
        // this.on(TouchEvent.TOUCH, this.touchListener);
        _this.on(TouchLoudEvent_1.TouchEvent.TOUCH, _this.touchDown);
        _this.on(TouchLoudEvent_1.TouchEvent.TOUCH_END, _this.touchDone);
        // this.on(TouchEvent.TOUCH_OUT, this.touchDone);
        _this.on(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, _this.touchMove);
        return _this;
        // sndMan = SoundManager.getInstance(); //TODO sound
    }
    // private touchListener = (event:TouchEvent):void => {
    // 	this.touch = event.getTouch(this.parent);
    // 	if(!this.touch) return;
    //
    // 	if(this.touch.phase == TouchPhase.BEGAN){
    // 		// Logger.log(this, "touch.getLocation(this.parent).x: " + this.touch.getLocation(this.parent).x);
    //
    // 		// this.x = this.touch.getLocation(this.parent).x; //TODO
    // 		// this.y = this.touch.getLocation(this.parent).y + this.DRAGGABLE_OBJECT_TOUCH_OFFSET; //TODO
    // 		this.parent.setChildIndex(this, this.parent.children.length);
    // 		// ItemsSelector(this.parent).setState(ItemsSelector.CLOSED); //TODO
    // 		this.visible = true;
    // 	}
    //
    // 	if(this.touch.phase == TouchPhase.MOVED){
    //
    // 		// this.x = this.touch.getLocation(this.parent).x; //TODO
    // 		// this.y = this.touch.getLocation(this.parent).y + this.DRAGGABLE_OBJECT_TOUCH_OFFSET; //TODO
    //
    // 		this.checkCollisionWithPatients();
    // 	}
    //
    // 	if(this.touch.phase == TouchPhase.ENDED){
    //
    // 		let patientCollided:Patient = this.getCollidedPatient();
    //
    // 		if(patientCollided){
    // 			patientCollided.setClothes(this._clothesTexture, this._type);
    // 			patientCollided.alpha = 1;
    // 			this.x = this._initialPosition.x;
    // 			this.y = this._initialPosition.y;
    // 			this.alpha = 0;
    // 			TweenLite.to(this, .3, {alpha:1});
    // 		}else{
    // 			TweenLite.to(this, .3, {x:this._initialPosition.x, y:this._initialPosition.y});
    // 		}
    //
    // 		// ItemsSelector(this.parent).setState(ItemsSelector.OPEN); //TODO
    // 	}
    // }
    ClothesItem.prototype.audioHelpSpeakComplete = function (event) {
        // if(sndMan.soundIsPlaying("waiting_room_loop")){ //TODO sound
        // 	sndMan.tweenVolume("waiting_room_loop", 1, 0.5);
        // }
    };
    ClothesItem.prototype.checkCollisionWithPatients = function () {
        var hit1;
        var mouseOverAlpha = 0.6;
        hit1 = SpriteHelper_1.SpriteHelper.hitTest(this.getBounds(), Config_1.Config.patientWaitingInSlot_1);
        // if(Config.patientWaitingInSlot_1 && this.checkCollision(this, Config.patientWaitingInSlot_1)){
        if (Config_1.Config.patientWaitingInSlot_1 && hit1) {
            if (this.type == ClothesItem.TOP)
                Config_1.Config.patientWaitingInSlot_1.currentTopClothes.alpha = mouseOverAlpha;
            if (this.type == ClothesItem.BOTTOM)
                Config_1.Config.patientWaitingInSlot_1.currentBottomClothes.alpha = mouseOverAlpha;
        }
        else if (Config_1.Config.patientWaitingInSlot_1) {
            if (this.type == ClothesItem.TOP)
                Config_1.Config.patientWaitingInSlot_1.currentTopClothes.alpha = 1;
            if (this.type == ClothesItem.BOTTOM)
                Config_1.Config.patientWaitingInSlot_1.currentBottomClothes.alpha = 1;
        }
        var hit2;
        hit2 = SpriteHelper_1.SpriteHelper.hitTest(this.getBounds(), Config_1.Config.patientWaitingInSlot_2);
        if (Config_1.Config.patientWaitingInSlot_2 && hit2) {
            // if(Config.patientWaitingInSlot_2 && this.checkCollision(this, Config.patientWaitingInSlot_2)){
            if (this.type == ClothesItem.TOP)
                Config_1.Config.patientWaitingInSlot_2.currentTopClothes.alpha = mouseOverAlpha;
            if (this.type == ClothesItem.BOTTOM)
                Config_1.Config.patientWaitingInSlot_2.currentBottomClothes.alpha = mouseOverAlpha;
        }
        else if (Config_1.Config.patientWaitingInSlot_2) {
            if (this.type == ClothesItem.TOP)
                Config_1.Config.patientWaitingInSlot_2.currentTopClothes.alpha = 1;
            if (this.type == ClothesItem.BOTTOM)
                Config_1.Config.patientWaitingInSlot_2.currentBottomClothes.alpha = 1;
        }
        var hit3;
        hit3 = SpriteHelper_1.SpriteHelper.hitTest(this.getBounds(), Config_1.Config.patientWaitingInSlot_3);
        if (Config_1.Config.patientWaitingInSlot_3 && hit3) {
            // if(Config.patientWaitingInSlot_3 && this.checkCollision(this, Config.patientWaitingInSlot_3)){
            if (this.type == ClothesItem.TOP)
                Config_1.Config.patientWaitingInSlot_3.currentTopClothes.alpha = mouseOverAlpha;
            if (this.type == ClothesItem.BOTTOM)
                Config_1.Config.patientWaitingInSlot_3.currentBottomClothes.alpha = mouseOverAlpha;
        }
        else if (Config_1.Config.patientWaitingInSlot_3) {
            if (this.type == ClothesItem.TOP)
                Config_1.Config.patientWaitingInSlot_3.currentTopClothes.alpha = 1;
            if (this.type == ClothesItem.BOTTOM)
                Config_1.Config.patientWaitingInSlot_3.currentBottomClothes.alpha = 1;
        }
    };
    ClothesItem.prototype.getCollidedPatient = function () {
        var hit1;
        hit1 = SpriteHelper_1.SpriteHelper.hitTest(this.getBounds(), Config_1.Config.patientWaitingInSlot_1);
        var hit2;
        hit2 = SpriteHelper_1.SpriteHelper.hitTest(this.getBounds(), Config_1.Config.patientWaitingInSlot_2);
        var hit3;
        hit3 = SpriteHelper_1.SpriteHelper.hitTest(this.getBounds(), Config_1.Config.patientWaitingInSlot_3);
        if (Config_1.Config.patientWaitingInSlot_1 && hit1) {
            // if(Config.patientWaitingInSlot_1 && this.checkCollision(this, Config.patientWaitingInSlot_1)){
            return Config_1.Config.patientWaitingInSlot_1;
            // }else if(Config.patientWaitingInSlot_2 && this.checkCollision(this, Config.patientWaitingInSlot_2)){
        }
        else if (Config_1.Config.patientWaitingInSlot_2 && hit2) {
            return Config_1.Config.patientWaitingInSlot_2;
            // }else if(Config.patientWaitingInSlot_3 && this.checkCollision(this, Config.patientWaitingInSlot_3)){
        }
        else if (Config_1.Config.patientWaitingInSlot_3 && hit3) {
            return Config_1.Config.patientWaitingInSlot_3;
        }
        return null;
    };
    Object.defineProperty(ClothesItem.prototype, "type", {
        // private checkCollision(obj1: Sprite, obj2: Sprite):boolean{
        // 	let p1:Point = new Point(obj1.x + this.parent.x, obj1.y + this.parent.y);
        // 	let p2:Point = new Point(obj2.x + obj2.width/2, obj2.y + obj2.height/2);
        //
        // 	// var distance:number = Point.distance(p1, p2); //TODO
        // 	// var radius1:number = 60;
        // 	// var radius2:number = 60;
        //    //
        // 	// return (distance < radius1 + radius2);
        // 	return false; //TODO temp
        // }
        get: function () {
            return this._type;
        },
        set: function (value) {
            this._type = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClothesItem.prototype, "clothesTexture", {
        get: function () {
            return this._clothesTexture;
        },
        set: function (value) {
            this._clothesTexture = value;
        },
        enumerable: true,
        configurable: true
    });
    ClothesItem.TOP = "appdrhospital.view.waitingroom.objects.ClothesItem.TOP";
    ClothesItem.BOTTOM = "appdrhospital.view.waitingroom.objects.ClothesItem.BOTTOM";
    ClothesItem.NUM_OF_TOP_CLOTHES_ITEMS = 6;
    ClothesItem.NUM_OF_BOTTOM_CLOTHES_ITEMS = 6;
    ClothesItem.CLOTHES_IMAGE_SCALE = 0.8;
    return ClothesItem;
}(DraggableItem_1.DraggableItem));
exports.ClothesItem = ClothesItem;
//# sourceMappingURL=ClothesItem.js.map
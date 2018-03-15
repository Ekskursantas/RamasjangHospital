
import {DraggableItem} from "../../objects/DraggableItem";
import {TouchEvent} from "../../../../loudmotion/events/TouchLoudEvent";
import {TouchPhase} from "../../../../loudmotion/events/TouchLoudPhase";
import {Touch} from "../../../../loudmotion/events/TouchLoud";
import {Logger} from "../../../../loudmotion/utils/debug/Logger";
import {ItemsSelector} from "../../objects/ItemsSelector";
import {Patient} from "../../objects/Patient";
import {Config} from "../../../Config";
import {Sprite, Point} from "pixi.js";
import {AssetLoader} from "../../../utils/AssetLoader";
import {SpriteHelper} from "../../../../loudmotion/utils/SpriteHelper";

export class ClothesItem extends DraggableItem {
	public static TOP:string = "appdrhospital.view.waitingroom.objects.ClothesItem.TOP";
	public static BOTTOM:string = "appdrhospital.view.waitingroom.objects.ClothesItem.BOTTOM";
	public static NUM_OF_TOP_CLOTHES_ITEMS:number = 6;
	public static NUM_OF_BOTTOM_CLOTHES_ITEMS:number = 6;

	private DRAGGABLE_OBJECT_TOUCH_OFFSET:number = -100;
	private static CLOTHES_IMAGE_SCALE:number = 0.8;

	private _clothesTexture:string;
	private _type:string;

	private clothesImage:Sprite;
	private mouseDown: boolean;
	private touchOffset:Point;

	private touch:Touch;
	// private sndMan:SoundManager;
	public static clothesSpeakCounter:number;


	constructor (clothesTexture:string, type:string) {
		super();
		this.type = type;

		this.interactive = true;
		this.buttonMode = true;

		this.clothesTexture = clothesTexture;

		this.clothesImage = Sprite.fromFrame(clothesTexture);
		this.addChild(this.clothesImage);
		this.clothesImage.scale.x = this.clothesImage.scale.y = ClothesItem.CLOTHES_IMAGE_SCALE;

		this.clothesImage.x = -this.clothesImage.width/2;
		this.clothesImage.y = -this.clothesImage.height/2;
		// this.clothesImage.pivot.x = this.clothesImage.width * .5;
		// this.clothesImage.pivot.y = this.clothesImage.height * .5;

		// this.on(TouchEvent.TOUCH, this.touchListener);
		this.on(TouchEvent.TOUCH, this.touchDown);
		this.on(TouchEvent.TOUCH_END, this.touchDone);
		// this.on(TouchEvent.TOUCH_OUT, this.touchDone);
		this.on(TouchEvent.TOUCH_MOVE, this.touchMove);

		// sndMan = SoundManager.getInstance(); //TODO sound
	}

	private touchDown = (event:TouchEvent):void => {
		Logger.log(this, "ClothesItem touchDown  event.type == "+event.type);
		this.mouseDown = true;

		this.parent.setChildIndex(this, this.parent.children.length-1);
		// ItemsSelector(this.parent).setState(ItemsSelector.CLOSED); //TODO
		let parentItem:ItemsSelector = this.parent as ItemsSelector;
		parentItem.setState(ItemsSelector.CLOSED);
		this.visible = true;

	}

	private touchMove = (event:TouchEvent):void => {
		// Logger.log(this, "ClothesItem touchMove  event.type == "+event.type);
		if(this.mouseDown) {
			let parentItem:ItemsSelector = this.parent as ItemsSelector;
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			this.x = mousePositionCanvas.x - parentItem.x;
			this.y = mousePositionCanvas.y - parentItem.y;
			this.checkCollisionWithPatients();
		}
	}

	private touchDone = (event:TouchEvent):void => {
		Logger.log(this, "ClothesItem touchDone  event.type == "+event.type);
		this.mouseDown = false;

		let patientCollided:Patient = this.getCollidedPatient();

		if(patientCollided){
			patientCollided.setClothes(this._clothesTexture, this._type);
			patientCollided.alpha = 1;
			this.x = this._initialPosition.x;
			this.y = this._initialPosition.y;
			this.alpha = 0;
			TweenLite.to(this, .3, {alpha:1});
		}else{
			TweenLite.to(this, .3, {x:this._initialPosition.x, y:this._initialPosition.y});
		}

		let parentItem:ItemsSelector = this.parent as ItemsSelector;
		parentItem.setState(ItemsSelector.OPEN);
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

	private audioHelpSpeakComplete(event:Object):void {
		// if(sndMan.soundIsPlaying("waiting_room_loop")){ //TODO sound
		// 	sndMan.tweenVolume("waiting_room_loop", 1, 0.5);
		// }
	}

	private checkCollisionWithPatients():void {

		let hit1:boolean;

		let mouseOverAlpha:number = 0.6;
		hit1 = SpriteHelper.hitTest(this.getBounds(), Config.patientWaitingInSlot_1);
		// if(Config.patientWaitingInSlot_1 && this.checkCollision(this, Config.patientWaitingInSlot_1)){
		if(Config.patientWaitingInSlot_1 && hit1){
			if(this.type == ClothesItem.TOP) Config.patientWaitingInSlot_1.currentTopClothes.alpha = mouseOverAlpha;
			if(this.type == ClothesItem.BOTTOM) Config.patientWaitingInSlot_1.currentBottomClothes.alpha = mouseOverAlpha;
		}else if(Config.patientWaitingInSlot_1){
			if(this.type == ClothesItem.TOP) Config.patientWaitingInSlot_1.currentTopClothes.alpha = 1;
			if(this.type == ClothesItem.BOTTOM) Config.patientWaitingInSlot_1.currentBottomClothes.alpha = 1;
		}

		let hit2:boolean;
		hit2 = SpriteHelper.hitTest(this.getBounds(), Config.patientWaitingInSlot_2);
		if(Config.patientWaitingInSlot_2 && hit2){
		// if(Config.patientWaitingInSlot_2 && this.checkCollision(this, Config.patientWaitingInSlot_2)){
			if(this.type == ClothesItem.TOP) Config.patientWaitingInSlot_2.currentTopClothes.alpha = mouseOverAlpha;
			if(this.type == ClothesItem.BOTTOM) Config.patientWaitingInSlot_2.currentBottomClothes.alpha = mouseOverAlpha;
		}else if(Config.patientWaitingInSlot_2){
			if(this.type == ClothesItem.TOP) Config.patientWaitingInSlot_2.currentTopClothes.alpha = 1;
			if(this.type == ClothesItem.BOTTOM) Config.patientWaitingInSlot_2.currentBottomClothes.alpha = 1;
		}

		let hit3:boolean;
		hit3 = SpriteHelper.hitTest(this.getBounds(), Config.patientWaitingInSlot_3);
		if(Config.patientWaitingInSlot_3 && hit3){
		// if(Config.patientWaitingInSlot_3 && this.checkCollision(this, Config.patientWaitingInSlot_3)){
			if(this.type == ClothesItem.TOP) Config.patientWaitingInSlot_3.currentTopClothes.alpha = mouseOverAlpha;
			if(this.type == ClothesItem.BOTTOM) Config.patientWaitingInSlot_3.currentBottomClothes.alpha = mouseOverAlpha;
		}else if(Config.patientWaitingInSlot_3){
			if(this.type == ClothesItem.TOP) Config.patientWaitingInSlot_3.currentTopClothes.alpha = 1;
			if(this.type == ClothesItem.BOTTOM) Config.patientWaitingInSlot_3.currentBottomClothes.alpha = 1;
		}
	}

	private getCollidedPatient():Patient {

		let hit1:boolean;
		hit1 = SpriteHelper.hitTest(this.getBounds(), Config.patientWaitingInSlot_1);

			let hit2:boolean;
			hit2 = SpriteHelper.hitTest(this.getBounds(), Config.patientWaitingInSlot_2);

			let hit3:boolean;
			hit3 = SpriteHelper.hitTest(this.getBounds(), Config.patientWaitingInSlot_3);
		if(Config.patientWaitingInSlot_1 && hit1){
		// if(Config.patientWaitingInSlot_1 && this.checkCollision(this, Config.patientWaitingInSlot_1)){
			return Config.patientWaitingInSlot_1;
		// }else if(Config.patientWaitingInSlot_2 && this.checkCollision(this, Config.patientWaitingInSlot_2)){
		}else if(Config.patientWaitingInSlot_2 && hit2){
			return Config.patientWaitingInSlot_2;
		// }else if(Config.patientWaitingInSlot_3 && this.checkCollision(this, Config.patientWaitingInSlot_3)){
		}else if(Config.patientWaitingInSlot_3 && hit3){
			return Config.patientWaitingInSlot_3;
		}
		return null;
	}

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


	public get type():string {
		return this._type;
	}

	public set type(value:string) {
		this._type = value;
	}

	public get clothesTexture():string {
		return this._clothesTexture;
	}

	public set clothesTexture(value:string) {
		this._clothesTexture = value;
	}



}
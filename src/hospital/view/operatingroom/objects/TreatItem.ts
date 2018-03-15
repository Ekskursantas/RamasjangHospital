
import {DraggableItem} from "../../objects/DraggableItem";
import {Config} from "../../../Config";
import {TouchEvent} from "../../../../loudmotion/events/TouchLoudEvent";
import {TouchPhase} from "../../../../loudmotion/events/TouchLoudPhase";
import {Touch} from "../../../../loudmotion/events/TouchLoud";
import {ItemsSelector} from "../../objects/ItemsSelector";
import {HospitalEvent} from "../../../event/HospitalEvent";
import {Patient} from "../../objects/Patient";
import {Sprite, Point, Container, Graphics} from "pixi.js";
import {SpriteHelper} from "../../../../loudmotion/utils/SpriteHelper";
import {Logger} from "../../../../loudmotion/utils/debug/Logger";
import {AssetLoader} from "../../../utils/AssetLoader";
import {AudioPlayer} from "../../../../loudmotion/utils/AudioPlayer";
import {HospitalGameView} from "../../HospitalGameView";

export class TreatItem extends DraggableItem {
	public static BANDAGE:string = "appdrhospital.view.operatingroom.objects.TreatItem.BANDAGE";
	public static BAND_AID:string = "appdrhospital.view.operatingroom.objects.TreatItem.BAND_AID";
	public static LEMONADE:string = "appdrhospital.view.operatingroom.objects.TreatItem.LEMONADE";

	public static BAND_AID_TARGET_1:string = "appdrhospital.view.operatingroom.objects.TreatItem.TARGET_1";
	public static BAND_AID_TARGET_2:string = "appdrhospital.view.operatingroom.objects.TreatItem.TARGET_2";
	public static BAND_AID_TARGET_3:string = "appdrhospital.view.operatingroom.objects.TreatItem.TARGET_3";

	private static DRAGGABLE_OBJECT_TOUCH_OFFSET:Number = 100;

	private _treatTexture:string;
	private _type:string;
	private touchable:boolean;

	private treatImage:Sprite;
	private specificTreatImage:Sprite;
	private draggableObjectTarget_1:Sprite;
	private draggableObjectTarget_2:Sprite;
	private draggableObjectTarget_3:Sprite;

	private rectCover:Graphics;
	private itemsSelector:ItemsSelector;

	private touch:Touch;
	private mouseDown: boolean;

	constructor (itemsSelector:ItemsSelector, treatTexture:string, type:string = TreatItem.BANDAGE, draggableObjectTarget_1 = null, draggableObjectTarget_2 = null, draggableObjectTarget_3 = null, interactive:boolean=true) {
		super();
		this.itemsSelector = itemsSelector;
		this._type = type;
		this._treatTexture = treatTexture;
		this.draggableObjectTarget_1 = draggableObjectTarget_1;
		this.draggableObjectTarget_2 = draggableObjectTarget_2;
		this.draggableObjectTarget_3 = draggableObjectTarget_3;

		this._initialPosition = new Point(this.itemsSelector.offSetPosX, this.itemsSelector.offSetPosY);
		this.treatImage = Sprite.fromFrame(treatTexture);
		this.addChild(this.treatImage);

		this.treatImage.pivot.x = this.treatImage.width * .5;
		this.treatImage.pivot.y = this.treatImage.height * .5;

		let specificBandageImageTexture:string;
		if(this._type == TreatItem.BANDAGE){
			specificBandageImageTexture = "forbinding_gips_" + this.treatTexture.substr(this.treatTexture.length - 2, 2);
		}else{
			specificBandageImageTexture = this.treatTexture;
		}
		this.specificTreatImage = Sprite.fromFrame(specificBandageImageTexture);

		this.specificTreatImage.pivot.x = this.specificTreatImage.width * .5;
		this.specificTreatImage.pivot.y = this.specificTreatImage.height * .5;


		if(interactive) {
			this.rectCover = new Graphics(); //TODO temp to check area
			this.rectCover.beginFill(0xFF4444);
			this.rectCover.alpha = HospitalGameView.RECT_COVER_ALPHA;
			this.addChild(this.rectCover);
			this.rectCover.drawRect(this.treatImage.x, this.treatImage.y, this.treatImage.width, this.treatImage.height);
			this.rectCover.pivot.x = this.treatImage.width * .5;
			this.rectCover.pivot.y = this.treatImage.height * .5;

			this.on(TouchEvent.TOUCH, this.touchDown);
			this.on(TouchEvent.TOUCH_END, this.touchDone);
			this.on(TouchEvent.TOUCH_OUT, this.touchDone);
			this.on(TouchEvent.TOUCH_MOVE, this.touchMove);
		}

		// sndMan = SoundManager.getInstance(); //TODO  sound
	}

	public showSpecificTreatImage():void {
		Logger.log(this, "TreatItem showSpecificTreatImage");
		this.removeChild(this.treatImage);
		this.addChild(this.specificTreatImage);
	}

	private touchDown = (event:TouchEvent):void => {
		Logger.log(this, "TreatItem touchDown  event.type == "+event.type);
		this.mouseDown = true;

		this.parent.setChildIndex(this, this.parent.children.length-1);

		this.removeChild(this.treatImage);
		this.addChild(this.specificTreatImage);

		let parentItem:ItemsSelector = this.parent as ItemsSelector;
		parentItem.setState(ItemsSelector.CLOSED);
		parentItem.updateTreatItemTargets(this, true);

		if(this.draggableObjectTarget_1 != null) {
			Logger.log(this, "TreatItem touchDown  this.draggableObjectTarget_1 == " + this.draggableObjectTarget_1 + " : SpriteHelper.hitTest(this.getBounds(), this.draggableObjectTarget_1.getBounds()) == " + SpriteHelper.hitTest(this.rectCover.getBounds(), this.draggableObjectTarget_1.getBounds()));
		}

		this.visible = true;

		Logger.log(this, "TreatItem touchDown  this.x == "+this.x+" : this.y == "+this.y);
	}

	private touchMove = (event:TouchEvent):void => {

		if(this.mouseDown) {
			let parentItem:ItemsSelector = this.parent as ItemsSelector;
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			this.x = mousePositionCanvas.x - parentItem.x;
			this.y = mousePositionCanvas.y - parentItem.y;
			this.checkCollisionWithTarget();
			// Logger.log(this, "TreatItem touchMove  this.x == "+this.x+" : this.y == "+this.y);
		}
	}

	private touchDone = (event:TouchEvent):void => {
		Logger.log(this, "TreatItem touchDone  event.type == "+event.type);
		this.mouseDown = false;

		// if(this.checkCollision(this, this.draggableObjectTarget_1)){
		let hit1:boolean = (this.draggableObjectTarget_1 != null && SpriteHelper.hitTest(this.rectCover.getBounds(), this.draggableObjectTarget_1.getBounds()));
		let hit2:boolean = (this.draggableObjectTarget_2 != null && SpriteHelper.hitTest(this.rectCover.getBounds(), this.draggableObjectTarget_2.getBounds()));
		let hit3:boolean = (this.draggableObjectTarget_3 != null && SpriteHelper.hitTest(this.rectCover.getBounds(), this.draggableObjectTarget_3.getBounds()));

		Logger.log(this, "TreatItem touchDone  hit1 == "+hit1);
		Logger.log(this, "TreatItem touchDone  hit2 == "+hit2);
		Logger.log(this, "TreatItem touchDone  hit3 == "+hit3);

		if(hit1){
			this.draggableObjectTarget_1.alpha = 1;

			if(this._type == TreatItem.LEMONADE){
				TweenLite.to(this, 0.5, {x:this.draggableObjectTarget_1.x, y:this.draggableObjectTarget_1.y, onComplete:this.onSnappedToTarget});
			}else if(this._type == TreatItem.BAND_AID){
				TweenLite.to(this, 0.5, {x:this.draggableObjectTarget_1.x, y:this.draggableObjectTarget_1.y ,onComplete:this.onSnappedToTarget, onCompleteParams:[TreatItem.BAND_AID_TARGET_1]});
				TweenLite.to(this.draggableObjectTarget_1, 0.5, {scaleX:0.3, scaleY:0.3, delay:0.5});
				TweenLite.to(this.draggableObjectTarget_2, 0.5, {scaleX:0.3, scaleY:0.3, delay:0.5});
				TweenLite.to(this.draggableObjectTarget_3, 0.5, {scaleX:0.3, scaleY:0.3, delay:0.5});
				AudioPlayer.getInstance().playSound("gips", 0, Config.EFFECTS_VOLUME_LEVEL);
			}else{
				TweenLite.to(this, 0.5, {x:this.draggableObjectTarget_1.x, y:this.draggableObjectTarget_1.y ,onComplete:this.onSnappedToTarget});
				AudioPlayer.getInstance().playSound("gips", 0, Config.EFFECTS_VOLUME_LEVEL);
			}
			this.alpha = 0;
			TweenLite.to(this, .3, {alpha:1});
			// }else if(this.draggableObjectTarget_2 && this.checkCollision(this, this.draggableObjectTarget_2)){
		}else if(hit2){

			this.draggableObjectTarget_2.alpha = 1;

			// Only band aid has more than one target
			TweenLite.to(this, 0.5, {x:this.draggableObjectTarget_2.x, y:this.draggableObjectTarget_2.y ,onComplete:this.onSnappedToTarget, onCompleteParams:[TreatItem.BAND_AID_TARGET_2]});
			TweenLite.to(this.draggableObjectTarget_1, 0.5, {scaleX:0.3, scaleY:0.3, delay:0.5});
			TweenLite.to(this.draggableObjectTarget_2, 0.5, {scaleX:0.3, scaleY:0.3, delay:0.5});
			TweenLite.to(this.draggableObjectTarget_3, 0.5, {scaleX:0.3, scaleY:0.3, delay:0.5});
			// sndMan.playSound("gips"); //TODO sound
			AudioPlayer.getInstance().playSound("gips", 0, Config.EFFECTS_VOLUME_LEVEL);
			this.alpha = 0;
			TweenLite.to(this, .3, {alpha:1});
			// }else if(this.draggableObjectTarget_3 && this.checkCollision(this, this.draggableObjectTarget_3)){
		}else if(hit3){

			this.draggableObjectTarget_3.alpha = 1;

			// Only band aid has more than one target
			TweenLite.to(this, 0.5, {x:this.draggableObjectTarget_3.x, y:this.draggableObjectTarget_3.y ,onComplete:this.onSnappedToTarget, onCompleteParams:[TreatItem.BAND_AID_TARGET_3]});
			TweenLite.to(this.draggableObjectTarget_1, 0.5, {scaleX:0.3, scaleY:0.3, delay:0.5});
			TweenLite.to(this.draggableObjectTarget_2, 0.5, {scaleX:0.3, scaleY:0.3, delay:0.5});
			TweenLite.to(this.draggableObjectTarget_3, 0.5, {scaleX:0.3, scaleY:0.3, delay:0.5});
			// sndMan.playSound("gips"); //TODO sound
			AudioPlayer.getInstance().playSound("gips", 0, Config.EFFECTS_VOLUME_LEVEL);

			this.alpha = 0;
			TweenLite.to(this, .3, {alpha:1});
		}else{
			TweenLite.to(this, .3, {x:this._initialPosition.x, y:this._initialPosition.y});
			this.removeChild(this.specificTreatImage);
			this.addChild(this.treatImage);
			// ItemsSelector(this.parent).setState(ItemsSelector.OPEN); //TODO
			// ItemsSelector(this.parent).updateTreatItemTargets(this, false); //TODO

			let parentItem:ItemsSelector = this.parent as ItemsSelector;
			parentItem.setState(ItemsSelector.OPEN);
			parentItem.updateTreatItemTargets(this, false);

			if(this._type == TreatItem.BAND_AID){
				this.draggableObjectTarget_1.scale.x = this.draggableObjectTarget_1.scale.y = 0.3;
				this.draggableObjectTarget_2.scale.x = this.draggableObjectTarget_2.scale.y = 0.3;
				this.draggableObjectTarget_3.scale.x = this.draggableObjectTarget_3.scale.y = 0.3;
			}
		}
	}

	private onSnappedToTarget = (bandAidTarget:string = ""):void => {
		Logger.log(this, "TreatItem onSnappedToTarget");
		// dispatchEvent(new HospitalEvent(HospitalEvent.BANDAGE_PLACED, true));
		this.emit(HospitalEvent.BANDAGE_PLACED);

		let clone:TreatItem = new TreatItem(this.itemsSelector, this._treatTexture, this._type, null, null, null, false);
		clone.touchable = false;

		clone.showSpecificTreatImage();

		let itemSelector:ItemsSelector = this.parent as ItemsSelector;
		itemSelector.placeTreatItem(clone, bandAidTarget); //TODO
		// ItemsSelector(this.parent).placeTreatItem(clone, bandAidTarget); //TODO

		this.x = this._initialPosition.x;
		this.y = this._initialPosition.y;
		this.scale.x = this.scale.y = 1;

		this.removeChild(this.specificTreatImage);
		this.addChild(this.treatImage);


		itemSelector.setState(ItemsSelector.OPEN); //TODO
		itemSelector.updateTreatItemTargets(this, false, this._type == TreatItem.LEMONADE); //TODO
		// ItemsSelector(this.parent).setState(ItemsSelector.OPEN); //TODO ORIG
		// ItemsSelector(this.parent).updateTreatItemTargets(this, false, this._type == TreatItem.LEMONADE); //TODO
	}

	private checkCollisionWithTarget():void {
		let itemSelector:ItemsSelector = this.parent as ItemsSelector;

		Logger.log(this, "TreatItem checkCollisionWithTarget");
		Logger.log(this, "TreatItem checkCollisionWithTarget  this.draggableObjectTarget_1 == "+this.draggableObjectTarget_1);
		Logger.log(this, "TreatItem checkCollisionWithTarget  itemSelector.x == "+itemSelector.x + " : itemSelector.y == "+itemSelector.y);
		Logger.log(this, "TreatItem checkCollisionWithTarget  this.draggableObjectTarget_1.x == "+this.draggableObjectTarget_1.x + " : this.draggableObjectTarget_1.y == "+this.draggableObjectTarget_1.y);
		Logger.log(this, "TreatItem checkCollisionWithTarget  this.rectCover.getBounds() == "+this.rectCover.getBounds().x+" : "+this.rectCover.getBounds().y+" : "+this.rectCover.getBounds().width+" : "+this.rectCover.getBounds().height);
		Logger.log(this, "TreatItem checkCollisionWithTarget  this.draggableObjectTarget_1.getBounds() == "+this.draggableObjectTarget_1.getBounds().x+" : "+this.draggableObjectTarget_1.getBounds().y+" : "+this.draggableObjectTarget_1.getBounds().width+" : "+this.draggableObjectTarget_1.getBounds().height);
		Logger.log(this, "TreatItem checkCollisionWithTarget  SpriteHelper.hitTest(this.rectCover.getBounds(), this.draggableObjectTarget_1.getBounds()) == "+SpriteHelper.hitTest(this.rectCover.getBounds(), this.draggableObjectTarget_1.getBounds()));
		// if(this.checkCollision(this, this.draggableObjectTarget_1)){
		if(SpriteHelper.hitTest(this.rectCover.getBounds(), this.draggableObjectTarget_1.getBounds())){
			this.draggableObjectTarget_1.alpha = 0.6;
		}else{
			this.draggableObjectTarget_1.alpha = 1;
		}

		if(this.draggableObjectTarget_2){
			if(SpriteHelper.hitTest(this.rectCover.getBounds(), this.draggableObjectTarget_2.getBounds())){
				this.draggableObjectTarget_2.alpha = 0.6;
			}else{
				this.draggableObjectTarget_2.alpha = 1;
			}
		}

		if(this.draggableObjectTarget_3){
			if(SpriteHelper.hitTest(this.rectCover.getBounds(), this.draggableObjectTarget_3.getBounds())){
				this.draggableObjectTarget_3.alpha = 0.6;
			}else{
				this.draggableObjectTarget_3.alpha = 1;
			}
		}

	}

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


	public get type():string {
		return this._type;
	}

	public set type(value:string) {
		this._type = value;
	}

	public get treatTexture():string {
		return this._treatTexture;
	}

	public set treatTexture(value:string) {
		this._treatTexture = value;
	}

	public destroy():void{
		this.off(TouchEvent.TOUCH, this.touchDown);
		this.off(TouchEvent.TOUCH_END, this.touchDone);
		this.off(TouchEvent.TOUCH_OUT, this.touchDone);
		this.off(TouchEvent.TOUCH_MOVE, this.touchMove);
	}

}
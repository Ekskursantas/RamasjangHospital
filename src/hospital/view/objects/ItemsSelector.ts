import {DraggableItem} from "./DraggableItem";
import {InflatableButton} from "./InflatableButton";
import {Button} from "../../../loudmotion/ui/Button";
import {Config} from "../../Config";
import {TreatItem} from "../operatingroom/objects/TreatItem";
import {ClothesItem} from "../waitingroom/objects/ClothesItem";
import {ButtonEvent} from "../../event/ButtonEvent";
import {Logger} from "../../../loudmotion/utils/debug/Logger";
import {Sprite, Texture, Point} from "pixi.js";
import {AudioPlayer} from "../../../loudmotion/utils/AudioPlayer";
import {MainView} from "../MainView";
import {AssetLoader} from "../../utils/AssetLoader";
import Rectangle = PIXI.Rectangle;

export class ItemsSelector extends Sprite {
	get offSetPosY(): number {
		return this._offSetPosY;
	}
	get offSetPosX(): number {
		return this._offSetPosX;
	}

	public static DRAGGABLE_ON_ALPHA:number = 0.5;
	public static CLOTHES:string = "appdrhospital.view.objects.ItemsSelector.clothes";
	public static TREATS:string = "appdrhospital.view.objects.ItemsSelector.treats";
	public static CLOSED:string = "appdrhospital.view.objects.ItemsSelector.CLOSED";
	public static OPEN:string = "appdrhospital.view.objects.ItemsSelector.OPEN";
	public static OPEN_BAG_ONLY:string = "appdrhospital.view.objects.ItemsSelector.OPEN_BAG_ONLY";
	public static OPENED:string = "appdrhospital.view.objects.ItemsSelector.OPENED";
	public static HAS_CLOSED:string = "appdrhospital.view.objects.ItemsSelector.HAS_CLOSED";
	
	public hasBeenClicked:boolean;
	private state:string;

	private background:Sprite;
	private bagOpen:Button;
	private bagClosed:Button;
	private btnPrevious:InflatableButton;
	private items:any;
	private focusedItem_1:DraggableItem;
	private focusedItem_2:DraggableItem;
	private focusedItem_3:DraggableItem;
	private focusedItem_4:DraggableItem;
	private contentType:string;
	private draggableObjectTarget:Sprite;
	private draggableObjectBandageTarget:Sprite;
	private draggableObjectGlassTarget:Sprite;
	private draggableObjectBandAidTarget_1:Sprite;
	private draggableObjectBandAidTarget_2:Sprite;
	private draggableObjectBandAidTarget_3:Sprite;
	private placedBandageItem:TreatItem;
	private placedLemonadeItem:TreatItem;
	private placedBandAidItem_1:TreatItem;
	private placedBandAidItem_2:TreatItem;
	private placedBandAidItem_3:TreatItem;
	
	// private sndMan:SoundManager;
	private clothesSpeakCounter:number;

	private _offSetPosX:number;
	private _offSetPosY:number;


	
	constructor(contentType:string, draggableObjectTarget = null) {
		super();
		this.contentType = contentType;
		this.draggableObjectTarget = draggableObjectTarget;
		this.clothesSpeakCounter = 0;

		this.placedBandageItem = null;
		this.placedLemonadeItem = null;
		this.placedBandAidItem_1 = null;
		this.placedBandAidItem_2 = null;
		this.placedBandAidItem_3 = null;

		this._offSetPosX = AssetLoader.STAGE_WIDTH * .5;
		this._offSetPosY = 630;

		this.onAddedToStage();
	}

	private onAddedToStage():void {
		if(this.contentType == ItemsSelector.TREATS){
			this.createTreatTargets();
		}

		this.createSelectorArt();

		if(this.contentType == ItemsSelector.CLOTHES){
			this.createClothesItems();
			ClothesItem.clothesSpeakCounter = 0;
		}

		if(this.contentType == ItemsSelector.TREATS){
			this.createTreatItems();
		}

		this.createBagButtons();

		this.initNavigationButtons();
		this.focusItems(0);
		this.setState(ItemsSelector.CLOSED);
		// sndMan = SoundManager.getInstance(); //TODO sound

	}
	
	public highlight():void {
		// TweenMax.to(this.bagClosed, 0.5, {width:"+=40", height:"+=40", x:"-=20", y:"-20", repeat:-1, yoyo:true, ease:Linear.easeNone});
		TweenMax.to(this.bagClosed, 0.5, {width:"+=40", height:"+=40", repeat:-1, yoyo:true, ease:Linear.easeNone});
	}

	public get bagClosedPos():Rectangle{
		Logger.log(this, "ItemSelector bagClosedPos this.bagClosed.height == "+this.bagClosed.height);
		return new Rectangle(this.x + this.bagClosed.x, this. y + this.bagClosed.y, this.bagClosed.width, this.bagClosed.height);
	}

	public endHighlight():void {
		this.bagClosed.scale.x = this.bagClosed.scale.y = 1;
		// this.bagClosed.x = AssetLoader.STAGE_WIDTH - this.background.width * .5;
		// this.bagClosed.y = AssetLoader.STAGE_HEIGHT - this.bagClosed.height * .5 - 20;
		TweenMax.killTweensOf(this.bagClosed);
	}
	
	public setState(state:string):void {
		Logger.log(this, "ItemSelector setState  state == "+state);
		Logger.log(this, "ItemSelector this.focusedItem_1 == "+this.focusedItem_1);
		Logger.log(this, "ItemSelector this.focusedItem_2 == "+this.focusedItem_2);
		Logger.log(this, "ItemSelector this.focusedItem_3 == "+this.focusedItem_3);
		Logger.log(this, "ItemSelector this.focusedItem_4 == "+this.focusedItem_4);
		this.state  = state;

		this.background.visible = false;
		this.btnPrevious.visible = false;
		this.bagClosed.visible = false;
		this.bagOpen.visible = false;

		if(this.focusedItem_1 != null) {
			this.focusedItem_1.visible = false;
		}
		if(this.focusedItem_2 != null) {
			this.focusedItem_2.visible = false;
		}
		if(this.focusedItem_3 != null) {
			this.focusedItem_3.visible = false;
		}
		if(this.focusedItem_4 != null) {
			this.focusedItem_4.visible = false;
		}
		
		switch(state) {
			case ItemsSelector.CLOSED:
				this.bagClosed.visible = true;
				break;
				
			case ItemsSelector.OPEN:
				this.bagOpen.visible = true;
				this.background.visible = true;
				
				if(this.items.length > 4) {
					this.btnPrevious.visible = true;
				}

				if(this.focusedItem_1) {
					this.focusedItem_1.visible = true;
				}
				if(this.focusedItem_2) {
					this.focusedItem_2.visible = true;
				}
				if(this.focusedItem_3) {
					this.focusedItem_3.visible = true;
				}
				if(this.focusedItem_4) {
					this.focusedItem_4.visible = true;
				}

				break;
				
			case ItemsSelector.OPEN_BAG_ONLY:
				this.bagOpen.visible = true;
				break;
				
			default:
				break;
		}
	}
	
	public placeTreatItem(treatItem:TreatItem, bandAidTarget:string = ""):void {
		Logger.log(this, "ItemSelector placeTreatItem  treatItem == "+treatItem+" : treatItem.type == "+treatItem.type+" : bandAidTarget == "+bandAidTarget);
		switch(treatItem.type) {
			case TreatItem.BANDAGE:
				Logger.log(this, "ItemSelector placeTreatItem TreatItem.BANDAGE this.placedBandageItem == "+this.placedBandageItem);
				if(this.placedBandageItem != null){
					this.draggableObjectBandageTarget.removeChild(this.placedBandageItem);
					this.placedBandageItem = null;
				}
				this.placedBandageItem = treatItem;
				this.draggableObjectBandageTarget.addChild(this.placedBandageItem);
				Logger.log(this, "ItemSelector placeTreatItem TreatItem.BANDAGE this.placedBandageItem == "+this.placedBandageItem);
				break;
				
			case TreatItem.BAND_AID:
				if(bandAidTarget == TreatItem.BAND_AID_TARGET_1){
					if(this.placedBandAidItem_1 != null){
						this.draggableObjectBandAidTarget_1.removeChild(this.placedBandAidItem_1);
						this.placedBandAidItem_1 = null;
					}
					this.placedBandAidItem_1 = treatItem;
					this.draggableObjectBandAidTarget_1.addChild(this.placedBandAidItem_1);
					break;
				}else if(bandAidTarget == TreatItem.BAND_AID_TARGET_2){
					if(this.placedBandAidItem_2 != null){
						this.draggableObjectBandAidTarget_2.removeChild(this.placedBandAidItem_2);
						this.placedBandAidItem_2 = null;
					}
					this.placedBandAidItem_2 = treatItem;
					this.draggableObjectBandAidTarget_2.addChild(this.placedBandAidItem_2);
					break;
				}else if(bandAidTarget == TreatItem.BAND_AID_TARGET_3){
					if(this.placedBandAidItem_3 != null){
						this.draggableObjectBandAidTarget_3.removeChild(this.placedBandAidItem_3);
						this.placedBandAidItem_3 = null;
					}
					this.placedBandAidItem_3 = treatItem;
					this.draggableObjectBandAidTarget_3.addChild(this.placedBandAidItem_3);
					break;
				}
				break;
			case TreatItem.LEMONADE:
				if(this.placedLemonadeItem != null){
					this.draggableObjectGlassTarget.removeChild(this.placedLemonadeItem);
					this.placedLemonadeItem = null;
				}
				this.placedLemonadeItem = treatItem;

				this.draggableObjectGlassTarget.addChild(this.placedLemonadeItem);
				TweenLite.to(this.placedLemonadeItem, 1, {alpha:0, delay:1, onComplete:():void => {
					this.draggableObjectGlassTarget.visible = false;
				}});
				AudioPlayer.getInstance().playSound("drink_water", 0, Config.SPEAK_VOLUME_LEVEL);
				break;
				
			default:
				break;
		}
	}

	public updateTreatItemTargets(treatItem:TreatItem, active:boolean, delay:boolean = false):void {
		switch(treatItem.type) {
			case TreatItem.BANDAGE:
				this.draggableObjectBandageTarget.visible = active || this.placedBandageItem != null;
				break;
				
			case TreatItem.BAND_AID:
				this.draggableObjectBandAidTarget_1.visible = active || this.placedBandAidItem_1 != null;
				this.draggableObjectBandAidTarget_2.visible = active || this.placedBandAidItem_2 != null;
				this.draggableObjectBandAidTarget_3.visible = active || this.placedBandAidItem_3 != null;
				if(active){
					this.draggableObjectBandAidTarget_1.scale.x = this.draggableObjectBandAidTarget_1.scale.y = 1;
					this.draggableObjectBandAidTarget_2.scale.x = this.draggableObjectBandAidTarget_2.scale.y = 1;
					this.draggableObjectBandAidTarget_3.scale.x = this.draggableObjectBandAidTarget_3.scale.y = 1;
				}else{
				}
				break;
				
			case TreatItem.LEMONADE:
				if(delay){
					this.draggableObjectGlassTarget.visible = true;
				}else{
					this.draggableObjectGlassTarget.visible = active;
				}
				
				break;
				
			default:
				break;
		}
	}

	private initNavigationButtons():void {
		this.btnPrevious.on(ButtonEvent.CLICKED, this.navigationButtonListener);
		this.btnPrevious.padding = 50;
	}
	
	private navigationButtonListener = (event:Event):void => {
		let nextIndex:number;
		nextIndex = (this.items.indexOf(this.focusedItem_1) + 4) % this.items.length;
		this.focusItems(nextIndex);
	}
	
	private focusItems(firstItemIndex:number):void {
		if(this.items.length < 5){
			this.btnPrevious.visible = false;
		}
		
		if(this.focusedItem_1 != null){
			this.removeChild(this.focusedItem_1);
			this.focusedItem_1 = null;
		}
		
		if(this.focusedItem_2 != null){
			this.removeChild(this.focusedItem_2);
			this.focusedItem_2 = null;
		}

		if(this.focusedItem_3 != null){
			this.removeChild(this.focusedItem_3);
			this.focusedItem_3 = null;
		}

		if(this.focusedItem_4 != null){
			this.removeChild(this.focusedItem_4);
			this.focusedItem_4 = null;
		}


		this.focusedItem_1 = this.items[firstItemIndex];
		
		if(this.focusedItem_1 != null){
			this.addChild(this.focusedItem_1);
			this.focusedItem_1.x = this.offSetPosX - 270;
			
			if(this.contentType == ItemsSelector.TREATS && (this.focusedItem_1 as TreatItem).type == TreatItem.LEMONADE){
				this.focusedItem_1.y = this.offSetPosY - 50;
			}else{
				this.focusedItem_1.y = this.offSetPosY + 0;
			}

			this.focusedItem_1.initialPosition = new Point(this.focusedItem_1.x, this.focusedItem_1.y);
		}

		
		if(this.items.length > firstItemIndex + 1){
			this.focusedItem_2 = this.items[firstItemIndex + 1];
		}else{
			this.focusedItem_2 = this.items[(firstItemIndex + 1) % this.items.length];
		}
		
		if(this.focusedItem_2 != null){
			this.addChild(this.focusedItem_2);
			this.focusedItem_2.x = this.offSetPosX - 90;
			
			if(this.contentType == ItemsSelector.TREATS && (this.focusedItem_2 as TreatItem).type == TreatItem.LEMONADE){
				this.focusedItem_2.y = this.offSetPosY - 50;
			}else{
				this.focusedItem_2.y = this.offSetPosY + 0;
			}
			this.focusedItem_2.initialPosition = new Point(this.focusedItem_2.x, this.focusedItem_2.y);
		}

		
		if(this.items.length > firstItemIndex + 2){
			this.focusedItem_3 = this.items[firstItemIndex + 2];
		}else{
			this.focusedItem_3 = this.items[(firstItemIndex + 2) % this.items.length];
		}
		
		if(this.focusedItem_3 != null){
			this.addChild(this.focusedItem_3);
			this.focusedItem_3.x = this.offSetPosX + 90;
			
			if(this.contentType == ItemsSelector.TREATS && (this.focusedItem_3 as TreatItem).type == TreatItem.LEMONADE){
				this.focusedItem_3.y = this.offSetPosY - 50;
			}else{
				this.focusedItem_3.y = this.offSetPosY + 0;
			}
			this.focusedItem_3.initialPosition = new Point(this.focusedItem_3.x, this.focusedItem_3.y);
		}

		if(this.items.length > firstItemIndex + 3){
			this.focusedItem_4 = this.items[firstItemIndex + 3];
		}else{
			this.focusedItem_4 = this.items[(firstItemIndex + 3) % this.items.length];
		}
		
		if(this.focusedItem_4 != null){
			this.addChild(this.focusedItem_4);
			this.focusedItem_4.x = this.offSetPosX + 270;
			
			if(this.contentType == ItemsSelector.TREATS && (this.focusedItem_4 as TreatItem).type == TreatItem.LEMONADE){
				this.focusedItem_4.y = this.offSetPosY - 50;
			}else{
				this.focusedItem_4.y = this.offSetPosY + 0;
			}
			this.focusedItem_4.initialPosition = new Point(this.focusedItem_4.x, this.focusedItem_4.y);
		}
	}
	
	private createClothesItems():void {
		this.items = [];
		let unlockedClothes:any = Config.getUnlockedClothes();
		
		// Sort in upper and under
		for (let k:number = 0; k < unlockedClothes.length; k++) {
			let nextClothesTextureBottom:string = unlockedClothes[k];
			
			if(nextClothesTextureBottom.substr(0, 12) == "clothesLower"){
				let clothesItemBottom:ClothesItem = new ClothesItem(nextClothesTextureBottom, ClothesItem.BOTTOM);
				this.items.push(clothesItemBottom);
			}
		}
		
		for (let l:number = 0; l < unlockedClothes.length; l++) {
			let nextClothesTextureTop:string = unlockedClothes[l];
			
			if(nextClothesTextureTop.substr(0, 12) == "clothesUpper"){
				let clothesItemTop:ClothesItem = new ClothesItem(nextClothesTextureTop, ClothesItem.TOP);
				this.items.push(clothesItemTop);
			}
		}
	}
	
	private createTreatItems():void {
		this.items = [];

		let unlockedBandages:any = Config.getUnlockedBandages();
		for (let i:number = 0; i < unlockedBandages.length; i++) {
			let nextBandageTexture:string = unlockedBandages[i];
			let nextBandage:TreatItem = new TreatItem(this, nextBandageTexture, TreatItem.BANDAGE, this.draggableObjectBandageTarget);
			this.items.push(nextBandage);
		}

		let unlockedLemonades:any = Config.getUnlockedLemonades();
		for (let j:number = 0; j < unlockedLemonades.length; j++) {
			let nextLemonadeTexture:string = unlockedLemonades[j];
			let nextLemonade:TreatItem = new TreatItem(this, nextLemonadeTexture, TreatItem.LEMONADE, this.draggableObjectGlassTarget);
			this.items.push(nextLemonade);
		}

		let unlockedBandAids:any = Config.getUnlockedbandAids();
		for (let k:number = 0; k < unlockedBandAids.length; k++) {
			let nextBandAidTexture:string = unlockedBandAids[k];
			let nextBandAid:TreatItem = new TreatItem(this, nextBandAidTexture, TreatItem.BAND_AID, this.draggableObjectBandAidTarget_1, this.draggableObjectBandAidTarget_2, this.draggableObjectBandAidTarget_3);
			this.items.push(nextBandAid);
		}
	}
	
	private createTreatTargets():void {
		// Show bandage target
		let draggableObjectBandageTargetImage:Sprite = Sprite.fromFrame("forbinding_gips_01");
		draggableObjectBandageTargetImage.alpha = ItemsSelector.DRAGGABLE_ON_ALPHA;
		this.draggableObjectBandageTarget = new Sprite();
		this.draggableObjectBandageTarget.addChild(draggableObjectBandageTargetImage);
		draggableObjectBandageTargetImage.pivot.x = draggableObjectBandageTargetImage.width * .5;
		draggableObjectBandageTargetImage.pivot.y = draggableObjectBandageTargetImage.height * .5;
		this.addChild(this.draggableObjectBandageTarget);
		this.draggableObjectBandageTarget.x = 480 - this.x; //TODO
		this.draggableObjectBandageTarget.y = 523 - this.y;
		this.draggableObjectBandageTarget.visible = false;

		// Show glass target
		let draggableObjectGlassTargetImage:Sprite = Sprite.fromFrame("saftevand_02");
		draggableObjectGlassTargetImage.alpha = ItemsSelector.DRAGGABLE_ON_ALPHA;
		this.draggableObjectGlassTarget = new Sprite();
		this.draggableObjectGlassTarget.addChild(draggableObjectGlassTargetImage);
		draggableObjectGlassTargetImage.pivot.x = draggableObjectGlassTargetImage.width * .5;
		draggableObjectGlassTargetImage.pivot.y = draggableObjectGlassTargetImage.height * .5;
		this.addChild(this.draggableObjectGlassTarget);
		this.draggableObjectGlassTarget.x = 625 - this.x;
		this.draggableObjectGlassTarget.y = 360 - this.y;
		this.draggableObjectGlassTarget.visible = false;

		// Show band aid targets
		let draggableObjectBandAidTargetImage:Sprite = Sprite.fromFrame("plaster_01");
		draggableObjectBandAidTargetImage.alpha = ItemsSelector.DRAGGABLE_ON_ALPHA;
		this.draggableObjectBandAidTarget_1 = new Sprite();
		this.draggableObjectBandAidTarget_1.addChild(draggableObjectBandAidTargetImage);
		draggableObjectBandAidTargetImage.pivot.x = draggableObjectBandAidTargetImage.width * .5;
		draggableObjectBandAidTargetImage.pivot.y = draggableObjectBandAidTargetImage.height * .5;

		this.addChild(this.draggableObjectBandAidTarget_1);
		this.draggableObjectBandAidTarget_1.x = 690 - this.x;
		this.draggableObjectBandAidTarget_1.y = 504 - this.y;
		this.draggableObjectBandAidTarget_1.visible = false;
		
		let draggableObjectBandAidTargetImage_2:Sprite = Sprite.fromFrame("plaster_01");
		draggableObjectBandAidTargetImage_2.alpha = ItemsSelector.DRAGGABLE_ON_ALPHA;
		this.draggableObjectBandAidTarget_2 = new Sprite();
		this.draggableObjectBandAidTarget_2.addChild(draggableObjectBandAidTargetImage_2);
		draggableObjectBandAidTargetImage_2.pivot.x = draggableObjectBandAidTargetImage_2.width * .5;
		draggableObjectBandAidTargetImage_2.pivot.y = draggableObjectBandAidTargetImage_2.height * .5;

		this.addChild(this.draggableObjectBandAidTarget_2);
		this.draggableObjectBandAidTarget_2.x = 550 - this.x;
		this.draggableObjectBandAidTarget_2.y = 300 - this.y;
		this.draggableObjectBandAidTarget_2.visible = false;

		let draggableObjectBandAidTargetImage_3:Sprite = Sprite.fromFrame("plaster_01");
		draggableObjectBandAidTargetImage_3.alpha = ItemsSelector.DRAGGABLE_ON_ALPHA;
		this.draggableObjectBandAidTarget_3 = new Sprite();
		this.draggableObjectBandAidTarget_3.addChild(draggableObjectBandAidTargetImage_3);
		draggableObjectBandAidTargetImage_3.pivot.x = draggableObjectBandAidTargetImage_3.width * .5;
		draggableObjectBandAidTargetImage_3.pivot.y = draggableObjectBandAidTargetImage_3.height * .5;

		this.addChild(this.draggableObjectBandAidTarget_3);
		this.draggableObjectBandAidTarget_3.x = 565 - this.x;
		this.draggableObjectBandAidTarget_3.y = 700 - this.y;
		this.draggableObjectBandAidTarget_3.visible = false;
	}
	
	private createSelectorArt():void {
		this.background = Sprite.fromFrame("unlock_bg");
		this.addChild(this.background);
		this.background.scale.x = this.background.scale.y= 2;
		this.background.pivot.x = this.background.width * .5;
		this.background.pivot.y = this.background.height * .5;
		this.background.x = this._offSetPosX + this.background.width * .5 - 10;
		this.background.y = this._offSetPosY + this.background.height * .5;

		this.btnPrevious = new InflatableButton();
		this.btnPrevious.addTexture(Texture.fromFrame("unlock_leftArrow"));
		this.addChild(this.btnPrevious);
		this.btnPrevious.x = this._offSetPosX - this.background.width * .5;
		this.btnPrevious.y = this._offSetPosY;
	}
	
	private createBagButtons():void {
		let offSetPosY:number = 0;
		if(this.contentType == ItemsSelector.CLOTHES){
			this.bagOpen = new Button();
			this.bagOpen.addTexture(Texture.fromFrame("kuffert_aaben"));
			this.bagClosed = new Button();
			this.bagClosed.addTexture(Texture.fromFrame("kuffert_lukket"));
		}else if(this.contentType == ItemsSelector.TREATS){
			this.bagOpen = new Button();
			this.bagOpen.addTexture(Texture.fromFrame("laegetaske_aaben"));
			this.bagClosed = new Button();
			this.bagClosed.addTexture(Texture.fromFrame("laegetaske_lukket"));
			offSetPosY = this.bagClosed.height * .25;
		}
		this.addChild(this.bagOpen);
		this.bagOpen.x = this._offSetPosX + this.background.width * .5;
		this.bagOpen.y = this._offSetPosY + offSetPosY;

		this.addChild(this.bagClosed);
		this.bagClosed.x = this.bagOpen.x; //this.background.width * .5;
		this.bagClosed.y = this.bagOpen.y; //this.bagClosed.height * .5 - 20;

		this.bagOpen.on(ButtonEvent.CLICKED, this.bagPressed);
		this.bagClosed.on(ButtonEvent.CLICKED, this.bagPressed);
	}
	
    private bagPressed = (event: Event): void => {
        Logger.log(this, "Bag Was Pressed");
        console.log("Bag was Pressed");
		this.hasBeenClicked = true;
		this.endHighlight();
		if(this.state == ItemsSelector.CLOSED){
			this.setState(ItemsSelector.OPEN);
			this.emit(ItemsSelector.OPEN);

		}else if(this.state == ItemsSelector.OPEN){
			this.setState(ItemsSelector.CLOSED);
			this.emit(ItemsSelector.CLOSED);
		}
		AudioPlayer.getInstance().playSound("toj_swipe_swoosh", 0, Config.EFFECTS_VOLUME_LEVEL);
	}

	public destroy():void{
		if(this.background != null){
			this.removeChild(this.background);
			this.background = null;
		}

		if(this.bagOpen != null){
			this.removeChild(this.bagOpen);
			this.bagOpen.off(ButtonEvent.CLICKED, this.bagPressed);
			this.bagOpen = null;
		}

		if(this.bagClosed != null){
			this.removeChild(this.bagClosed);
			this.bagClosed.off(ButtonEvent.CLICKED, this.bagPressed);
			this.bagClosed = null;
		}

		if(this.btnPrevious != null){
			this.removeChild(this.btnPrevious);
			this.btnPrevious.off(ButtonEvent.CLICKED, this.navigationButtonListener);
			this.btnPrevious = null;
		}

		if(this.focusedItem_1 != null){
			this.removeChild(this.focusedItem_1);
			this.focusedItem_1 = null;
		}

		if(this.focusedItem_2 != null){
			this.removeChild(this.focusedItem_2);
			this.focusedItem_2 = null;
		}

		if(this.focusedItem_3 != null){
			this.removeChild(this.focusedItem_3);
			this.focusedItem_3 = null;
		}

		if(this.focusedItem_4 != null){
			this.removeChild(this.focusedItem_4);
			this.focusedItem_4 = null;
		}

		if(this.draggableObjectTarget != null){
			this.draggableObjectTarget = null;
		}

		if(this.draggableObjectBandageTarget != null){
			this.removeChild(this.draggableObjectBandageTarget);
			this.draggableObjectBandageTarget = null;
		}

		if(this.draggableObjectGlassTarget != null){
			this.removeChild(this.draggableObjectGlassTarget);
			this.draggableObjectGlassTarget.removeChildren();
			this.draggableObjectGlassTarget = null;
		}

		if(this.draggableObjectBandAidTarget_1 != null){
			this.removeChild(this.draggableObjectBandAidTarget_1);
			this.draggableObjectBandAidTarget_1.removeChildren();
			this.draggableObjectBandAidTarget_1 = null;
		}

		if(this.draggableObjectBandAidTarget_2 != null){
			this.removeChild(this.draggableObjectBandAidTarget_2);
			this.draggableObjectBandAidTarget_2.removeChildren();
			this.draggableObjectBandAidTarget_2 = null;
		}

		if(this.draggableObjectBandAidTarget_3 != null){
			this.removeChild(this.draggableObjectBandAidTarget_3);
			this.draggableObjectBandAidTarget_3.removeChildren();
			this.draggableObjectBandAidTarget_3 = null;
		}
	}
}
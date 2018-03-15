import {Button} from "../../../loudmotion/ui/Button";
import {ButtonEvent} from "../../event/ButtonEvent";
import {ItemsSelector} from "./ItemsSelector";
import {Config} from "../../Config";
import {Scanner} from "../operatingroom/objects/Scanner";
import {Sprite, Point, Texture} from "pixi.js";
import {Logger} from "../../../loudmotion/utils/debug/Logger";
import {AudioPlayer} from "../../../loudmotion/utils/AudioPlayer";
import Graphics = PIXI.Graphics;
import {HospitalGameView} from "../HospitalGameView";
import Rectangle = PIXI.Rectangle;

export class UnlockedScreen extends Sprite {
	public static WRAPPED_GIFT_PRESSED:string = "appdrhospital.view.objects.UnlockedScreen.WRAPPED_GIFT_PRESSED";

	private background:Sprite;
	private wrappedGift:Button;
	private contentType:string;

	private unlockedItemSprite:Sprite;
	private bandageImage:Sprite;
	private clothesImage:Sprite;
	private clothesImage2:Sprite;
	private scanner:Scanner;


	// In operating room: Doctors briefcase, in waiting room: suitcase
	private giftDestination:Rectangle;


	constructor(giftDestination:Rectangle, contentType:string) {
		super();
		this.giftDestination = giftDestination;
		Logger.log(this, "UnlockedScreen giftDestination == "+giftDestination.x+" : "+giftDestination.y);
		this.contentType = contentType;
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.createScreenArt();
		this.showWrappedGift();
		this.highlight();
	}

	public highlight():void {
		TweenMax.to(this.wrappedGift, 0.5, {width:"+=40", height:"+=40", x:"+=20", y:"+=20", repeat:-1, yoyo:true, ease:Linear.easeNone});
	}

	public endHighlight():void {
		TweenMax.killTweensOf(this.wrappedGift);
		this.wrappedGift.scale.x = this.wrappedGift.scale.y = 1;
		this.positionWrappedGift();
	}

	private showWrappedGift():void {
		this.wrappedGift.visible = true;
		this.wrappedGift.on(ButtonEvent.CLICKED, this.wrappedGiftPressed);
	}

	private wrappedGiftPressed = (event:Event):void => {
		this.endHighlight();
		this.wrappedGift.visible = false;
		this.showUnlockedItem();
		this.emit(UnlockedScreen.WRAPPED_GIFT_PRESSED);
	}

	private showUnlockedItem():void {
		let unlockedItem:string;

		// Make sure level is not out of range (if patientsCured exceeds number of levels)
		let index:number = Config.patientsCured < Config.levels.length ? Config.patientsCured  : Config.levels.length - 1;

		if(this.contentType == ItemsSelector.CLOTHES){
			if(Config.levels[index].unlockedClothes.length > 0){
				unlockedItem = Config.levels[index].unlockedClothes[0];
			}
		}else if(this.contentType == ItemsSelector.TREATS){
			// Check if unlocked item of current level is Bandage
			if(Config.levels[index].unlockedBandage.length > 0){
				unlockedItem = Config.levels[index].unlockedBandage[0];
			}

			// Check if unlocked item of current level is Band aid
			if(Config.levels[index].unlockedBandAid.length > 0){
				unlockedItem = Config.levels[index].unlockedBandAid[0];
			}

			// Check if unlocked item of current level is Lemonade
			if(Config.levels[index].unlockedLemonade.length > 0){
				unlockedItem = Config.levels[index].unlockedLemonade[0];
			}
		}

		if(unlockedItem){
			this.unlockedItemSprite = Sprite.fromFrame(unlockedItem);

			var rectCover = new Graphics(); //TODO THIS IS IMPORTANT to get scaling to work.
			rectCover.beginFill(0xFFFFFF);
			rectCover.alpha = HospitalGameView.RECT_COVER_ALPHA;
			this.unlockedItemSprite.addChild(rectCover);
			rectCover.drawRect(this.unlockedItemSprite.x, this.unlockedItemSprite.y, this.unlockedItemSprite.width, this.unlockedItemSprite.height);

			this.addChild(this.unlockedItemSprite);
			this.unlockedItemSprite.pivot.x = this.unlockedItemSprite.width * .5;
			this.unlockedItemSprite.pivot.y = this.unlockedItemSprite.height * .5;
			this.unlockedItemSprite.x = this.wrappedGift.x - this.unlockedItemSprite.width * .5;
			this.unlockedItemSprite.y = this.wrappedGift.y - this.unlockedItemSprite.height * .5;

			TweenLite.to(this.unlockedItemSprite, 1, {x:this.giftDestination.x, y:this.giftDestination.y, delay:1});
			TweenLite.to(this.unlockedItemSprite.scale, 0.75, {x:0.5, y:0.5, delay:1});

			AudioPlayer.getInstance().playSound("klapsalve", 0, Config.EFFECTS_VOLUME_LEVEL);
		}
	}

	private createScreenArt():void {
		this.wrappedGift = new Button();
		this.wrappedGift.addTexture(Texture.fromFrame("unlock_pakke"));
		this.wrappedGift.pivot.x = this.wrappedGift.width * .5;
		this.wrappedGift.pivot.y = this.wrappedGift.height * .5;
		this.addChild(this.wrappedGift);
		this.wrappedGift.visible = false;
		this.positionWrappedGift();
	}

	private positionWrappedGift():void {
		if(this.contentType == ItemsSelector.CLOTHES){
			this.wrappedGift.x = 800 + this.wrappedGift.width * .5;
			this.wrappedGift.y = 600;
		}else if(this.contentType == ItemsSelector.TREATS){
			this.wrappedGift.x = 1000 + this.wrappedGift.width * .5;
			this.wrappedGift.y = 330 + this.wrappedGift.height * .25;
		}
	}

	private update():void {
		// Make sure level is not out of range (if patientsCured exceeds number of levels)
		let index:number = Config.patientsCured < Config.levels.length ? Config.patientsCured : Config.levels.length - 1;

		// Bandage
		let bandageTexture:string = Config.levels[index].unlockedBandage[0];
		if(bandageTexture){
			this.bandageImage = Sprite.fromFrame(bandageTexture);
			this.addChild(this.bandageImage);
			this.bandageImage.pivot.x = this.bandageImage.width * .5;
			this.bandageImage.pivot.y = this.bandageImage.height * .5;
			this.bandageImage.x = 66 + this.bandageImage.width * .5;
			this.bandageImage.y = 90 + this.bandageImage.height * .5;
		}

		// Clothes
		let clothesTexture:string = Config.levels[index].unlockedClothes[0];
		if(clothesTexture){
			this.clothesImage = Sprite.fromFrame(clothesTexture);
			this.addChild(this.clothesImage);
			this.clothesImage.pivot.x = this.clothesImage.width*.5;
			this.clothesImage.pivot.y = this.clothesImage.height*.5;
			this.clothesImage.x = 340 + this.clothesImage.width * .5;
			this.clothesImage.y = 40 + this.clothesImage.height * .5;
		}

		let clothesTexture2:string = Config.levels[index].unlockedClothes[1];
		if(clothesTexture2){
			this.clothesImage2 = Sprite.fromFrame(clothesTexture2);
			this.addChild(this.clothesImage2);
			this.clothesImage2.pivot.x = this.clothesImage2.width*.5;
			this.clothesImage2.pivot.y = this.clothesImage2.height*.5;
			this.clothesImage2.x = 340 + this.clothesImage2.width * .5;
			this.clothesImage2.y = 350 + this.clothesImage2.height * .5;
		}

		// Scanner
		this.scanner = new Scanner();
		this.addChild(this.scanner);
		this.scanner.x = 36;
		this.scanner.y = 370;
		this.scanner.setUnlockedMode();
		let unlockedTool:string = Config.levels[index].unlockedTools[0];
		if(unlockedTool){
			this.scanner.highlightButton(unlockedTool, true);
		}
		this.scanner.scale.x = this.scanner.scale.y = 0.5;
	}

	public destroy():void{
		if(this.wrappedGift != null) {
			this.removeChild(this.wrappedGift);
			this.wrappedGift = null;
		}

		if(this.unlockedItemSprite != null) {
			this.removeChild(this.unlockedItemSprite);
			this.unlockedItemSprite = null;
		}

		if(this.bandageImage != null) {
			this.removeChild(this.bandageImage);
			this.bandageImage = null;
		}

		if(this.clothesImage != null) {
			this.removeChild(this.clothesImage);
			this.clothesImage = null;
		}

		if(this.clothesImage2 != null) {
			this.removeChild(this.clothesImage2);
			this.clothesImage2 = null;
		}

		if(this.scanner != null) {
			this.removeChild(this.scanner);
			this.scanner.destroy();
			this.scanner = null;
		}
		// super.destroy();
	}
}
import {Logger} from "../../../../loudmotion/utils/debug/Logger";
import {ScannerButton} from "./ScannerButton";
import {HotSpot} from "../../objects/HotSpot";
import {ButtonEvent} from "../../../event/ButtonEvent";
import {Level} from "../../../vo/Level";
import {Config} from "../../../Config";
import {Button} from "../../../../loudmotion/ui/Button";
import {TouchEvent} from "../../../../loudmotion/events/TouchLoudEvent";
import {TouchPhase} from "../../../../loudmotion/events/TouchLoudPhase";
import {Touch} from "../../../../loudmotion/events/TouchLoud";
import {AssetLoader} from "../../../utils/AssetLoader";
import {Sprite, extras, Point, Texture, Graphics} from "pixi.js";
import {AudioPlayer} from "../../../../loudmotion/utils/AudioPlayer";
import AbstractSoundInstance = createjs.AbstractSoundInstance;
import {ItemsSelector} from "../../objects/ItemsSelector";
import {SpriteHelper} from "../../../../loudmotion/utils/SpriteHelper";
import {HospitalGameView} from "../../HospitalGameView";


export class Scanner extends Sprite {
	public static SKELETAL:string = "appdrhospital.view.operatingroom.objects.scanner.skeletal";
	public static MUSCULAR:string = "appdrhospital.view.operatingroom.objects.scanner.muscular";
	public static CARDIOVASCULAR:string = "appdrhospital.view.operatingroom.objects.scanner.cardiovascular";
	public static DIGESTIVE:string = "appdrhospital.view.operatingroom.objects.scanner.digestive";
	public static RESPIRATORY_AND_UNINARY:string = "appdrhospital.view.operatingroom.objects.scanner.respiratoryandurinary";
	public static NERVOUS:string = "appdrhospital.view.operatingroom.objects.scanner.nervous";

	public maskRect:Graphics;
	// private _layerToMask:ClippedSprite; //TODO?
	private _layerToMask:Sprite;

	private inactiveImage:Sprite;
	private inactiveOutline:Sprite;
	private background:Sprite;

	private noiseScreen:extras.AnimatedSprite;

	private touch:Touch;
	private touchOffset:Point;

	private _state:string;

	private btnSkeletal:ScannerButton;
	private btnMuscular:ScannerButton;
	private btnCardioVascular:ScannerButton;
	private btnDigestive:ScannerButton;
	private btnRespiratoryAndUrinary:ScannerButton;
	private btnNervous:ScannerButton;

	private _hotspot:HotSpot;
	private patientLayerToDiseaseMap:any; //Dictionary;

	// private sndMan:SoundManager; //TODO sound
	public clickedOnce:boolean;

	private offsetPoint:Point;

	private mouseDown: boolean;
	private scannerSound:Howl;
    private sndSpeak: Howl;
    private noiseClip: Howl;

	private rectCover:Graphics;

	constructor() {
		super();
		// sndMan = SoundManager.getInstance(); //TODO sound
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		Logger.log(this, "Scanner onAddedToStage");
		this.interactive = true;
		this.buttonMode = true;
		this.createScannerArt();
		this.inactiveImage.on(TouchEvent.TOUCH, this.inactiveTouchListener);
		this.rectCover.on(TouchEvent.TOUCH, this.inactiveTouchListener);
	}

	public set hotspot(value:HotSpot) {
		Logger.log(this, "Scanner set hotspot   value == "+value);
		this._hotspot = value;
	}

	public get state():string {
		return this._state;
	}

	public set state(value:string) {
		this._state = value;
	}

	public createPatientLayerToDiseaseMap():void {
		this.patientLayerToDiseaseMap = {}; //new Dictionary();
		this.patientLayerToDiseaseMap[Level.FRACTURE_HAND] = Scanner.SKELETAL;
		this.patientLayerToDiseaseMap[Level.FRACTURE_RADIUS] = Scanner.SKELETAL;
		this.patientLayerToDiseaseMap[Level.SPRAIN] = Scanner.MUSCULAR;
		this.patientLayerToDiseaseMap[Level.PNEUMONIA] = Scanner.RESPIRATORY_AND_UNINARY;
		this.patientLayerToDiseaseMap[Level.POISONING] = Scanner.DIGESTIVE;
	}

	public update():void {
		Logger.log(this, "Scanner update");
		Logger.log(this, "Scanner update this.btnSkeletal == "+this.btnSkeletal);
		Logger.log(this, "Scanner update this.btnMuscular == "+this.btnMuscular);
		Logger.log(this, "Scanner update this.btnCardioVascular == "+this.btnCardioVascular);
		Logger.log(this, "Scanner update this.btnDigestive == "+this.btnDigestive);
		Logger.log(this, "Scanner update this.btnRespiratoryAndUrinary == "+this.btnRespiratoryAndUrinary);
		Logger.log(this, "Scanner update this.btnNervous == "+this.btnNervous);
		Logger.log(this, "Scanner update Config.patientsCured == "+Config.patientsCured);

		if(this.btnSkeletal != null) {
			this.disableButton(this.btnSkeletal);
		}
		if(this.btnMuscular != null) {
			this.disableButton(this.btnMuscular);
		}
		if(this.btnCardioVascular != null) {
			this.disableButton(this.btnCardioVascular);
		}
		if(this.btnDigestive != null) {
			this.disableButton(this.btnDigestive);
		}
		if(this.btnRespiratoryAndUrinary != null) {
			this.disableButton(this.btnRespiratoryAndUrinary);
		}
		if(this.btnNervous != null) {
			this.disableButton(this.btnNervous);
		}

		for (let i:number = 0; i <= Config.patientsCured; i++) {
			if(i >= Config.levels.length) {
				continue;
			}
			if(Config.levels[i].unlockedTools[0]){
				this.enableMode(Config.levels[i].unlockedTools[0]);
			}
		}
	}

	private enableMode(mode):void{
		switch(mode) {
			case Scanner.SKELETAL:
				this.enableButton(this.btnSkeletal);
				break;

			case Scanner.MUSCULAR:
				this.enableButton(this.btnMuscular);
				break;

			case Scanner.DIGESTIVE:
				this.enableButton(this.btnDigestive);
				break;

			case Scanner.RESPIRATORY_AND_UNINARY:
				this.enableButton(this.btnRespiratoryAndUrinary);
				break;

			case Scanner.CARDIOVASCULAR:
				this.enableButton(this.btnCardioVascular);
				break;

			case Scanner.NERVOUS:
				this.enableButton(this.btnNervous);
				break;

			default:
				break;
		}
	}

	public highlightButton(mode:string = "", unlockedMode:boolean = false):void{
		Logger.log(this, "Scanner highlightButton mode == "+mode+" : unlockedMode == "+unlockedMode);
		switch(mode) {
			case Scanner.SKELETAL:
				this.btnSkeletal.highlight();
//					btnSkeletalBig.visible = unlockedMode; //TODO not used in orig
				break;

			case Scanner.MUSCULAR:
				this.btnMuscular.highlight();
//					btnMuscularBig.visible = unlockedMode; //TODO not used in orig
				break;

			case Scanner.DIGESTIVE:
				this.btnDigestive.highlight();
//					btnDigestiveBig.visible = unlockedMode; //TODO not used in orig
				break;

			case Scanner.RESPIRATORY_AND_UNINARY:
				this.btnRespiratoryAndUrinary.highlight();
//					btnRespiratoryAndUrinaryBig.visible = unlockedMode; //TODO not used in orig
				break;

			case Scanner.CARDIOVASCULAR:
				this.btnCardioVascular.highlight();
//					btnCardioVascularBig.visible = unlockedMode; //TODO not used in orig
				break;

			case Scanner.NERVOUS:
				this.btnNervous.highlight();
//					btnNervousBig.visible = unlockedMode; //TODO not used in orig
				break;

			default:
				break;
		}
	}

	public setUnlockedMode():void{
		this.inactiveImage.visible = false; //TODO add back?

		this.stopHighlightInactive();

		this.background.visible = true;

		this.btnSkeletal.visible = true;
		this.btnMuscular.visible = true;
		this.btnDigestive.visible = true;
		this.btnRespiratoryAndUrinary.visible = true;
		this.btnCardioVascular.visible = true;
		this.btnNervous.visible = true;

		// this.update();
        //
		// this.btnSkeletal.touchable = false;
		// this.btnMuscular.touchable = false;
		// this.btnDigestive.touchable = false;
		// this.btnRespiratoryAndUrinary.touchable = false;
		// this.btnCardioVascular.touchable = false;
		// this.btnNervous.touchable = false;

		this._layerToMask.visible = true;

	}

	private disableButton(btn:Button):void{
		btn.alpha = 0.3;
	}

	private enableButton(btn:Button):void{
		btn.alpha = 1;
		btn.touchable = true;
	}

	// public get layerToMask():ClippedSprite { //TODO?
	public get layerToMask():Sprite {
		return this._layerToMask;
	}

	public set layerToMask(value:Sprite) {
		this._layerToMask = value;

		// this.maskRect = new Graphics();
		// this.maskRect.beginFill(0xFF0000);
		// // this.maskRect.drawRect(this.x + 60, this.y + 30, 387, 266); //TODO ORIG
		// this.maskRect.drawRect(this.background.x + 60, this.background.y + 30, 387, 266);
		// this.maskRect.endFill();
		// this.addChild(this.maskRect);
		// the magic line!
		this._layerToMask.mask = this.maskRect;
		// this._layerToMask.clipRect = this.maskRect; //TODO ORIG PIXI clipRect?
		this._layerToMask.visible = false;  //TODO add back?
	}

	public highlightInactive():void {
		this.inactiveOutline.visible = true;
		TweenMax.to(this.inactiveOutline, 0.5, {alpha:"-1", repeat:-1, yoyo:true, ease:Linear.easeNone});
	}

	public stopHighlightInactive():void {
		this.inactiveOutline.visible = false;  //TODO add back?
		TweenMax.killTweensOf(this.inactiveOutline);
	}

	private addMaskRect():void{
		this.maskRect = new Graphics();
		this.maskRect.beginFill(0xFF4444);
		// this.maskRect.alpha = 0.2;
		this.maskRect.drawRect(this.x + 60, this.y + 8, 387, 266);
	}

	private inactiveTouchListener = (event:TouchEvent):void => {
		Logger.log(this, "Scanner inactiveTouchListener");

		// this.touch = event.getTouch(this);
		// if(!this.touch) return;

		// if(this.touch.phase == TouchPhase.BEGAN){

			this.clickedOnce = true;

			this.inactiveImage.off(TouchEvent.TOUCH, this.inactiveTouchListener);
			this.rectCover.off(TouchEvent.TOUCH, this.inactiveTouchListener);
			this.inactiveImage.visible = false;
			this.rectCover.visible = false;

			this.stopHighlightInactive();

			this.background.visible = true;

			this.btnSkeletal.visible = true;
			this.btnMuscular.visible = true;
			this.btnDigestive.visible = true;
			this.btnRespiratoryAndUrinary.visible = true;
			this.btnCardioVascular.visible = true;
			this.btnNervous.visible = true;

			// this.on(TouchEvent.TOUCH, this.touchListener);
			this.on(TouchEvent.TOUCH, this.touchDown);
			this.on(TouchEvent.TOUCH_END, this.touchDone);
			this.on(TouchEvent.TOUCH_OUT, this.touchDone);
			this.on(TouchEvent.TOUCH_MOVE, this.touchMove);

			this._layerToMask.visible = true;

			this.addMaskRect();

		// }
	}

	private touchDown = (event:TouchEvent):void => {
		Logger.log(this, "Scanner touchDown  this.x == "+this.x+" : this.y == "+this.y);
		this.mouseDown = true;

		this.parent.setChildIndex(this, this.parent.children.length-1);
		// (this.parent as ItemsSelector).setState(ItemsSelector.CLOSED); //TODO add signal to close selector
		this.visible = true;

		let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
		Logger.log(this, "Scanner touchDown  mousePositionCanvas.x == "+mousePositionCanvas.x+" : mousePositionCanvas.y == "+mousePositionCanvas.y);
		this.offsetPoint = new Point((mousePositionCanvas.x - this.x), (mousePositionCanvas.y - this.y));
		this.x = mousePositionCanvas.x - this.offsetPoint.x;
		this.y = mousePositionCanvas.y - this.offsetPoint.y;
		this.addMaskRect();
		// this.layerToMask.clipRect = this.maskRect; //TODO PIXI clipRect? ORIG
		this.layerToMask.mask = this.maskRect; //TODO PIXI clipRect?

		// sndMan.playSound("scanner_loop", 1, 999); //TODO sound
		this.scannerSound = AudioPlayer.getInstance().playSound("scanner_loop", 999, Config.EFFECTS_VOLUME_LEVEL);
	}

	private touchMove = (event:TouchEvent):void => {
		if(this.mouseDown) {
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			this.x = mousePositionCanvas.x - this.offsetPoint.x;
			this.y = mousePositionCanvas.y - this.offsetPoint.y;
			this.addMaskRect();
			// this.layerToMask.clipRect = this.maskRect; //TODO PIXI clipRect? ORIG
			this.layerToMask.mask = this.maskRect; //TODO PIXI clipRect?
		}
	}

	private touchDone = (event:TouchEvent):void => {
		Logger.log(this, "Scanner touchDone  event.type == "+event.type);
		this.mouseDown = false;

		// sndMan.stopSound("scanner_loop"); //TODO sound
		if(this.scannerSound != null) {
			this.scannerSound.stop();
		}

		// this.layerToMask.clipRect = this.maskRect; //TODO PIXI clipRect? ORIG
		this.layerToMask.mask = this.maskRect; //TODO PIXI clipRect?

		// let hit:boolean = SpriteHelper.hitTest(this.background.getBounds(), this._hotspot.getBounds()); //TODO do we need this? not working in original
		// if(hit){
		// // if(this.bounds.intersects(this._hotspot.bounds)){ //TODO orig
        //
		// 	this._hotspot.enable();
		// 	// Logger.log(this, "Scanner over hotspot enable this._hotspot.touchable == "+this._hotspot.touchable);
		// }else{
        //
		// 	this._hotspot.disable();
		// 	// Logger.log(this, "---- Scanner outside hotspot disable this._hotspot.touchable == "+this._hotspot.touchable);
		// }
	}

// 	private touchListener = (event:TouchEvent):void => {
//
// 		// this.touch = event.getTouch(this); //TODO
// 		// if(!this.touch) return;
//         //
// 		// if(this.touch.phase == TouchPhase.BEGAN){
//         //
// 		// 	this.touchOffset = this.touch.getLocation(this);
//         //
// 		// 	this.x = this.touch.globalX - this.touchOffset.x;
// 		// 	this.y = this.touch.globalY - this.touchOffset.y;
// 		// 	this.maskRect = new Rectangle(this.x + 60, this.y + 8, 387, 266);
//         //
// 		// 	// sndMan.playSound("scanner_loop", 1, 999); //TODO sound
// 		// }
//         //
// 		// if(this.touch.phase == TouchPhase.MOVED){
//         //
// 		// 	//TODO
// 		// 	// if(this.touch.globalX - this.touchOffset.x > StarlingHelper.leftXOffsetVirtual - this.width/2 && this.touch.globalX - this.touchOffset.x < StarlingHelper.rightXOffsetVirtual - this.width/2){
// 		// 	// 	this.x = this.touch.globalX - this.touchOffset.x;
// 		// 	// }
//         //
// 		// 	//TODO
// 		// 	// if(this.touch.globalY - this.touchOffset.y >  -this.height/2 + 100 && this.touch.globalY - this.touchOffset.y < AssetLoader.STAGE_HEIGHT - this.height/2 + 100){
// 		// 	// 	this.y = this.touch.globalY - this.touchOffset.y;
// 		// 	// }
// 		// 	this.maskRect = new Rectangle(this.x + 60, this.y + 8, 387, 266);
// 		// }
//         //
// 		// if(this.touch.phase == TouchPhase.ENDED){
// 		// 	// sndMan.stopSound("scanner_loop"); //TODO sound
// 		// }
//
// 		// this.layerToMask.clipRect = this.maskRect; //TODO PIXI clipRect?
//
// // 		if(this.bounds.intersects(this._hotspot.bounds)){ //TODO
// // //			Logger.log(this, "Scanner over hotspot");
// // 			this._hotspot.enable();
// // 		}else{
// // //			Logger.log(this, "---- Scanner outside hotspot");
// // 			this._hotspot.disable();
// // 		}
// 	}

	private createScannerArt():void {
		Logger.log(this, "Scanner createScannerArt");
		this.inactiveImage = Sprite.fromFrame("operationRoom_scannerInactive");
		this.addChild(this.inactiveImage);
		this.inactiveImage.scale.x = this.inactiveImage.scale.y = 2;
		this.inactiveImage.interactive = true;
		this.inactiveImage.buttonMode = true;

		this.inactiveOutline = Sprite.fromFrame("operationRoom_scannerInactive_outline");
		this.addChild(this.inactiveOutline);
		this.inactiveOutline.scale.x = this.inactiveOutline.scale.y = 2;
		// this.inactiveOutline.touchable = false; //TODO
		this.inactiveOutline.interactive = false;
		this.inactiveOutline.visible = false; //TODO was in

		this.rectCover = new Graphics(); //TODO temp to check area
		this.rectCover.beginFill(0xFFFFFF);
		this.rectCover.alpha = HospitalGameView.RECT_COVER_ALPHA;
		this.addChild(this.rectCover);
		this.rectCover.interactive = true;
		this.rectCover.buttonMode = true;
		this.rectCover.drawRect(this.inactiveImage.x, this.inactiveImage.y, this.inactiveImage.width, this.inactiveImage.height);

		this.inactiveOutline.x = 8;

		let frames = [];
		for (let i = 1; i < 3; i++) {
			let val = i < 10 ? '0' + i : i;
			// magically works since the spritesheet was loaded with the pixi loader
			frames.push(Texture.fromFrame('operationRoom_scannerFlicker_ani_00' + val));
		}
		// create an AnimatedSprite (brings back memories from the days of Flash, right ?)
		this.noiseScreen = new extras.AnimatedSprite(frames);
		this.addChild(this.noiseScreen);
		this.noiseScreen.x = 81;
		this.noiseScreen.y = 10;
		this.noiseScreen.visible = false;
		this.noiseScreen.scale.x = this.noiseScreen.scale.y = 2;

		// noiseScreen = new MovieClip(Config.assetManager.getTextures("operationRoom_scannerFlicker_ani_"), 10); //TODO orig code
		// Starling.juggler.add(noiseScreen);
		// this.addChild(noiseScreen);
		// noiseScreen.x = 81;
		// noiseScreen.y = 10;
		// noiseScreen.visible = false;
		// noiseScreen.scaleX = noiseScreen.scaleY = 2;

		this.background = Sprite.fromFrame("operationRoom_scannerActive");
		this.addChild(this.background);
		this.background.visible = false; //TODO was in

		this.btnSkeletal = this.createAndAddButton("btnSkeletal", "operationRoom_scannerButton_skeletal", 0, 0);
		this.btnMuscular = this.createAndAddButton("btnMuscular", "operationRoom_scannerButton_muscular", 0, 130);
		this.btnDigestive = this.createAndAddButton("btnDigestive", "operationRoom_scannerButton_digestive", 0, 230);
		this.btnRespiratoryAndUrinary = this.createAndAddButton("btnRespiratoryAndUrinary", "operationRoom_scannerButton_respiratoryUrinary", this.background.width - this.btnSkeletal.width + 3, 30);
		this.btnCardioVascular = this.createAndAddButton("btnCardioVascular", "operationRoom_scannerButton_cardiovascular", this.background.width - this.btnSkeletal.width + 3, 130);
		this.btnNervous = this.createAndAddButton("btnNervous", "operationRoom_scannerButton_nervous", this.background.width - this.btnSkeletal.width + 3, 230);
	}

	private createAndAddButton(name:string, texture:string, positionX:number, positionY:number):ScannerButton {
		Logger.log(this, "Scanner createAndAddButton     name ==== "+name);
		let btn:ScannerButton = new ScannerButton();
		btn.name = name;
		btn.addTexture(Texture.fromFrame(texture));
		this.addChild(btn);
		btn.signalScannerButton.add(this.btnPressedListener);
		// btn.x = positionX; //TODO ORIG
		// btn.y = positionY;
		btn.x += btn.getTextureBounds().width * .5;
		btn.y += btn.getTextureBounds().height;
		// btn.on(ButtonEvent.CLICKED, this.btnPressedListener);
		btn.visible = false; //TODO was in
		return btn;
	}

	// private btnPressedListener = (event:ButtonEvent):void => {
	private btnPressedListener = (data:any):void => {
		let btnPressed:ScannerButton = data as ScannerButton;
		// let btnPressed:Button = event.button as Button; //TODO
		Logger.log(this, "Scanner btnPressedListener      btnPressed ==== "+btnPressed);
		Logger.log(this, "Scanner btnPressedListener      btnPressed.name ==== "+btnPressed.name);

		// if disabled
		if(btnPressed.alpha < 1) {
// 			if(!sndMan.soundIsPlaying(Config.currentSpeakSound)){ //TODO sound
// //					sndMan.tweenVolume("operation_room_music_loop", 0.3, 0.5);
// 				Config.currentSpeakSound = "mille_hov_den_er_last";
// 				sndMan.playSound(Config.currentSpeakSound, Config.SPEAK_VOLUME_LEVEL);
// 			}

			if(Config.currentSpeakSound != "mille_hov_den_er_last") {
				if(Config.currentSpeakSound != null) {
					AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
				}
				Config.currentSpeakSound = "mille_hov_den_er_last";
				this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
			}

			return;
		}

		this.playNoiseClip();
		switch(btnPressed.name) {
			case "btnSkeletal":
				this.state = Scanner.SKELETAL;

				setTimeout(():void => {
					if(Config.currentSpeakSound != null) {
						AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
					}
					Config.currentSpeakSound = "mille_aargh_et_skelet";
					this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
				}, 1000);
				break;
			case "btnMuscular":
				this.state = Scanner.MUSCULAR;
				setTimeout(():void => {
					if(Config.currentSpeakSound != null) {
						AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
					}
					Config.currentSpeakSound = "mille_sikke_et_muskel_bundt";
					this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);

				}, 1000);
				break;
			case "btnCardioVascular":
				this.state = Scanner.CARDIOVASCULAR;
				setTimeout(():void => {
					if(Config.currentSpeakSound != null) {
						AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
					}
					Config.currentSpeakSound = "mille_noj_der_er_blodbaner_blodet_lober_frem";
					this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
				}, 1000);
				break;
			case "btnDigestive":
				this.state = Scanner.DIGESTIVE;
				setTimeout(():void => {
					if(Config.currentSpeakSound != null) {
						AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
					}
					Config.currentSpeakSound = "mille_vildt_er_det_tarmene";
					this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
				}, 1000);
				break;
			case "btnRespiratoryAndUrinary":
				this.state = Scanner.RESPIRATORY_AND_UNINARY;
				setTimeout(():void => {
					if(Config.currentSpeakSound != null) {
						AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
					}
					Config.currentSpeakSound = "mille_der_er_tis_inde_i_de_to_lange_ror";
					this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
				}, 1000);
				break;
			case "btnNervous":
				this.state = Scanner.NERVOUS;
				setTimeout(():void => {
					if(Config.currentSpeakSound != null) {
						AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
					}
					Config.currentSpeakSound = "mille_wow_der_er_hjernen";
					this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
				}, 1000);
				break;
			default:
				break;
		}
		this.emit("change"); //TODO check this in starling
	}

	private playNoiseClip():void {
		this.noiseScreen.visible = true;
		this.noiseClip = AudioPlayer.getInstance().playSound("scanner_noise", 0, Config.EFFECTS_VOLUME_LEVEL);
		this.noiseClip.on(AudioPlayer.AUDIO_COMPLETE, this.audioNoiseComplete);
	}

	private audioNoiseComplete = (event:Event):void => {
		this.noiseScreen.visible = false;
		this.noiseClip.off(AudioPlayer.AUDIO_COMPLETE, this.audioNoiseComplete);
	}

	public destroy():void{
		Logger.log(this, "Scanner destroy");
		if(this.inactiveImage != null) {
			this.inactiveImage.off(TouchEvent.TOUCH, this.inactiveTouchListener);
			this.inactiveImage = null;
		}
		if(this.rectCover != null) {
			this.rectCover.off(TouchEvent.TOUCH, this.inactiveTouchListener);
			this.rectCover = null;
		}

		if(this.noiseScreen != null){
			this.removeChild(this.noiseScreen);
			this.noiseScreen = null;
		}

		this.removeChildren(0, this.children.length-1);
		// this.removeChild(this.noiseScreen); //TODO does above work
		// this.removeChild(this.maskRect);
		// this.removeChild(this.inactiveImage);
		// this.removeChild(this.inactiveOutline);
		// this.removeChild(this.background);

		this.off(TouchEvent.TOUCH, this.touchDown);
		this.off(TouchEvent.TOUCH_END, this.touchDone);
		this.off(TouchEvent.TOUCH_OUT, this.touchDone);
		this.off(TouchEvent.TOUCH_MOVE, this.touchMove);
	}

}
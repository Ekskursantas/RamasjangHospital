
import {HospitalGameView} from "../HospitalGameView";
import {PortaitOfMille} from "./objects/PortaitOfMille";
import {Button} from "../../../loudmotion/ui/Button";
import {ConfettiMaker} from "../objects/ConfettiMaker";
import {TrophyDisplay} from "./objects/TrophyDisplay";
import {UnlockedScreen} from "../objects/UnlockedScreen";
import {ItemsSelector} from "../objects/ItemsSelector";
import {Patient} from "../objects/Patient";
import {PatientSlot} from "./objects/PatientSlot";
import {TouchEvent} from "../../../loudmotion/events/TouchLoudEvent";
import {TouchPhase} from "../../../loudmotion/events/TouchLoudPhase";
import {Touch} from "../../../loudmotion/events/TouchLoud";
import {Door} from "./objects/Door";
import {Config} from "../../Config";
import {AssetLoader} from "../../utils/AssetLoader";
import {HospitalEvent} from "../../event/HospitalEvent";
import {ButtonEvent} from "../../event/ButtonEvent";
import {Point, Sprite, Graphics, extras, Texture} from "pixi.js";
import {Logger} from "../../../loudmotion/utils/debug/Logger";
import {ClothesItem} from "./objects/ClothesItem";
import {AudioPlayer} from "../../../loudmotion/utils/AudioPlayer";
import AbstractSoundInstance = createjs.AbstractSoundInstance;

export class WaitingRoomView extends HospitalGameView {
	private background:Sprite;
	private toyTrain:extras.AnimatedSprite;
	private foreground:Sprite;
	private door:Door;

	private patientSlot_1:PatientSlot;
	private patientSlot_2:PatientSlot;
	private patientSlot_3:PatientSlot;

	private patient_1:Patient;
	private patient_2:Patient;
	private patient_3:Patient;
	private patientTarget:Sprite;
	private touchPatientSlot:Touch;

	private clothesSelector:ItemsSelector;

	// private helpSpeakTimer:Timer; //TODO add timer
	private helpSpeakTimer:number; //TODO add timer
	private helpSpeakCounter:number;

	private unlockedScreen:UnlockedScreen;

	private trophyDisplay:TrophyDisplay;

	private konfettiMaker:ConfettiMaker;
	private touch:Touch;

	private bagHasBeenPressed:boolean;

	private helpingHand:Sprite;
	private helpingOutline:Sprite;

	private portraitOfMille:PortaitOfMille;
	private killTouchesLayer:Graphics;

	private sndHelpSpeak: Howl;
    private soundTrain: Howl;

	constructor () {
		super();
	}

	public init():void{
		this.name = "WaitingRoomView";
		this.helpSpeakCounter = 2;
		this.helpSpeakTimer = setTimeout(this.helpSpeakTimerComplete, 5000);
		Config.currentTimeout = setTimeout(this.startHelpSpeak, 1000);
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.drawScene();

		if(Config.currentSpeakOverlappingViewsSound != null) {
			AudioPlayer.getInstance().stopSound(Config.currentSpeakOverlappingViewsSound);
		}
		if(Config.currentSpeakSound != null) {
			AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
		}
	}

	private startHelpSpeak = ():void => {
		if(Config.gameState == Config.IDLE) {
			if(Config.currentSpeakSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
			}
			Config.currentSpeakSound = "mille_der_er_nogle_born_der_er_blevet_syge";
			this.sndHelpSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
			this.sndHelpSpeak.on(AudioPlayer.AUDIO_COMPLETE, this.audioHelpSpeakComplete);
		}
	}

	private audioHelpSpeakComplete = (event:Event):void => {
		this.sndHelpSpeak.off(AudioPlayer.AUDIO_COMPLETE, this.audioHelpSpeakComplete);
	}

	private showHelpAnimation():void {
		Logger.log(this, "WaitingRoomView showHelpAnimation");
		if(this.helpingHand != null) {
			this.helpingHand.x = this.patientSlot_2.x + 100;
			this.helpingHand.y = this.patientSlot_2.y + 200;
		}
		if(this.helpingHand != null) {
			this.helpingOutline.x = this.patientSlot_2.x;
			this.helpingOutline.y = this.patientSlot_2.y;
		}

		TweenLite.to(this.helpingHand, 2, {x:"+=280", delay:1, onComplete:():void => {
			if(this.helpingHand != null) {
				this.removeChild(this.helpingHand);
			}
			if(this.helpingHand != null) {
				this.removeChild(this.helpingOutline);
			}
			if(this.door != null) {
				this.door.showOpened();
            }
            Config.currentTimeout = setTimeout(this.onHelpAnimationCompleted, 2000);
		}});

		Config.currentTimeout = setTimeout(():void => {
			TweenLite.to(this.helpingOutline, 2, {x:"+=280"});
		}, 1000);
	}

	private onHelpAnimationCompleted = ():void => {
		if(this.door != null) {
			this.door.showClosed();
		}
		if(this.killTouchesLayer != null){
			this.killTouchesLayer.visible = false;
			this.killTouchesLayer.off(ButtonEvent.CLICKED, this.killPressed);
		}
		if(this.clothesSelector != null){
			this.clothesSelector.highlight();
		}
	}

	// private helpSpeakTimerComplete(event:TimerEvent):void
	private helpSpeakTimerComplete = (event:Event):void => {
		if(Config.gameState == Config.IDLE){
			if(this.helpSpeakCounter == 2){
				this.showHelpAnimation();
			}
		}else if(Config.gameState == Config.POST_TREATMENT){
		}
		this.helpSpeakCounter++;
	}

	private checkIfAnyClothesWasAdded():boolean {
		let toReturn:boolean;
		if (this.patient_1 && this.patient_1.clothesAdded) {
			toReturn = true;
		}
		if (this.patient_2 && this.patient_2.clothesAdded) {
			toReturn = true;
		}
		if (this.patient_3 && this.patient_3.clothesAdded) {
			toReturn = true;
		}
		return toReturn;
	}

	private drawScene():void{
		Config.patientSlot_1_x = Config.safeFrame.x;
		Config.patientSlot_2_x = Config.safeFrame.x + 200;
		Config.patientSlot_3_x = Config.safeFrame.x + Config.safeFrame.width - 280;

		this.background = Sprite.fromFrame("waitingRoom_background");
		this.addChild(this.background);

		// Door
		this.door = new Door();
		this.addChild(this.door);
		this.door.x = 684;
		this.door.y = 95;

		// Portrait
		this.portraitOfMille = new PortaitOfMille();
		this.addChild(this.portraitOfMille);
		this.portraitOfMille.x = 450;
		this.portraitOfMille.y = 50;

		// 3 patient slots
		this.patientSlot_1 = new PatientSlot();
		this.patientSlot_1.x = Config.patientSlot_1_x; //Config.safeFrame.x;
		this.patientSlot_1.y = Config.patientSlot_1_y;
		this.addChild(this.patientSlot_1);

		this.patientSlot_2 = new PatientSlot();
		this.patientSlot_2.x = Config.patientSlot_2_x; //this.patientSlot_1.x + 200;
		this.patientSlot_2.y = Config.patientSlot_2_y;
		this.addChild(this.patientSlot_2);

		this.patientSlot_3 = new PatientSlot();
		this.patientSlot_3.x = Config.patientSlot_3_x; //Config.safeFrame.x + Config.safeFrame.width - 280;
		this.patientSlot_3.y = Config.patientSlot_3_y;
		this.addChild(this.patientSlot_3);

		// 3 patients
		this.patientTarget = new Sprite();
		this.addChild(this.patientTarget);

		if(Config.patientWaitingInSlot_1){
			this.patient_1 = Patient.clone(Config.patientWaitingInSlot_1);
			this.patient_1.setClothes(this.patient_1.currentBottomClothesTexture, ClothesItem.BOTTOM); //  this.setClothes(originalPatient.currentBottomClothesTexture, ClothesItem.BOTTOM);
			this.patient_1.setClothes(this.patient_1.currentTopClothesTexture, ClothesItem.TOP); //  this.setClothes(originalPatient.currentBottomClothesTexture, ClothesItem.BOTTOM);
			this.patient_1.state = Patient.WAITING;
			this.patient_1.on(HospitalEvent.PATIENT_DROPPED, this.onPatientDropped);
			this.patientTarget.addChild(this.patient_1);
			this.patient_1.target = this.door;
			Config.patientWaitingInSlot_1 = this.patient_1;

			// scale patient down
			this.patient_1.scalePatient(Patient.SIZE_SMALL);
			this.addPatient(this.patient_1, new Point(this.patientSlot_1.x, this.patientSlot_1.y));
			this.patient_1.startIdleEyeMOvement();
		}else{
			this.spawnNewPatient(this.patientSlot_1);
		}

		if(Config.patientWaitingInSlot_2){
			this.patient_2 = Patient.clone(Config.patientWaitingInSlot_2);
			this.patient_2.setClothes(this.patient_2.currentBottomClothesTexture, ClothesItem.BOTTOM);
			this.patient_2.setClothes(this.patient_2.currentTopClothesTexture, ClothesItem.TOP);
			this.patient_2.state = Patient.WAITING;
			this.patient_2.on(HospitalEvent.PATIENT_DROPPED, this.onPatientDropped);
			this.patientTarget.addChild(this.patient_2);
			this.patient_2.target = this.door;
			Config.patientWaitingInSlot_2 = this.patient_2;

			// scale patient down
			this.patient_2.scalePatient(Patient.SIZE_SMALL);
			this.addPatient(this.patient_2, new Point(this.patientSlot_2.x, this.patientSlot_2.y));
			this.patient_2.startIdleEyeMOvement();
		}else{
			this.spawnNewPatient(this.patientSlot_2);
		}

		if(Config.patientWaitingInSlot_3){
			this.patient_3 = Patient.clone(Config.patientWaitingInSlot_3);
			this.patient_3.setClothes(this.patient_3.currentBottomClothesTexture, ClothesItem.BOTTOM);
			this.patient_3.setClothes(this.patient_3.currentTopClothesTexture, ClothesItem.TOP);
			this.patient_3.state = Patient.WAITING;
			this.patient_3.on(HospitalEvent.PATIENT_DROPPED, this.onPatientDropped);
			this.patientTarget.addChild(this.patient_3);
			this.patient_3.target = this.door;
			Config.patientWaitingInSlot_3 = this.patient_3;

			// scale patient down
			this.patient_3.scalePatient(Patient.SIZE_SMALL);
			this.addPatient(this.patient_3, new Point(this.patientSlot_3.x, this.patientSlot_3.y));
			this.patient_3.startIdleEyeMOvement();
		}else{
			this.spawnNewPatient(this.patientSlot_3);
		}

		this.foreground = Sprite.fromFrame("waitingRoom_forground");
		this.addChild(this.foreground);
		this.foreground.scale.x = this.foreground.scale.y = 2;
		this.foreground.y = AssetLoader.STAGE_HEIGHT - this.foreground.height;

		let frames = [];
		for (let i = 0; i < 20; i++) {
			let val = i < 10 ? '0' + i : i;
			let frame:string = 'waitingRoom_train_ani_00' + val;
			let texture:Texture = Texture.fromFrame(frame);
			frames.push(texture);
		}
		this.toyTrain = new extras.AnimatedSprite(frames);
		this.toyTrain.interactive = true;
		this.addChild(this.toyTrain);
		this.toyTrain.scale.x = this.toyTrain.scale.y = 2;
		this.toyTrain.x = 155;
		this.toyTrain.y = AssetLoader.STAGE_HEIGHT - this.toyTrain.height;
		this.toyTrain.on(TouchEvent.TOUCH, this.trainTouchListener);
		this.toyTrain.animationSpeed = 0.2;
		this.toyTrain.play();

		this.helpingHand  = Sprite.fromFrame("operationRoom_scannerHotspot");
		this.helpingOutline = Sprite.fromFrame("kid_outline");
		this.addChild(this.helpingHand);
		this.helpingHand.y = AssetLoader.STAGE_HEIGHT;
		this.addChild(this.helpingOutline);
		this.helpingOutline.y = AssetLoader.STAGE_HEIGHT;

		// Only show unlocked screen if something has been unlocked
		if(Config.gameState == Config.POST_TREATMENT && this.checkIfCurrentLevelHasUnlocks()){
			this.showUnlockedScreen();
		}else if(Config.getUnlockedClothes().length > 0){
			this.clothesSelector = new ItemsSelector(ItemsSelector.CLOTHES);
            this.clothesSelector.x = 0 - Math.abs(Math.floor(AssetLoader.getInstance().ratioX / 2)); //AssetLoader.STAGE_WIDTH/2;
            this.clothesSelector.y = 0 - Math.abs(Math.floor(AssetLoader.getInstance().ratioY / 2)); //630;
			this.addChild(this.clothesSelector);

			this.clothesSelector.on(ItemsSelector.OPENED, (event:Event):void => {
				this.trophyDisplay.visible = false;
				this.trophyDisplay.close();
			});
			this.clothesSelector.on(ItemsSelector.HAS_CLOSED, (event:Event):void => {
				this.trophyDisplay.visible = true;
			});
		}

		this.trophyDisplay = new TrophyDisplay();
		this.addChild(this.trophyDisplay);
        this.trophyDisplay.x = 100 + Math.abs(Math.floor(AssetLoader.getInstance().ratioX / 2));;
        this.trophyDisplay.y = AssetLoader.STAGE_HEIGHT - 200 + Math.abs(Math.floor(AssetLoader.getInstance().ratioY / 2));;

		this.trophyDisplay.on(TrophyDisplay.OPENED, (event:Event):void => {
			if(this.clothesSelector) {
				this.clothesSelector.setState(ItemsSelector.CLOSED);
			}
		});

		if(Config.gameState == Config.IDLE){
			this.killTouchesLayer = new Graphics();
			this.killTouchesLayer.interactive = true;
			this.killTouchesLayer.beginFill(0x000000);
			this.killTouchesLayer.drawRect(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
			this.killTouchesLayer.alpha = 0.01;
			this.addChild(this.killTouchesLayer);
			this.killTouchesLayer.on(ButtonEvent.CLICKED, this.killPressed);
		}

		
	}

	private killPressed = (event:TouchEvent):void => {
		Logger.log(this, "WaitingRoomView killPressed");
	}

	private trainTouchListener = (event:TouchEvent):void => {
		if(this.soundTrain != null) {
			AudioPlayer.getInstance().stopSound("train_flute");
		}
		this.soundTrain = AudioPlayer.getInstance().playSound("train_flute", 0, Config.EFFECTS_VOLUME_LEVEL);
		this.soundTrain.on(AudioPlayer.AUDIO_COMPLETE, this.soundTrainComplete);
	}

	private soundTrainComplete = (event:TouchEvent):void => {
		this.soundTrain.off(AudioPlayer.AUDIO_COMPLETE, this.soundTrainComplete);
		this.soundTrain = null;
	}

	private checkIfCurrentLevelHasUnlocks():boolean {
		let index:number = Config.patientsCured < Config.levels.length ? Config.patientsCured : Config.levels.length - 1;
		if(Config.levels[index].unlockedTools.length > 0){
			return true;
		}
		if(Config.levels[index].unlockedClothes.length > 0){
			return true;
		}
		if(Config.levels[index].unlockedBandage.length > 0){
			return true;
		}
		if(Config.levels[index].unlockedBandAid.length > 0){
			return true;
		}
		if(Config.levels[index].unlockedLemonade.length > 0){
			return true;
		}
		return false;
	}

	private showUnlockedScreen():void {
		this.clothesSelector = new ItemsSelector(ItemsSelector.CLOTHES);
		this.clothesSelector.x = 0; //AssetLoader.STAGE_WIDTH/2;
		this.clothesSelector.y = 0; //630;
		this.addChild(this.clothesSelector);

		this.clothesSelector.on(ItemsSelector.OPENED, (event:Event):void => {
			this.trophyDisplay.visible = false;
			this.trophyDisplay.close();
		});
		this.clothesSelector.on(ItemsSelector.HAS_CLOSED, (event:Event):void => {
			this.trophyDisplay.visible = true;
		});

		this.unlockedScreen = new UnlockedScreen(this.clothesSelector.bagClosedPos, ItemsSelector.CLOTHES);
		this.addChild(this.unlockedScreen);

		// Touch unlock screen opens gift, that flies to bag
		this.unlockedScreen.on(UnlockedScreen.WRAPPED_GIFT_PRESSED, (event:HospitalEvent):void => {
			this.startKonfetti();
			this.clothesSelector.setState(ItemsSelector.OPEN_BAG_ONLY);
			Config.currentTimeout = setTimeout(():void => {
				this.clothesSelector.setState(ItemsSelector.CLOSED);
				this.clothesSelector.highlight();
				this.unlockedScreen.visible = false;
				if(this.clothesSelector && !this.clothesSelector.hasBeenClicked && Config.patientsCured % 4 == 1){
					if(Config.currentSpeakSound != null) {
						AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
					}
					Config.currentSpeakSound = "mille_orh_sikke_noget_flot_toj";
					//this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
					//this.sndSpeak.on(AudioPlayer.AUDIO_COMPLETE, this.audioBagSpeakComplete);
				}

			}, 2000);
			this.clothesSelector.visible = true;
		});
	}

	private audioBagSpeakComplete = (event:Event):void => {
		Config.currentTimeout = setTimeout(function():void{
			if(Config.currentSpeakSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
			}
			Config.currentSpeakSound = "mille_prov_at_give_bonene_noget_nyt_toj_pa";
			this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
		}, 1000);
	}


	private startKonfetti = ():void => {
		this.konfettiMaker = new ConfettiMaker();
		this.addChild(this.konfettiMaker);
		this.stopKonfetti();
	}

	private stopKonfetti():void {
		TweenLite.to(this.konfettiMaker, 1, {alpha:0, delay:4, onComplete:():void => {
			this.removeChild(this.konfettiMaker);
		}});
	}

	private spawnNewPatient(slot:PatientSlot):void {
		switch(slot) {
			case this.patientSlot_1:
				this.patient_1 = this.createAndAddPatient(new Point(this.patientSlot_1.x, this.patientSlot_1.y));
				Config.patientWaitingInSlot_1 = this.patient_1;
				break;

			case this.patientSlot_2:
				this.patient_2 = this.createAndAddPatient(new Point(this.patientSlot_2.x, this.patientSlot_2.y));
				Config.patientWaitingInSlot_2 = this.patient_2;
				break;

			case this.patientSlot_3:
				this.patient_3 = this.createAndAddPatient(new Point(this.patientSlot_3.x, this.patientSlot_3.y));
				Config.patientWaitingInSlot_3 = this.patient_3;
				break;
			default:
				break;
		}
	}

	private addPatient(patient:Patient, slot:Point):void{
		patient.setPivotXY(.5);
		patient.startingPoint.x = slot.x + patient.width * .25;
		patient.startingPoint.y = slot.y + patient.height * .25;
		patient.x = patient.startingPoint.x;
		patient.y = patient.startingPoint.y;
		patient.state = Patient.WAITING;
	}

	private createAndAddPatient(slot:Point):Patient{
		let patient:Patient = new Patient(this.findNewRandomType(), slot);
		this.patientTarget.addChild(patient);
		this.addPatient(patient, slot);

		patient.on(HospitalEvent.PATIENT_DROPPED, this.onPatientDropped);
		patient.target = this.door;
		patient.disease = this.findRandomDisease();

		// scale patient down
		patient.scalePatient(Patient.SIZE_SMALL);
		patient.startIdleEyeMOvement();
		return patient;
	}

	private findRandomDisease():string {
		let resultDisease:string = "";
		let unlockedDiseases:any = Config.getUnlockedDiseases();

		if(unlockedDiseases.length < 3){
			resultDisease = "";
		}else {

			while (resultDisease == "") {
				let tryDisease: string = unlockedDiseases[Math.floor(Math.random() * unlockedDiseases.length)];
				if (Config.patientWaitingInSlot_1 && Config.patientWaitingInSlot_1.disease == tryDisease) continue;
				if (Config.patientWaitingInSlot_2 && Config.patientWaitingInSlot_2.disease == tryDisease) continue;
				if (Config.patientWaitingInSlot_3 && Config.patientWaitingInSlot_3.disease == tryDisease) continue;
				resultDisease = tryDisease;
			}
		}
		return resultDisease;
	}

	private findNewRandomType():number{
		let resultNumber:number = 0;
		while(resultNumber == 0){
			let tryNumber:number = Math.ceil(Math.random() * Patient.NUM_OF_TYPES);
			if(Config.patientWaitingInSlot_1 && Config.patientWaitingInSlot_1.type == tryNumber) continue;
			if(Config.patientWaitingInSlot_2 && Config.patientWaitingInSlot_2.type == tryNumber) continue;
			if(Config.patientWaitingInSlot_3 && Config.patientWaitingInSlot_3.type == tryNumber) continue;
			resultNumber = tryNumber;
		}
		return resultNumber;
	}

	private onPatientDropped = (event:HospitalEvent, ...args:any[]):void => {
		Config.currentPatient = args[0] as Patient;
		this.emit(HospitalEvent.PATIENT_SELECTED);
	}

	public destroy():void {
		clearTimeout(this.helpSpeakTimer);

		if(this.soundTrain != null) {
			this.soundTrain.off(AudioPlayer.AUDIO_COMPLETE, this.soundTrainComplete);
		}
		if(this.patient_1 != null) {
			this.patient_1.off(HospitalEvent.PATIENT_DROPPED, this.onPatientDropped);
		}
		if(this.patient_2 != null) {
			this.patient_2.off(HospitalEvent.PATIENT_DROPPED, this.onPatientDropped);
		}
		if(this.patient_3 != null) {
			this.patient_3.off(HospitalEvent.PATIENT_DROPPED, this.onPatientDropped);
		}

		if(this.btnBack != null){
			this.btnBack.destroy();
			this.btnBack = null;
		}

		if(this.background != null){
			this.removeChild(this.background);
			this.background = null;
		}

		if(this.door != null){
			this.removeChild(this.door);
			this.door.destroy();
			this.door = null;
		}

		if(this.portraitOfMille != null){
			this.removeChild(this.portraitOfMille);
			this.portraitOfMille.destroy();
			this.portraitOfMille = null;
		}

		if(this.patientSlot_1 != null){
			this.removeChild(this.patientSlot_1);
			this.patientSlot_1.destroy();
			this.patientSlot_1 = null;
		}

		if(this.patientSlot_2 != null){
			this.removeChild(this.patientSlot_2);
			this.patientSlot_2.destroy();
			this.patientSlot_2 = null;
		}

		if(this.patientSlot_3 != null){
			this.removeChild(this.patientSlot_3);
			this.patientSlot_3.destroy();
			this.patientSlot_3 = null;
		}

		if(this.patientTarget != null){
			this.removeChild(this.patientTarget);
			this.patientTarget = null;
		}

		if(this.foreground != null){
			this.removeChild(this.foreground);
			this.foreground = null;
		}

		if(this.helpingHand != null){
			this.removeChild(this.helpingHand);
			this.helpingHand = null;
		}

		if(this.helpingOutline != null){
			this.removeChild(this.helpingOutline);
			this.helpingOutline = null;
		}

		if(this.killTouchesLayer != null){
			this.removeChild(this.killTouchesLayer);
			this.killTouchesLayer.off(ButtonEvent.CLICKED, this.killPressed);
			this.killTouchesLayer = null;
		}

		if(this.konfettiMaker != null){
			this.removeChild(this.konfettiMaker);
			this.konfettiMaker.destroy();
			this.konfettiMaker = null;
		}

		if(this.toyTrain != null) {
			this.toyTrain.off(TouchEvent.TOUCH, this.trainTouchListener);
			this.removeChild(this.toyTrain);
			this.toyTrain = null;
		}

		if(this.clothesSelector != null){
			this.clothesSelector.off(ItemsSelector.OPENED);
			this.clothesSelector.off(ItemsSelector.HAS_CLOSED);
			this.removeChild(this.clothesSelector);
			this.clothesSelector.destroy();
			this.clothesSelector = null;
		}

		if(this.konfettiMaker != null){
			this.removeChild(this.konfettiMaker);
			this.konfettiMaker.destroy();
			this.konfettiMaker = null;
		}

		if(this.trophyDisplay != null){
			this.removeChild(this.trophyDisplay);
			this.trophyDisplay.off(TrophyDisplay.OPENED);
			this.trophyDisplay.destroy();
			this.trophyDisplay = null;
		}

		if(this.unlockedScreen != null) {
			this.unlockedScreen.off(UnlockedScreen.WRAPPED_GIFT_PRESSED);
			this.removeChild(this.unlockedScreen);
			this.unlockedScreen.destroy();
			this.unlockedScreen = null;
		}


		if(Config.currentSpeakSound != null) {
			AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
		}

		super.destroy();
	}
}
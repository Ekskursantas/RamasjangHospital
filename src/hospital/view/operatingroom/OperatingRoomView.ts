
import {HospitalGameView} from "../HospitalGameView";
import {Patient} from "../objects/Patient";
import {Scanner} from "./objects/Scanner";
import {ItemsSelector} from "../objects/ItemsSelector";
import {MaskedLayer} from "./objects/MaskedLayer";
import {Button} from "../../../loudmotion/ui/Button";
import {UnlockedScreen} from "../objects/UnlockedScreen";
import {ConfettiMaker} from "../objects/ConfettiMaker";
import {HospitalEvent} from "../../event/HospitalEvent";
import {Config} from "../../Config";
import {AssetLoader} from "../../utils/AssetLoader";
import {ButtonEvent} from "../../event/ButtonEvent";
import {Level} from "../../vo/Level";
import {TouchEvent} from "../../../loudmotion/events/TouchLoudEvent";
import {TouchPhase} from "../../../loudmotion/events/TouchLoudPhase";
import {Touch} from "../../../loudmotion/events/TouchLoud";
import {HotSpot} from "../objects/HotSpot";
import {Point, Sprite, Container, Texture} from "pixi.js";
import {BackBtn} from "../buttons/BackBtn";
import {Logger} from "../../../loudmotion/utils/debug/Logger";
import {SpriteHelper} from "../../../loudmotion/utils/SpriteHelper";
import {MainView} from "../MainView";
import {AudioPlayer} from "../../../loudmotion/utils/AudioPlayer";

export class OperatingRoomView extends HospitalGameView {
	public static DRAGGABLE_OBJECT_POSITION:Point = new Point(970, 190);
	// private GIFT_DESTINATON:Point = new Point(1060, 585); //TODO
	// private GIFT_DESTINATON:Point = new Point(1360, 668);
	private DRAGGABLE_OBJECT_TOUCH_OFFSET:Number = -200;

	// private sndMan:SoundManager;
	private currentSpeakSound:string;

	private background:Sprite;
	private patient:Patient;

	private scanner:Scanner;

	private unlockedItemsSelector:ItemsSelector;

	private maskedLayer:MaskedLayer;

	public btnBack:BackBtn;
	public btnToWaitingRoom:BackBtn;

	// Bandage, plaster, or water glass
	private draggableObject:Sprite;
	private draggableObjectTarget:Sprite;

	private unlockedScreen:UnlockedScreen;
	private konfettiMaker:ConfettiMaker;
	private touch:Touch;
	private waitingRoomSpeakTimeout:number;

	private stage:Container;
	private hotSpot:HotSpot;

	constructor () {
		super();
	}

	public init():void {
		// sndMan = SoundManager.getInstance(); //TODO sound

		// this.addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
		this.onAddedToStage();
        this.name = "OperatingRoomView";
		// TESTING ONLY
//			Config.patientsCured = 6;
//			Config.gameState = Config.POST_TREATMENT
	}

	private onAddedToStage():void {
		//this.stage = AssetLoader.getInstance().stage;
		// this.removeEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
		this.drawScene();
		this.startGame();
	}

	private drawScene():void {
		Logger.log(this, "OperatingRoomView.drawScene()");
		Logger.log(this, "Config.gameState: " + Config.gameState);

		// Background
		this.background = Sprite.fromFrame("operationRoom_bg");
		this.addChild(this.background);
//			background.scaleX = background.scaleY = 2;			

		// Patient
		this.patient = Config.currentPatient;
		Logger.log(this, "OperatingRoomView this.patient=== " + this.patient);
		this.addChild(this.patient);
		this.patient.startIdleEyeMOvement();

		this.patient.setPivotXY(0);

// scale patient back to big
		this.patient.scalePatient(Patient.SIZE_BIG);

		// patient.startingPoint.x = slot.x + patient.width * .25;
		// patient.startingPoint.y = slot.y + patient.height * .25;

		this.patient.startingPoint.x = 300;
		this.patient.startingPoint.y = -30;

		this.patient.x = this.patient.startingPoint.x;
		this.patient.y = this.patient.startingPoint.y;

		// this.patient.x = 500; //Config.patientSlot_2_x; //300;
		// this.patient.y = 300; // Config.patientSlot_2_y; //-30

		Logger.log(this, "OperatingRoomView this.patient.disease === " + this.patient.disease);
		Logger.log(this, "OperatingRoomView this.patient.x === " + this.patient.x+" : this.patient.y == "+this.patient.y);
		Logger.log(this, "OperatingRoomView Config.gameState === " + Config.gameState);



		this.btnBack = new BackBtn(this, HospitalEvent.BACK_FROM_OPERATING_ROOM);

		// Remove hotspot (from patient skin)
		// if(getQualifiedClassName(this.patient.getChildAt(patient.children.length - 1)) == "appdrhospital.view.objects::HotSpot"){ //TODO
		// 	this.patient.removeChildAt(this.patient.children.length - 1);
		// }
		Logger.log(this, "OperatingRoomView this.hotSpot === " + this.hotSpot);
		if(this.hotSpot != null) {
			this.patient.removeChild(this.hotSpot);
			this.hotSpot = null;
		}

		// Remove any old masked layer
		// if(getQualifiedClassName(patient.getChildAt(this.patient.children.length - 1)) == "appdrhospital.view.operatingroom.objects::MaskedLayer"){ //TODO
		// 	this.patient.removeChildAt(this.patient.children.length - 1);
		// }
		Logger.log(this, "OperatingRoomView this.maskedLayer === " + this.maskedLayer);
		if(this.maskedLayer != null) {
			this.patient.removeChild(this.maskedLayer);
			this.maskedLayer.destroy();
			this.maskedLayer = null;
		}

		if(Config.gameState == Config.POST_TREATMENT){
			this.patient.setFacialExpression(Patient.EXPRESSION_BIG_SMILE);
			this.btnToWaitingRoom = new BackBtn(this, HospitalEvent.BACK_FROM_OPERATING_ROOM, "operationRoom_tilbagepil", true);

		}else if(Config.gameState == Config.BETWEEN_TREATMENTS){
			this.patient.setFacialExpression(Patient.EXPRESSION_LITTLE_SMILE);
			if(this.patient.disease == Level.POISONING){
				// show glass target
				this.draggableObjectTarget = Sprite.fromFrame("forgiftning_glas");
				this.addChild(this.draggableObjectTarget);
				this.draggableObjectTarget.x = 560;
				this.draggableObjectTarget.y = 330;
				this.draggableObjectTarget.alpha = 0.3;

				// show glass
				this.draggableObject = Sprite.fromFrame("forgiftning_glas");
				this.addChild(this.draggableObject);
				this.draggableObject.x = OperatingRoomView.DRAGGABLE_OBJECT_POSITION.x;
				this.draggableObject.y = OperatingRoomView.DRAGGABLE_OBJECT_POSITION.y;

				// this.draggableObject.on(TouchEvent.TOUCH, this.draggableObjectTouchListener);
				this.draggableObject.on(TouchEvent.TOUCH, this.touchDown);
				this.draggableObject.on(TouchEvent.TOUCH_END, this.touchDone);
				this.draggableObject.on(TouchEvent.TOUCH_MOVE, this.touchMove);

				// Glass speak
				Config.currentTimeout = setTimeout(():void => { //TODO sound
// 					if(sndMan.soundIsPlaying(Config.currentSpeakSound)){
// 						sndMan.stopSound(Config.currentSpeakSound);
// 					}
//
// //						sndMan.tweenVolume("operation_room_music_loop", 0.3, 0.5);
// 					Config.currentSpeakSound = "mille_flyt_glasset_hen_til_munden";
// 					sndMan.playSound(Config.currentSpeakSound, Config.SPEAK_VOLUME_LEVEL);
// 					sndMan.getSoundChannel(Config.currentSpeakSound).addEventListener("soundComplete", speakComplete)

					if(Config.currentSpeakSound != null) {
						AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
					}
					Config.currentSpeakSound = "mille_flyt_glasset_hen_til_munden";
					this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
					this.sndSpeak.on(AudioPlayer.AUDIO_COMPLETE, this.speakComplete);
				}, 1000);
			}

			if(this.patient.disease == Level.BURN){
				this.addDiseaseHotspotAndHighlightScannerButton();
			}

		}else if(Config.gameState == Config.EXAMINING ){
			// If disease is superficial, don's show scanner
			if(this.patient.disease != Level.INSECT_BITE && this.patient.disease != Level.BURN){

				this.maskedLayer = new MaskedLayer();
				this.patient.addChild(this.maskedLayer);

				// Scanner
				this.scanner = new Scanner();
				this.addChild(this.scanner);
				this.scanner.x = Config.safeFrame.x + Config.safeFrame.width - 342;
				this.scanner.highlightInactive();
			}

			this.addDiseaseHotspotAndHighlightScannerButton();

			// Remove  disease speak
			this.audioDiseaseSpeakComplete(null);
		}
	}

	private addDiseaseHotspotAndHighlightScannerButton():void {
		Logger.log(this, "OperatingRoomView addDiseaseHotspotAndHighlightScannerButton");
		Logger.log(this, "OperatingRoomView addDiseaseHotspotAndHighlightScannerButton     this.patient.disease  === "+this.patient.disease);

		this.hotSpot = new HotSpot();
		this.hotSpot.enable();
		this.hotSpot.on(HospitalEvent.DISEASE_HOTSPOT_PRESSED, this.onDiseaseHotspotPressed);
// 107 is the masked layer offset
		switch(this.patient.disease) {
			case Level.BURN:
				this.patient.addChild(this.hotSpot);
				this.hotSpot.x = 200;
				this.hotSpot.y = 550;
				break;

			case Level.INSECT_BITE:
				this.patient.addChild(this.hotSpot);
				this.hotSpot.x = 200;
				this.hotSpot.y = 550;
				break;

			case Level.FRACTURE_HAND:
				this.patient.addChild(this.hotSpot);
//					maskedLayer.patientLayerSkeletal.addChild(hotSpot);
//					hotSpot.x = 60;
				this.hotSpot.x = 60 + 107;
				this.hotSpot.y = 600;
				this.scanner.highlightButton(Scanner.SKELETAL);
				break;

			case Level.FRACTURE_RADIUS:
				this.patient.addChild(this.hotSpot);
				this.hotSpot.x = 80 + 107;
				this.hotSpot.y = 560;
				this.scanner.highlightButton(Scanner.SKELETAL);
				break;

			case Level.SPRAIN:
				this.patient.addChild(this.hotSpot);
//					maskedLayer.patientLayerMuscular.addChild(hotSpot);
//					hotSpot.x = 80;
				this.hotSpot.x = 80 + 107;
				this.hotSpot.y = 560;
				this.scanner.highlightButton(Scanner.MUSCULAR);
				break;

			case Level.POISONING:
				if(Config.gameState == Config.EXAMINING){
					this.patient.addChild(this.hotSpot);
//						maskedLayer.patientLayerDigestive.addChild(hotSpot);
//						hotSpot.x = 230;
					this.hotSpot.x = 230 + 107;
					this.hotSpot.y = 360;
				}else if(Config.gameState == Config.BETWEEN_TREATMENTS){
					this.patient.addChild(this.hotSpot);
//						maskedLayer.patientLayerDigestive.addChild(hotSpot);
//						hotSpot.x = 200;
					this.hotSpot.x = 200 + 107;
					this.hotSpot.y = 580;
				}

				this.scanner.highlightButton(Scanner.DIGESTIVE);
				break;

			case Level.PNEUMONIA:
				this.patient.addChild(this.hotSpot);
//					maskedLayer.patientLayerRespiratoryAndUrinary.addChild(hotSpot);
//					hotSpot.x = 220;
				this.hotSpot.x = 220 + 107;
				this.hotSpot.y = 460;
				this.scanner.highlightButton(Scanner.RESPIRATORY_AND_UNINARY);
				break;

			default:
				Logger.log(this, "OperatingRoomView addDiseaseHotspotAndHighlightScannerButton DEFAULT no disease");
				break;
		}

// 		let hotSpotInvisible:HotSpot = new HotSpot();
// 		hotSpotInvisible.alpha = 0.5; //TODO temp was 0;
//
// 		// 107 is the masked layer offset
// //			hotSpotInvisible.x = hotSpot.x + patient.x + 107;
// 		hotSpotInvisible.x = this.hotSpot.x + this.patient.x;
// 		hotSpotInvisible.y = this.hotSpot.y + this.patient.y;
// 		this.addChild(hotSpotInvisible);
//
// 		// Make hotSpotInvisible inactive when outside scanner
// 		hotSpotInvisible.disable();
//
// 		if(this.scanner) {
// 			this.scanner.hotspot = hotSpotInvisible;
// 		}

	}

	private onDiseaseHotspotPressed = (e:HospitalEvent):void => {
		Logger.log(this, "OperatingRoomView onDiseaseHotspotPressed");
		this.hotSpot.off(HospitalEvent.DISEASE_HOTSPOT_PRESSED, this.onDiseaseHotspotPressed);
		this.emit(HospitalEvent.DISEASE_HOTSPOT_PRESSED);
	}

	private startGame():void {
		Logger.log(this, "OperatingRoomView.startGame()     Config.gameState == "+Config.gameState);
		Logger.log(this, "OperatingRoomView.startGame()   this.scanner == "+this.scanner);

		if(Config.gameState == Config.POST_TREATMENT){
			this.onGameCompleted();
		}else if((Config.gameState == Config.EXAMINING || Config.gameState == Config.BETWEEN_TREATMENTS) && this.scanner){

			this.addScannerSettings();

		}
	}

	private audioDiseaseSpeakComplete(event:Object):void {
		Config.currentTimeout = setTimeout(():void => { //TODO sound

			// Wait for patient disease speak to end
			// if(sndMan.soundIsPlaying(Config.currentSpeakOverlappingViewsSound)){
			// 	sndMan.getSoundChannel(Config.currentSpeakOverlappingViewsSound).addEventListener("soundComplete", playScannerSpeak);
			// }else{
			// 	this.playScannerSpeak(null);
			// }
			Logger.log(this, "OperatingRoomView audioDiseaseSpeakComplete Config.currentSpeakOverlappingViewsSound == "+Config.currentSpeakOverlappingViewsSound);
			if(Config.currentSpeakOverlappingViewsSound != null) {
				// AudioPlayer.getInstance().stopSound(Config.currentSpeakOverlappingViewsSound);
				this.sndSpeak = AudioPlayer.getInstance().getSoundByName(Config.currentSpeakOverlappingViewsSound);
				this.sndSpeak.on(AudioPlayer.AUDIO_COMPLETE, this.playScannerSpeak);
			}else{
				this.playScannerSpeak(null);
			}

		}, 200);
	}

	private playScannerSpeak = (event:Event):void => {
		if(this.scanner && !this.scanner.clickedOnce){ //TODO sound
			// if(sndMan.soundIsPlaying(Config.currentSpeakSound)){
			// 	sndMan.stopSound(Config.currentSpeakSound);
			// }
            //
			// Config.currentSpeakSound = "mille_kan_du_se_maskinen_der_blinker";
			// sndMan.playSound(Config.currentSpeakSound, Config.SPEAK_VOLUME_LEVEL);
			// sndMan.getSoundChannel(Config.currentSpeakSound).addEventListener("soundComplete", speakComplete);
			if(this.sndSpeak != null) {
				this.sndSpeak.off(AudioPlayer.AUDIO_COMPLETE, this.playScannerSpeak);
			}
			if(Config.currentSpeakSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
			}
			Config.currentSpeakSound = "mille_kan_du_se_maskinen_der_blinker";
			this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
			this.sndSpeak.on(AudioPlayer.AUDIO_COMPLETE, this.speakComplete);
		}
	}

	private speakComplete = (event:Event):void => {
//			Logger.log(this, "OperatingRoomView.speakComplete(event)");
		this.sndSpeak.off(AudioPlayer.AUDIO_COMPLETE, this.speakComplete);
		// if(sndMan.soundIsPlaying("operation_room_music_loop")){ //TODO sound
		// 	sndMan.tweenVolume("operation_room_music_loop", 1, 0.5);
		// }
	}

	private getDiseaseSpeakSound():string {
		let toReturn:string;
		switch(Config.currentPatient.disease) {
			case Level.FRACTURE_HAND:
				toReturn = "mille_nu_skal_du_bahandle_en_brakket_hand";
				break;

			case Level.FRACTURE_RADIUS:
				toReturn = "mille_av_for_en_hundestejle";
				break;

			case Level.INSECT_BITE:
				toReturn = "mille_det_er_altsa_mega_uheldigt";
				break;

			case Level.PNEUMONIA:
				toReturn = "mille_host_host_vi_kan_alle_blive_syge";
				break;

			case Level.POISONING:
				toReturn = "mille_puha_nogen_der_har_slaet_en_fis";
				break;

			case Level.SPRAIN:
				toReturn = "mille_prov_lige_at_leg_ninja";
				break;

			case Level.BURN:
				toReturn = "mille_na_da_her_er_en_der_har_brandt_sig";
				break;

			default:
				break;
		}

		return toReturn;
	}


	private onScannerChange = (event:Event):void => {
			Logger.log(this, "OperatingRoomView.onScannerChange(event)");
			Logger.log(this, "scanner.state: " + this.scanner.state);

		this.maskedLayer.update(this.scanner.state);
	}

	private touchDown = (event:TouchEvent):void => {
		// Logger.log(this, "Patient touchDown  event.type == "+event.type);
		this.mouseDown = true;
		Logger.log(this, "OperatingRoomView touchDown this.x == "+this.x+" :  this.y == "+this.y);

		let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
		let mousePosition: Point = event.data.getLocalPosition(this);
		Logger.log(this, "Patient touchDown  mousePositionCanvas.x == "+mousePositionCanvas.x+" ; mousePositionCanvas.y == "+mousePositionCanvas.y);
		Logger.log(this, "Patient touchDown  mousePosition.x == "+mousePosition.x+" ; mousePosition.y == "+mousePosition.y);
		// this.x = mousePositionCanvas.x;
		// this.y = mousePositionCanvas.y;

		Logger.log(this, "OperatingRoomView AFTER touchDown this.x == "+this.x+" :  this.y == "+this.y);
	}

	private touchMove = (event:TouchEvent):void => {
		// Logger.log(this, "Patient touchMove  event.type == "+event.type);
		if(this.mouseDown) {

			Logger.log(this, "OperatingRoomView touchMove this.x == "+this.x+" :  this.y == "+this.y);

			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			let mousePosition: Point = event.data.getLocalPosition(this);
			Logger.log(this, "OperatingRoomView touchMove  mousePositionCanvas.x == "+mousePositionCanvas.x+" ; mousePositionCanvas.y == "+mousePositionCanvas.y);
			Logger.log(this, "OperatingRoomView touchMove  mousePosition.x == "+mousePosition.x+" ; mousePosition.y == "+mousePosition.y);

			this.x = Math.abs(mousePositionCanvas.x);
			this.y = Math.abs(mousePositionCanvas.y);

			// if(this.checkCollision(this, this._target)){
			let hit: boolean = SpriteHelper.hitTest(this.draggableObject.getBounds(), this.draggableObjectTarget.getBounds());
			if (hit) {
				this.draggableObjectTarget.alpha = 0.6;
			} else {
				this.draggableObjectTarget.alpha = 0.3;
			}

			Logger.log(this, "OperatingRoomView AFTER touchMove this.x == "+this.x+" :  this.y == "+this.y);
		}
	}

	private touchDone = (event:TouchEvent):void => {
		Logger.log(this, "OperatingRoomView touchDone  event.type == "+event.type);
		this.mouseDown = false;
		// if(this.checkCollision(this, this._target)){
		// let hit:boolean = SpriteHelper.hitTest(this.getBounds(), this._target.getBounds());
		let hit: boolean = SpriteHelper.hitTest(this.draggableObject.getBounds(), this.draggableObjectTarget.getBounds());
		if (hit) {
			Logger.log(this, "OperatingRoomView touchDone this.x == "+this.x+" :  this.y == "+this.y);

		// if(this.draggableObject.bounds.intersects(this.draggableObjectTarget.bounds)){
		// 	this.draggableObject.off(TouchEvent.TOUCH, this.draggableObjectTouchListener);

			this.draggableObject.off(TouchEvent.TOUCH, this.touchDown);
			this.draggableObject.off(TouchEvent.TOUCH_END, this.touchDone);
			this.draggableObject.off(TouchEvent.TOUCH_MOVE, this.touchMove);

			// Snap bandage to target
			TweenLite.to(this.draggableObject, 0.5, {x:this.draggableObjectTarget.x, y:this.draggableObjectTarget.y ,onComplete:():void => {

				// In poisoning treatment
				if(this.patient.disease == Level.POISONING && Config.gameState == Config.BETWEEN_TREATMENTS){

					// glass
					this.removeChild(this.draggableObjectTarget);

					TweenLite.to(this.draggableObject, 1, {alpha:0, delay:1, onComplete:this.createAndStartScanner});

					// show scanner - hotspot to follow path game
					Logger.log(this, "show scanner - hotspot to follow path game");
					AudioPlayer.getInstance().playSound("drink_water", 0, Config.SPEAK_VOLUME_LEVEL);
					if(Config.currentSpeakSound != null) {
						AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
					}
					Config.currentSpeakSound = "mille_super_flot";
					this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
					this.sndSpeak.on(AudioPlayer.AUDIO_COMPLETE, this.speakComplete);

				}else{
					this.onGameCompleted();
				}
			}});

		}else{
			// Snap bandage to starting point
			TweenLite.to(this.draggableObject, 0.5, {x:OperatingRoomView.DRAGGABLE_OBJECT_POSITION.x, y:OperatingRoomView.DRAGGABLE_OBJECT_POSITION.y});
		}
	}

	private createAndStartScanner = ():void => {
		Logger.log(this, "createAndStartScanner");
		this.maskedLayer = new MaskedLayer();
		this.patient.addChild(this.maskedLayer);

		// Scanner
		this.scanner = new Scanner();
		this.scanner.x = Config.safeFrame.x + 700;
		this.addChild(this.scanner);

		this.scanner.highlightInactive();

		this.addDiseaseHotspotAndHighlightScannerButton();

		//--------

		this.addScannerSettings();
	}

	private addScannerSettings():void{
		this.scanner.on("change", this.onScannerChange); //TODO

		this.scanner.update();

		this.scanner.layerToMask = this.maskedLayer;

		this.scanner.createPatientLayerToDiseaseMap();

		// show no anatomic layer from start
		this.maskedLayer.update("");

		// Adjust masked bg layer
		this.maskedLayer.maskedLayerBG.x = - this.patient.x;
		this.maskedLayer.maskedLayerBG.y = - this.patient.y;
	}

	private onGameCompleted = ():void => {
		Config.gameState = Config.POST_TREATMENT;
		this.patient.setFacialExpression(Patient.EXPRESSION_BIG_SMILE);

		Config.currentTimeout = setTimeout(():void => {

			// Only show unlocked screen if something has been unlocked
			if(this.checkIfCurrentLevelHasUnlocks()){
				this.showUnlockedScreen();
			}else{
				// show item selector
				this.unlockedItemsSelector = new ItemsSelector(ItemsSelector.TREATS, this.draggableObjectTarget);
                this.unlockedItemsSelector.x = 0; //Math.floor(AssetLoader.STAGE_WIDTH * .5);
                this.unlockedItemsSelector.y = 0; //630;
				this.addChild(this.unlockedItemsSelector);
				this.unlockedItemsSelector.setState(ItemsSelector.CLOSED);
				this.unlockedItemsSelector.highlight();
			}

			if(Config.currentSpeakSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
			}
			Config.currentSpeakSound = "done_" + Math.ceil(Math.random() * 4);
			this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
			this.sndSpeak.on(AudioPlayer.AUDIO_COMPLETE, this.speakComplete);
		}, 500);

	}

	private checkIfCurrentLevelHasUnlocks():boolean {
		let index:number = Config.patientsCured < Config.levels.length ? Config.patientsCured : Config.levels.length - 1;
		if(Config.levels[index].unlockedTools.length > 0) return true;
		if(Config.levels[index].unlockedClothes.length > 0) return true;
		if(Config.levels[index].unlockedBandage.length > 0) return true;
		if(Config.levels[index].unlockedBandAid.length > 0) return true;
		if(Config.levels[index].unlockedLemonade.length > 0) return true;

		return false;
	}

	private showUnlockedScreen():void {
		Logger.log(this, "OperatingRoomView showUnlockedScreen");
		this.unlockedItemsSelector = new ItemsSelector(ItemsSelector.TREATS, this.draggableObjectTarget);
        this.unlockedItemsSelector.x = 0 - Math.abs(Math.floor(AssetLoader.getInstance().ratioX / 2)); //AssetLoader.STAGE_WIDTH * .5;
        this.unlockedItemsSelector.y = 0 + Math.abs(Math.floor(AssetLoader.getInstance().ratioY / 2)); //630;
		this.addChild(this.unlockedItemsSelector);
		this.unlockedItemsSelector.setState(ItemsSelector.OPEN_BAG_ONLY);
		this.unlockedItemsSelector.visible = false;

		this.unlockedScreen = new UnlockedScreen(this.unlockedItemsSelector.bagClosedPos, ItemsSelector.TREATS);
		this.addChild(this.unlockedScreen);

		this.unlockedScreen.on(UnlockedScreen.WRAPPED_GIFT_PRESSED, (event:HospitalEvent):void => {
			this.startKonfetti();

			Config.currentTimeout = setTimeout(():void => {
				this.unlockedItemsSelector.setState(ItemsSelector.CLOSED);
				this.unlockedScreen.visible = false;
				Logger.log(this, "Timeout from Operating Room  this.unlockedScreen.visible == "+this.unlockedScreen.visible);
			}, 2000);
			this.unlockedItemsSelector.visible = true;
			this.unlockedItemsSelector.highlight();

			if(this.checkIfCurrentLevelHasUnlocks()){
				this.waitingRoomSpeakTimeout = setTimeout(():void => {
					if(Config.currentSpeakSound != null) {
						AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
					}
					Config.currentSpeakSound = "mille_skynd_dig_ud_i_ventevaerelset_der_er_helt_sikkert_flere_born";
					this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
					this.sndSpeak.on(AudioPlayer.AUDIO_COMPLETE, this.speakComplete);

					this.highlightBtnToWaitingRoom();
				}, 10000);
			}
		});
	}

	private highlightBtnToWaitingRoom = ():void => {
		Logger.log(this, "OperatingRoomView highlightBtnToWaitingRoom  this.btnToWaitingRoom == "+this.btnToWaitingRoom);
		TweenMax.to(this.btnToWaitingRoom.btnBack, 0.5, {width:"+=40", height:"+=40", x:"+=20", y:"+=20", repeat:-1, yoyo:true, ease:Linear.easeNone});
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

	private audioGameCompletedComplete(event:Object = null):void {
		this.emit(HospitalEvent.PATIENT_CURED);
	}


	public destroy():void {
		Logger.log(this, "OperatingRoomView destroy  this.children.length == "+this.children.length);

		if(this.btnBack != null){
			this.btnBack.destroy();
			this.btnBack = null;
		}

		if(this.btnToWaitingRoom != null){
			this.btnToWaitingRoom.destroy();
			this.btnToWaitingRoom = null;
		}

		// this.patient.removeChild(this.hotSpot);
		if(this.hotSpot != null) {
			try{
				this.patient.removeChild(this.hotSpot);
			} catch (error) {
				Logger.log(this, "ERROR OperatingRoomView destroy : this.patient.removeChild(this.hotSpot)");
			}

			this.hotSpot.off(HospitalEvent.DISEASE_HOTSPOT_PRESSED, this.onDiseaseHotspotPressed);
			this.hotSpot.destroy();
			this.hotSpot = null;
		}

		// this.removeChild(this.draggableObjectTarget);
		if(this.draggableObject != null) {
			this.draggableObject.off(TouchEvent.TOUCH, this.touchDown);
			this.draggableObject.off(TouchEvent.TOUCH_END, this.touchDone);
			this.draggableObject.off(TouchEvent.TOUCH_MOVE, this.touchMove);
		}

		// this.patient.removeChild(this.maskedLayer);
		if(this.maskedLayer != null) {
			try{
				this.patient.removeChild(this.maskedLayer);
			} catch (error) {
				Logger.log(this, "ERROR OperatingRoomView destroy : this.patient.removeChild(this.maskedLayer)");
			}

			this.maskedLayer.destroy();
			this.maskedLayer = null;
		}

		if(this.scanner != null) {
			// this.removeChild(this.scanner.hotspot); //TODO not using ATM
			this.removeChild(this.scanner);
			this.scanner.destroy();
			this.scanner = null;
		}

		if(this.unlockedItemsSelector != null) {
			this.removeChild(this.unlockedItemsSelector);
			this.unlockedItemsSelector.destroy();
			this.unlockedItemsSelector = null;
		}

		if(this.unlockedScreen != null) {
			this.removeChild(this.unlockedScreen);
			this.unlockedScreen.destroy();
			this.unlockedScreen = null;
		}

		if(this.konfettiMaker != null) {
			this.removeChild(this.konfettiMaker);
			this.konfettiMaker.destroy();
			this.konfettiMaker = null;
		}

		if(this.patient != null) {
			this.removeChild(this.patient);
		}

		if(this.background != null) {
			this.removeChild(this.background);
			this.background = null;
		}

		// this.removeChildren(0, this.children.length-1);

		clearTimeout(this.waitingRoomSpeakTimeout);
		clearTimeout(Config.currentTimeout);
		// sndMan.stopSound(Config.currentSpeakSound); //TODO sound
		if(Config.currentSpeakSound != null) {
			AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
		}

		super.destroy();

		Logger.log(this, "OperatingRoomView destroy AFTER this.children.length == "+this.children.length);
	}
}
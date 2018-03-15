import {Level} from "../../vo/Level";
import {TouchEvent} from "../../../loudmotion/events/TouchLoudEvent";
import {Touch} from "../../../loudmotion/events/TouchLoud";
import {Logger} from "../../../loudmotion/utils/debug/Logger";
import {HospitalEvent} from "../../event/HospitalEvent";
import {Door} from "../waitingroom/objects/Door";
import {PairOfEyes} from "./PairOfEyes";
import {ClothesItem} from "../waitingroom/objects/ClothesItem";
import {Sprite, Point, Graphics, interaction} from "pixi.js";
import {AssetLoader} from "../../utils/AssetLoader";
import {SpriteHelper} from "../../../loudmotion/utils/SpriteHelper";
import InteractionEvent = interaction.InteractionEvent;
import {AudioPlayer} from "../../../loudmotion/utils/AudioPlayer";
import {Config} from "../../Config";
import AbstractSoundInstance = createjs.AbstractSoundInstance;

export class Patient extends Sprite {
	set startingPoint(value: Point) {
		this._startingPoint = value;
	}

	get startingPoint():Point {
		return this._startingPoint;
	}

	public static WAITING:string = "appdrhospital.view.objects.Patient.waiting";
	public static BEING_EXAMINED:string = "appdrhospital.view.objects.Patient.beingExamined";
	public static NUM_OF_TYPES:number = 6;
	public static SIZE_SMALL:string = "appdrhospital.view.objects.Patient.SIZE_SMALL";
	public static SIZE_BIG:string = "appdrhospital.view.objects.Patient.SIZE_BIG";

	public static FACE_NEUTRAL:string = "appdrhospital.view.objects.Patient.FACE_NEUTRAL";
	public static FACE_NEUTRAL_BLINK:string = "appdrhospital.view.objects.Patient.FACE_NEUTRAL_BLINK";
	public static FACE_LITTLE_SMILE:string = "appdrhospital.view.objects.Patient.FACE_LITTLE_SMILE";
	public static FACE_LITTLE_SMILE_BLINK:string = "appdrhospital.view.objects.Patient.FACE_LITTLE_SMILE_BLINK";
	public static FACE_BIG_SMILE:string = "appdrhospital.view.objects.Patient.FACE_BIG_SMILE";
	public static FACE_BIG_SMILE_BLINK:string = "appdrhospital.view.objects.Patient.FACE_BIG_SMILE_BLINK";

	public static EXPRESSION_NEUTRAL:string = "appdrhospital.view.objects.Patient.EXPRESSION_NEUTRAL";
	public static EXPRESSION_LITTLE_SMILE:string = "appdrhospital.view.objects.Patient.EXPRESSION_LITTLE_SMILE";
	public static EXPRESSION_BIG_SMILE:string = "appdrhospital.view.objects.Patient.EXPRESSION_BIG_SMILE";


	// type 1-6 (?)
	private _type:number;
	private _state:string;
	private _target:Door;
	private _disease:string;
//		private skin:Texture;
	private touch:Touch;
	private touchOffset:Point;
	private _startingPoint:Point;
	private skinImage:Sprite;

//		private testLabel:TextField;

	// Faces
	private currentFace:string;
	private currentFacialExpression:string;

	private faceNeutral:Sprite;
	private faceNeutralBlink:Sprite;
	private faceLittleSmile:Sprite;
	private faceLittleSmileBlink:Sprite;
	private faceBigSmile:Sprite;
	private faceBigSmileBlink:Sprite;
	private shadow:Sprite;
	public currentTopClothes:Sprite;
	public currentBottomClothes:Sprite;

	public currentTopClothesTexture:string;
	public currentBottomClothesTexture:string;

	public clothesAdded:boolean;
	private _skinType:number;
	private _eyeColorType:number;
	private pairOfEyes:PairOfEyes;

	private maskRect:Graphics;
	private mouseDown: boolean;

	private rectCover:Graphics;
	protected sndSpeak:Howl;

	constructor(type:number, startingPoint:Point) {
		super();
		this._type = type;
		this.interactive = true;
		this.buttonMode = true;
		this._startingPoint = startingPoint;
		this.startBlinking();
		this.onAddedToStage();
	}

	public get width():number{
		return this.skinImage.width;
	}

	public get height():number{
		return this.skinImage.height;
	}

	private onAddedToStage():void {
		this.setSkinAndEyeColorType();
		this.createShadow();
		this.createEyes();
		this.updateEyesMask();
		this.createSkinLayer();
		this.createFaces();
		this.setFace(Patient.FACE_NEUTRAL);
		this.setFacialExpression(Patient.EXPRESSION_NEUTRAL);
		this.createClothes();
		this.startBreathing();
	}

	public setPivotXY(amt:number = .5):void{
		this.pivot.set(this.skinImage.width * amt, this.skinImage.height * amt);
	}

	public get skinType():number {
		return this._skinType;
	}

	private startBlinking():void {
		setInterval(this.blink, Math.round(Math.random() * 3000) + 3000);
	}

	private startBreathing():void {
		TweenMax.to(this.currentTopClothes, 1, {width:"+=12", x:"-=6", repeat:-1, yoyo:true, ease:Linear.easeNone});
	}

	public static clone(originalPatient:Patient):Patient {
		let clone:Patient = new Patient(originalPatient.type, originalPatient._startingPoint);
		clone.state = originalPatient.state;
		clone.disease = originalPatient.disease;
		clone.target = originalPatient.target;
		clone.currentBottomClothesTexture = originalPatient.currentBottomClothesTexture;
		clone.currentTopClothesTexture = originalPatient.currentTopClothesTexture;
		return clone;
	}

	public get disease():string {
		return this._disease;
	}

	public set disease(value:string) {
		this._disease = value;
	}

	public toString():string {
		return "Patient - type: " + this._type;
	}

	public get target():Door {
		return this._target;
	}

	public set target(value:Door) {
		this._target = value;
	}

	public get type():number {
		return this._type;
	}

	public set type(value:number) {
		this._type = value;
	}

	public get state():string {
		return this._state;
	}

	public set state(value:string) {
		this._state = value;
		switch(this._state) {
			case Patient.WAITING:
				this.makeDraggable();
				break;
			case Patient.BEING_EXAMINED:
				break;
			default:
				break;
		}
	}

	public scalePatient(size:string):void{
		if(size == Patient.SIZE_BIG){
			this.scale.x = this.scale.y = 1;
		}else if(size == Patient.SIZE_SMALL){
			this.scale.x = this.scale.y = 0.5;
		}
		this.updateEyesMask();
	}

	public setFacialExpression(facialExpression:string):void{
		this.currentFacialExpression = facialExpression;
		switch(this.currentFacialExpression) {
			case Patient.EXPRESSION_NEUTRAL:
				this.setFace(Patient.FACE_NEUTRAL);
				break;
			case Patient.EXPRESSION_LITTLE_SMILE:
				this.setFace(Patient.FACE_LITTLE_SMILE);
				break;

			case Patient.EXPRESSION_BIG_SMILE:
				this.setFace(Patient.FACE_BIG_SMILE);
				break;

			default:
				break;
		}
	}

	private setFace(face:string):void{
		this.faceNeutral.visible = false;
		this.faceNeutralBlink.visible = false;
		this.faceLittleSmile.visible = false;
		this.faceLittleSmileBlink.visible = false;
		this.faceBigSmile.visible = false;
		this.faceBigSmileBlink.visible = false;

		switch(face) {
			case Patient.FACE_NEUTRAL:
				this.faceNeutral.visible = true;
				break;

			case Patient.FACE_NEUTRAL_BLINK:
				this.faceNeutralBlink.visible = true;
				break;
			case Patient.FACE_LITTLE_SMILE:
				this.faceLittleSmile.visible = true;
				break;

			case Patient.FACE_LITTLE_SMILE_BLINK:
				this.faceLittleSmileBlink.visible = true;
				break;

			case Patient.FACE_BIG_SMILE:
				this.faceBigSmile.visible = true;
				break;

			case Patient.FACE_BIG_SMILE_BLINK:
				this.faceBigSmileBlink.visible = true;
				break;

			default:
				break;
		}

		this.currentFace = face;
	}

	private blink = ():void => {
		if(this.currentFacialExpression == Patient.EXPRESSION_NEUTRAL){
			this.setFace(Patient.FACE_NEUTRAL_BLINK);
			setTimeout(this.setFaceNoBlink, 200);
		}else if(this.currentFacialExpression == Patient.EXPRESSION_LITTLE_SMILE){
			this.setFace(Patient.FACE_LITTLE_SMILE_BLINK);
			setTimeout(this.setFaceNoBlink, 200);
		}else if(this.currentFacialExpression == Patient.EXPRESSION_BIG_SMILE){
			this.setFace(Patient.FACE_BIG_SMILE_BLINK);
			setTimeout(this.setFaceNoBlink, 200);
		}
	}

	private setFaceNoBlink = ():void => {
		switch(this.currentFacialExpression) {
			case Patient.EXPRESSION_NEUTRAL:
				this.setFace(Patient.FACE_NEUTRAL);
				break;

			case Patient.EXPRESSION_LITTLE_SMILE:
				this.setFace(Patient.FACE_LITTLE_SMILE);
				break;
			case Patient.EXPRESSION_BIG_SMILE:
				this.setFace(Patient.FACE_BIG_SMILE);
				break;

			default:
				break;
		}
	}


	public setClothes(texture:string, type:string):void{
		if(type == ClothesItem.TOP){
			this.removeChild(this.currentTopClothes);
			this.currentTopClothesTexture = texture;
			this.currentTopClothes = Sprite.fromFrame(texture);
			this.addChild(this.currentTopClothes);
			this.currentTopClothes.x = 182;
			this.currentTopClothes.y = 400;
		} else if(type == ClothesItem.BOTTOM){
			this.removeChild(this.currentBottomClothes);
			this.currentBottomClothesTexture = texture;
			this.currentBottomClothes = Sprite.fromFrame(texture);
			this.addChild(this.currentBottomClothes);
			this.currentBottomClothes.x = 182;
			this.currentBottomClothes.y = 500;

			// make sure top is over bottom
			this.addChild(this.currentTopClothes);
		}

		if(Config.currentSpeakSound != null) {
			AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
		}
		Config.currentSpeakSound = "barn_nyt_toj_" + Math.ceil(Math.random() * 3);
		this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
		this.sndSpeak.on(AudioPlayer.AUDIO_COMPLETE, this.audioExpressionSpeakComplete);
		this.clothesAdded = true;
	}

	private makeDraggable():void {
		this.on(TouchEvent.TOUCH, this.touchDown);
		this.on(TouchEvent.TOUCH_END, this.touchDone);
		this.on(TouchEvent.TOUCH_OUT, this.touchDone);
		this.on(TouchEvent.TOUCH_MOVE, this.touchMove);
	}

	private touchDown = (event:TouchEvent):void => {
		this.mouseDown = true;
		this._target.showOpened();
		this.playExpressionSpeak();
		let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
		this.touchOffset = mousePositionCanvas;
		this.touchOffset.x = this.touchOffset.x * this.scale.x;
        this.touchOffset.y = this.touchOffset.y * this.scale.y;
        console.log(this.touchOffset);
        console.log(this.touchOffset.x);
        console.log(this.touchOffset.y);
		this.parent.setChildIndex(this, this.parent.children.length-1);
		this.x = this.startingPoint.x;
		this.y = this.startingPoint.y;
	}

	private touchMove = (event:InteractionEvent):void => {
		if(this.mouseDown) {
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			let mousePosition: Point = event.data.getLocalPosition(this);
			this.x = Math.abs(mousePositionCanvas.x);

            // stop patient from getting behind foreground elements
			if(mousePositionCanvas.y - this.touchOffset.y < 280) {
				this.y = Math.abs(mousePositionCanvas.y);
			}

			let hit: boolean = SpriteHelper.hitTest(this.getBounds(), this._target.getBounds());
			if (hit) {
				this._target.highlight();
			} else {
				this._target.removeHighlight();
			}
			this.updateEyesMask();
		}
	}

	private touchDone = (event:InteractionEvent):void => {
		this.mouseDown = false;
		let hit:boolean = SpriteHelper.hitTest(this.getBounds(), this._target.getBounds());
		if(Patient.WAITING) {
			if (hit) {
				this.off(TouchEvent.TOUCH, this.touchDown);
				this.off(TouchEvent.TOUCH_END, this.touchDone);
				this.off(TouchEvent.TOUCH_MOVE, this.touchMove);

				this.x = this.startingPoint.x;
				this.y = this.startingPoint.y;

				this.emit(HospitalEvent.PATIENT_DROPPED, "selected patient", this, "selected patient");
			} else {
				TweenLite.to(this, .2, {
					x: this._startingPoint.x,
					y: this._startingPoint.y,
					onComplete: this.updateEyesMask
				});
				// also tween eyes mask
				this.blink();
			}
			this._target.showClosed();
		}
	}

	private createEyes():void {
		this.pairOfEyes = new PairOfEyes(this._eyeColorType);
		this.addChild(this.pairOfEyes);
		this.pairOfEyes.x = 274;
		this.pairOfEyes.y = 264;
	}

	private createClothes():void {
		if(this.currentBottomClothes != null){
			this.removeChild(this.currentBottomClothes);
		}

		if(this.currentTopClothes != null){
			this.removeChild(this.currentTopClothes);
		}

		this.currentBottomClothesTexture = this.currentBottomClothesTexture || "clothesLower_0" + Math.ceil(Math.random() * ClothesItem.NUM_OF_BOTTOM_CLOTHES_ITEMS);
		this.currentBottomClothes = Sprite.fromFrame(this.currentBottomClothesTexture);
		this.addChild(this.currentBottomClothes);
		this.currentBottomClothes.x = 182;
		this.currentBottomClothes.y = 500;

		this.currentTopClothesTexture = this.currentTopClothesTexture || "clothesUpper_0" + Math.ceil(Math.random() * ClothesItem.NUM_OF_TOP_CLOTHES_ITEMS);
		this.currentTopClothes = Sprite.fromFrame(this.currentTopClothesTexture);
		this.addChild(this.currentTopClothes);
		this.currentTopClothes.x = 182;
		this.currentTopClothes.y = 400;
	}

	private createShadow():void {
		this.shadow = Sprite.fromFrame("shadow_01");
		this.addChild(this.shadow);
		this.shadow.x = 45;
		this.shadow.y = 720;
	}

	private createSkinLayer():void {
		if(this._type > Patient.NUM_OF_TYPES){
			Logger.log(this, "type out of range - texture does not exist");
			return;
		}

		let texture:string;
		texture = "kid" + this._type;
		this.skinImage = Sprite.fromFrame(texture);
		this.addChild(this.skinImage);
	}

	private setSkinAndEyeColorType():void {
		switch(this._type){
			case 1:
				this._skinType = 1;
				this._eyeColorType = 5;
				break;
			case 2:
				this._skinType = 4;
				this._eyeColorType = 3;
				break;

			case 3:
				this._skinType = 3;
				this._eyeColorType = 2;
				break;
			case 4:
				this._skinType = 2;
				this._eyeColorType = 4;
				break;

			case 5:
				this._skinType = 1;
				this._eyeColorType = 1;
				break;

			case 6:
				this._skinType = 3;
				this._eyeColorType = 4;
				break;

			default:
				break;
		}
	}

	private createFaces():void {
		this.faceNeutral = this.createFace("facialExpression_kid" + this._type +"_neutral");
		this.faceNeutralBlink = this.createFace("facialExpression_kid" + this._type +"_neutralBlink");
		this.faceLittleSmile = this.createFace("facialExpression_kid" + this._type +"_littleSmile");
		this.faceLittleSmileBlink = this.createFace("facialExpression_kid" + this._type +"_littleSmileBlink");
		this.faceBigSmile = this.createFace("facialExpression_kid" + this._type +"_bigSmile");
		this.faceBigSmileBlink = this.createFace("facialExpression_kid" + this._type +"_bigSmileBlink");
	}

	private createFace(texture:string):Sprite {
		let faceImage:Sprite = Sprite.fromFrame(texture);
		this.addChild(faceImage);
		faceImage.x = 188;
		faceImage.y = 168;
		return faceImage;
	}

	private updateEyesMask():void {
	}


	private playExpressionSpeak():void {
		if(Config.currentSpeakSound != null) {
			AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
		}
		if(Config.currentSpeakOverlappingViewsSound != null) {
			AudioPlayer.getInstance().stopSound(Config.currentSpeakOverlappingViewsSound);
		}
		Config.currentSpeakOverlappingViewsSound = this.getExpressionSpeakSound();
		this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakOverlappingViewsSound, 0, Config.SPEAK_VOLUME_LEVEL);
		this.sndSpeak.on(AudioPlayer.AUDIO_COMPLETE, this.audioExpressionSpeakComplete);
	}

	private audioExpressionSpeakComplete = (event:Event):void => {
		this.sndSpeak.off(AudioPlayer.AUDIO_COMPLETE, this.audioExpressionSpeakComplete);
		Config.currentSpeakOverlappingViewsSound = null;
	}

	private getExpressionSpeakSound():string {
		let speak:string;
		switch(this.disease){
			case Level.FRACTURE_HAND:
				speak = "barn_jeg_har_slaet_min_hand";
				break;

			case Level.FRACTURE_RADIUS:
				speak = "barn_min_arm_er_vist_braekket_fordi_jeg_vaeltede_pa_min_cykel";
				break;

			case Level.INSECT_BITE:
				speak = "barn_jeg_er_blevet_stukket_af_en_bi_kan_du_hjaelpe_mig";
				break;

			case Level.PNEUMONIA:
				speak = "barn_jeg_hoster_rigtig_meget_mon_jeg_er_forkolet";
				break;

			case Level.POISONING:
				speak = "barn_det_rumler_i_min_mave_mon_det_er_noget_jeg_har_spist";
				break;
			case Level.SPRAIN:
				speak = "barn_min_arm_er_forstuvet_kan_du_reparere_den";
				break;

			case Level.BURN:
				speak = "barn_jeg_har_braendt_mig_pa_en_gryde_skal_vi_komme_is_pa";
				break;

			default:
				break;
		}

		return speak;
	}

	public startIdleEyeMOvement():void {
		this.pairOfEyes.initIdleMovement();
	}

	public destroy():void{
		if(this.sndSpeak != null) {
			this.sndSpeak.off(AudioPlayer.AUDIO_COMPLETE, this.audioExpressionSpeakComplete);
		}
		this.off(TouchEvent.TOUCH, this.touchDown);
		this.off(TouchEvent.TOUCH_END, this.touchDone);
		this.off(TouchEvent.TOUCH_OUT, this.touchDone);
		this.off(TouchEvent.TOUCH_MOVE, this.touchMove);

		if(this.pairOfEyes != null) {
			this.removeChild(this.pairOfEyes);
			this.pairOfEyes = null;
		}
		if(this.currentTopClothes != null) {
			this.removeChild(this.currentTopClothes);
			this.currentTopClothes = null;
		}
		if(this.currentBottomClothes != null) {
			this.removeChild(this.currentBottomClothes);
			this.currentBottomClothes = null;
		}
	}
}
import {HospitalGameView} from "../../HospitalGameView";
import {Config} from "../../../Config";
import {Level} from "../../../vo/Level";
import {Logger} from "../../../../loudmotion/utils/debug/Logger";
import {TargetObject} from "./objects/TargetObject";
import {Piece} from "./objects/Piece";
import {HospitalEvent} from "../../../event/HospitalEvent";
import {Touch} from "../../../../loudmotion/events/TouchLoud";
import {AssetLoader} from "../../../utils/AssetLoader";
import {SpriteHelper} from "../../../../loudmotion/utils/SpriteHelper";
import {Graphics, Sprite, Container, Point} from "pixi.js";
import {BackBtn} from "../../buttons/BackBtn";
import {AudioPlayer} from "../../../../loudmotion/utils/AudioPlayer";

export class PuzzleGameView extends HospitalGameView {
	public static PIECE_TOUCH_OFFSET:number = 100;

	private piecesInPlace:number;

	private bgQuad:Graphics; //Quad;
	private background:Sprite;
	private wholeObject:Sprite;
	private pieces:any;
	public btnBack:BackBtn;

	private touches:Touch[]; //Vector.<Touch>;

	private stage:Container;

	private touchedPiece:Piece;

	constructor () {
		super();
	}

	public init():void {
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.name = "PuzzleGameView";
		Logger.log(this, "Config.currentPatient.disease: " + Config.currentPatient.disease);
		if(Config.currentPatient.disease == Level.FRACTURE_RADIUS) this.drawSceneArm();
		if(Config.currentPatient.disease == Level.FRACTURE_HAND) this.drawSceneHand();

		this.startGame();

		this.btnBack = new BackBtn(this, HospitalEvent.BACK_FROM_MINIGAME);
	}

	private drawSceneArm():void {
		this.bgQuad = new Graphics();
		this.bgQuad.beginFill(0xc1fdf1);
		this.bgQuad.drawRect(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
		this.addChild(this.bgQuad);

		// Background
		this.background = Sprite.fromFrame("brokenBonesGame_armBackground");
		this.addChild(this.background);
		this.background.scale.x = this.background.scale.y = 2;

		// Whole object
		this.wholeObject = Sprite.fromFrame("brokenBonesGame_boneRadius_complete");
		this.addChild(this.wholeObject);

		this.wholeObject.x = 330;
		this.wholeObject.y = 152;

		// this.wholeObject.rotation = deg2rad(15);
		this.wholeObject.rotation = 15 * (Math.PI / 180);
		this.wholeObject.alpha = 0;

		// Pieces collection
		this.pieces = [];

		// Pieces
		let targetObject_1:TargetObject = new TargetObject("brokenBonesGame_boneRadius_01", new Point(366, 250), 41);
		this.addChild(targetObject_1);

		let piece_1:Piece = new Piece("brokenBonesGame_boneRadius_01", new Point(640, 200), -20, targetObject_1, "piece_1_arm");
		this.addChild(piece_1);
		this.pieces.push(piece_1);

		let targetObject_2:TargetObject = new TargetObject("brokenBonesGame_boneRadius_02", new Point(462, 282), 3);
		this.addChild(targetObject_2);

		let piece_2:Piece = new Piece("brokenBonesGame_boneRadius_02", new Point(800, 200), 30, targetObject_2, "piece_2_arm");
		this.addChild(piece_2);
		this.pieces.push(piece_2);

		let targetObject_3:TargetObject = new TargetObject("brokenBonesGame_boneRadius_03", new Point(594, 308), 22);
		this.addChild(targetObject_3);

		let piece_3:Piece = new Piece("brokenBonesGame_boneRadius_03", new Point(510, 120), 0, targetObject_3, "piece_3_arm");
		this.addChild(piece_3);
		this.pieces.push(piece_3);

		let targetObject_4:TargetObject = new TargetObject("brokenBonesGame_boneRadius_04", new Point(716, 336), 30);
		this.addChild(targetObject_4);

		let piece_4:Piece = new Piece("brokenBonesGame_boneRadius_04", new Point(366, 150), 0, targetObject_4, "piece_4_arm");
		this.addChild(piece_4);
		this.pieces.push(piece_4);
	}

	private drawSceneHand():void {
		this.bgQuad = new Graphics();
		this.bgQuad.beginFill(0xc1fdf1);
		this.bgQuad.drawRect(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
		this.addChild(this.bgQuad);

		// Background
		this.background = Sprite.fromFrame("braekketHaand_bg");
		this.addChild(this.background);
		this.background.scale.x = this.background.scale.y = 2;

		// Pieces collection
		this.pieces = [];

		// Pieces
		let targetObject_1:TargetObject = new TargetObject("braekketHaand_metaCarpal_2_A", new Point(676, 256), 20);
		this.addChild(targetObject_1);

		let piece_1:Piece = new Piece("braekketHaand_metaCarpal_2_A", new Point(1080, 40), 0, targetObject_1, "piece_1_hand");
		this.addChild(piece_1);
		this.pieces.push(piece_1);

		let targetObject_2:TargetObject = new TargetObject("braekketHaand_metaCarpal_2_B", new Point(778, 295), 20);
		this.addChild(targetObject_2);

		let piece_2:Piece = new Piece("braekketHaand_metaCarpal_2_B", new Point(1080, 140), 0, targetObject_2, "piece_2_hand");
		this.addChild(piece_2);
		this.pieces.push(piece_2);

		let targetObject_3:TargetObject = new TargetObject("braekketHaand_metaCarpal_5_complete", new Point(460, 500), 30);
		this.addChild(targetObject_3);

		let piece_3:Piece = new Piece("braekketHaand_metaCarpal_5_complete", new Point(1080, 240), 0, targetObject_3, "piece_3_hand");
		this.addChild(piece_3);
		this.pieces.push(piece_3);

		let targetObject_4:TargetObject = new TargetObject("braekketHaand_phalanx_P_3", new Point(790, 480), 30);
		this.addChild(targetObject_4);

		let piece_4:Piece = new Piece("braekketHaand_phalanx_P_3", new Point(1080, 340), 0, targetObject_4, "piece_4_hand");
		this.addChild(piece_4);
		this.pieces.push(piece_4);

		let targetObject_5:TargetObject = new TargetObject("braekketHaand_phalanx_M_2", new Point(950, 430), 30);
		this.addChild(targetObject_5);

		let piece_5:Piece = new Piece("braekketHaand_phalanx_M_2", new Point(1080, 440), 0, targetObject_5, "piece_5_hand");
		this.addChild(piece_5);
		this.pieces.push(piece_5);

		let targetObject_6:TargetObject = new TargetObject("braekketHaand_phalanx_M_5", new Point(645, 635), 30);
		this.addChild(targetObject_6);

		let piece_6:Piece = new Piece("braekketHaand_phalanx_M_5", new Point(1080, 540), 0, targetObject_6, "piece_6_hand");
		this.addChild(piece_6);
		this.pieces.push(piece_6);

		let targetObject_7:TargetObject = new TargetObject("braekketHaand_phalanx_D_1", new Point(976, 134), 0);
		this.addChild(targetObject_7);

		let piece_7:Piece = new Piece("braekketHaand_phalanx_D_1", new Point(1080, 640), 0, targetObject_7, "piece_7_hand");
		this.addChild(piece_7);
		this.pieces.push(piece_7);

		let targetObject_8:TargetObject = new TargetObject("braekketHaand_phalanx_D_4", new Point(842, 652), 30);
		this.addChild(targetObject_8);

		let piece_8:Piece = new Piece("braekketHaand_phalanx_D_4", new Point(1080, 740), 0, targetObject_8, "piece_8_hand");
		this.addChild(piece_8);
		this.pieces.push(piece_8);
	}

	private startGame():void {
		// Counter of placed pieces
		this.piecesInPlace = 0;

		// Add touch-event listeners to all pieces
		for (let i:number = 0; i < this.pieces.length; i++) {
			let piece:Piece = this.pieces[i];
			piece.signalPiece.add(this.pieceTouched);
			piece.signalPieceTouchDone.add(this.touchDone);
		}

		// Help speak
		let speakSound:string;
		if(Config.currentPatient.disease == Level.FRACTURE_HAND){
			speakSound = "mille_knoglerne_er_helt_rodet_rundt";
		} else if(Config.currentPatient.disease == Level.FRACTURE_RADIUS){
			speakSound = "mille_knoglen_i_armen_er_braekket_prov_om_du_kan_samle_den_igen";
		}

		Config.currentTimeout = setTimeout(():void => { //TODO sound
			if(Config.currentSpeakSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
			}
			if(Config.currentSpeakOverlappingViewsSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakOverlappingViewsSound);
			}

			Config.currentSpeakSound = speakSound;
			if(Config.currentSpeakSound != null) {
				this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
			}
		}, 1000);
	}

	private pieceTouched = (data:any):void => {
		this.touchedPiece = data as Piece;
	}

	private touchDone = ():void => {
		Logger.log(this, "PuzzleGame touchDone");
		this.mouseDown = false;
		let currentTargetObject:TargetObject = this.touchedPiece.targetObject;
		let hit:boolean = SpriteHelper.hitTest(this.touchedPiece.getBounds(), currentTargetObject.getBounds());
		if(hit){
			this.sndSpeak = AudioPlayer.getInstance().playSound("knogle", 0, Config.SPEAK_VOLUME_LEVEL);
			let currentTargetObject:TargetObject = this.touchedPiece.targetObject;
			TweenLite.to(this.touchedPiece, 0.4, {x:this.touchedPiece.targetObject.x, y:this.touchedPiece.targetObject.y, onComplete:():void => {
				currentTargetObject.visible = false;
				if(++this.piecesInPlace == this.pieces.length){
					this.onGameCompleted();
				}else if(Config.currentPatient.disease == Level.FRACTURE_HAND && this.piecesInPlace == 1){
					if(Config.currentSpeakSound != null) {
						AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
					}
					Config.currentSpeakSound = "mille_super_flot";
					if(Config.currentSpeakSound != null) {
						this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
					}
				}
			}});
			this.touchedPiece.removeTouch();
			this.touchedPiece.signalPiece.remove(this.pieceTouched);
			this.touchedPiece.signalPieceTouchDone.remove(this.touchDone);
		} else {
			Logger.log(this, "this.touchedPiece.height==== " + this.touchedPiece.height);
			TweenLite.to(this.touchedPiece, 0.4, {x: this.touchedPiece.initialPosition.x, y: this.touchedPiece.initialPosition.y});
			this.touchedPiece.resetRotation();
			AudioPlayer.getInstance().playSound("negative", 0, Config.SPEAK_VOLUME_LEVEL);
		}
	}

	private onGameCompleted = ():void => {
		// btnBack.removeEventListener(Event.TRIGGERED, btnBackPressed);

		Logger.log(this, "PuzzleGameView.onGameCompleted()");

		let objectToHighlight:Sprite;

		if(Config.currentPatient.disease == Level.FRACTURE_RADIUS){
			// Whole object is visible and highlighted
			TweenLite.to(this.wholeObject, 2, {alpha:1});

			// Pieces and targetObjects fade away so lines disappear
			this.hidePieces();

			objectToHighlight = this.wholeObject;
		}else if(Config.currentPatient.disease == Level.FRACTURE_HAND){
			objectToHighlight = this.background;
		}

		// Temorary implementation of glow effect
// 		setTimeout(():void => {  //TODO filters PIXI
// 			var glow:BlurFilter = BlurFilter.createGlow(0xffff00,1, 10);
// 			objectToHighlight.filter = glow;
// 		}, 2100);
//
// 		setTimeout(():void => {
// 			var glow:BlurFilter = BlurFilter.createGlow();
// 			objectToHighlight.filter = null;
// 		}, 2400);
//
// 		setTimeout(():void => {
// 			var glow:BlurFilter = BlurFilter.createGlow(0xffff00,1, 10);
// 			objectToHighlight.filter = glow;
// 		}, 3000);
//
// 		setTimeout(():void => {
// 			var glow:BlurFilter = BlurFilter.createGlow();
// 			objectToHighlight.filter = null;
// //				replayButton.visible = true;
// 		}, 3300);

		if(Config.currentSpeakSound != null) {
			AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
		}
		Config.currentSpeakSound = "mille_sadan_det_var_du_rigtig_god_til";
		if(Config.currentSpeakSound != null) {
			this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
			this.sndSpeak.on(AudioPlayer.AUDIO_COMPLETE, this.audioGameCompletedComplete);
		}
	}

	private audioGameCompletedComplete = (event:Event):void => {
		this.sndSpeak.off(AudioPlayer.AUDIO_COMPLETE, this.audioGameCompletedComplete);
		this.emit(HospitalEvent.PATIENT_CURED);
        this.emit(HospitalEvent.MINIGAME_COMPLETED);
	}

	private hidePieces():void {
		for (let piece of this.pieces) {
			TweenMax.to(piece, 2, {alpha: 0});
		}
	}

    public destroy(): void {
        if (this.btnBack != null) {
			this.btnBack.destroy();
			this.btnBack = null;
		}

		if(this.bgQuad != null){
			this.removeChild(this.bgQuad);
			this.bgQuad = null;
		}

		if(this.wholeObject != null){
			this.removeChild(this.wholeObject);
			this.wholeObject = null;
		}

		if(this.background != null){
			this.removeChild(this.background);
			this.background = null;
		}

		for (let i:number = 0; i < this.pieces.length; i++) {
			let piece: Piece = this.pieces[i];
			piece.signalPiece.remove(this.pieceTouched);
			piece.signalPieceTouchDone.remove(this.touchDone);
			piece.destroy();
		}
		super.destroy();
	}
}
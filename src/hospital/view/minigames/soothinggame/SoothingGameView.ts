// USES OBJECTS FROM PUZZLE GAME - to be changed
import {HospitalGameView} from "../../HospitalGameView";
import {TargetObject} from "./objects/TargetObject";
import {Piece} from "./objects/Piece";
import {Config} from "../../../Config";
import {Level} from "../../../vo/Level";
import {AssetLoader} from "../../../utils/AssetLoader";
import {HospitalEvent} from "../../../event/HospitalEvent";
import {Touch} from "../../../../loudmotion/events/TouchLoud";
import {Logger} from "../../../../loudmotion/utils/debug/Logger";
import {SpriteHelper} from "../../../../loudmotion/utils/SpriteHelper";
import {Point, Graphics, Sprite, extras, Container, Texture} from "pixi.js";
import {BackBtn} from "../../buttons/BackBtn";
import {Helper} from "../../../../loudmotion/utils/Helper";
import {AudioPlayer} from "../../../../loudmotion/utils/AudioPlayer";

export class SoothingGameView extends HospitalGameView {
	public static TYPE_1:string = "appdrhospital.view.minigames.soothinggame.SoothingGameView.type_1";
	public static TYPE_2:string = "appdrhospital.view.minigames.soothinggame.SoothingGameView.type_2";
	public static TYPE_3:string = "appdrhospital.view.minigames.soothinggame.SoothingGameView.type_3";
	public static TYPE_4:string = "appdrhospital.view.minigames.soothinggame.SoothingGameView.type_4";

	public static PIECE_TOUCH_OFFSET:number = 150;
//		private GRID_POSITION:Point = new Point(385, 96);
	private GRID_POSITION:Point = new Point(385 + 58, 96 + 74);
	private SQUARE_SIZE:number = 98;
	private INITIAL_PIECE_POSITION:Point = new Point(630, 573);
//		private INIT_NUM_OF_TARGETOBJECTS:number = 24;
	private INIT_NUM_OF_TARGETOBJECTS:number = 15;
	private SPAWN_TARGET_OBJECTS_TIMER_INTERVAL:number = 15000;
	private OFF_STAGE_POSITION:Point;

	private piecesInPlace:number;
	private targetsPlaced:number;

	private bgQuad:Graphics; //Quad;
//		private backgroundHealed:Image;
	private background:Sprite;
	private grid:Sprite;

	private pieces:any;
	private targetObjects:any;
	private targetObjectsWaiting:any;
	private slotsAvailable:any;

//		private replayButton:Button;
	public btnBack:BackBtn;

	private touches:Touch[]; //Vector.<Touch>;

	private targetObject_1:TargetObject;
	private targetObject_2:TargetObject;
	private targetObject_3:TargetObject;
	private targetObject_4:TargetObject;

	private piece_1:Piece;
	private piece_2:Piece;
	private piece_3:Piece;
	private piece_4:Piece;

	private explosion:extras.AnimatedSprite;
	// private spawnTargetObjectsTimer:Timer; //TODO Timer
	private spawnTargetObjectsTimer:number; //TODO Timer
	private currentDisease:string;
	private backgroundName:string;
	private halfwayEncouragingSpeakDone:boolean;

	private stage:Container;
	private touchedPiece:Piece;
	private offsetPosition:Point;


	constructor () {
		super();
	}

	public init():void {
		this.name = "SoothingGameView";
        
		if(Config.currentPatient.disease == Level.SPRAIN){
			this.currentDisease = "forstuvning";
			this.backgroundName = "forstuvning_bg";
		} else if(Config.currentPatient.disease == Level.BURN){
			this.currentDisease = "brandsaar";
			this.backgroundName = "brandsaar_arm_0" + Config.currentPatient.skinType;
		}

		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.OFF_STAGE_POSITION = new Point(0, AssetLoader.STAGE_HEIGHT + 200);
		this.drawScene();
		this.startGame();
	}

	private drawScene():void {
		this.bgQuad = new Graphics();
		this.bgQuad.beginFill(0xc1fdf1);
		this.bgQuad.drawRect(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
		this.addChild(this.bgQuad);

		// Background
		this.background = Sprite.fromFrame(this.backgroundName);
		this.addChild(this.background);
		this.background.scale.x = this.background.scale.y = 2;

		this.grid = Sprite.fromFrame("forstuvning_grid");
		this.addChild(this.grid);
		this.grid.x = this.GRID_POSITION.x;
		this.grid.y = this.GRID_POSITION.y;
		this.grid.scale.x = this.grid.scale.y = 2;

		// Targets collection
		this.targetObjects = [];

		for (let i:number = 0; i < this.INIT_NUM_OF_TARGETOBJECTS; i++) {
			if(i < this.INIT_NUM_OF_TARGETOBJECTS * 0.25){
				this.createAndAddTargetObject(this.currentDisease + "_ikon_a", new Point(this.OFF_STAGE_POSITION.x, this.OFF_STAGE_POSITION.y), SoothingGameView.TYPE_1);
			}else if(i < this.INIT_NUM_OF_TARGETOBJECTS * 0.5){
				this.createAndAddTargetObject(this.currentDisease + "_ikon_b", new Point(this.OFF_STAGE_POSITION.x, this.OFF_STAGE_POSITION.y), SoothingGameView.TYPE_2);
			}else if(i < this.INIT_NUM_OF_TARGETOBJECTS * 0.75){
				this.createAndAddTargetObject(this.currentDisease + "_ikon_c", new Point(this.OFF_STAGE_POSITION.x, this.OFF_STAGE_POSITION.y), SoothingGameView.TYPE_3);
			}else if(i < this.INIT_NUM_OF_TARGETOBJECTS){
				this.createAndAddTargetObject(this.currentDisease + "_ikon_d", new Point(this.OFF_STAGE_POSITION.x, this.OFF_STAGE_POSITION.y), SoothingGameView.TYPE_4);
			}
		}

		// Pieces collection
		this.pieces = [];

		// Pieces
		this.piece_1 = new Piece(this.currentDisease + "_ikon_a", new Point(this.OFF_STAGE_POSITION.x, this.OFF_STAGE_POSITION.y), SoothingGameView.TYPE_1);
		this.addChild(this.piece_1);
		this.pieces.push(this.piece_1);
		this.piece_1.visible = false;

		this.piece_2 = new Piece(this.currentDisease + "_ikon_b", new Point(this.OFF_STAGE_POSITION.x, this.OFF_STAGE_POSITION.y), SoothingGameView.TYPE_2);
		this.addChild(this.piece_2);
		this.pieces.push(this.piece_2);
		this.piece_2.visible = false;

		this.piece_3 = new Piece(this.currentDisease + "_ikon_c", new Point(this.OFF_STAGE_POSITION.x, this.OFF_STAGE_POSITION.y), SoothingGameView.TYPE_3);
		this.addChild(this.piece_3);
		this.pieces.push(this.piece_3);
		this.piece_3.visible = false;

		this.piece_4 = new Piece(this.currentDisease + "_ikon_d", new Point(this.OFF_STAGE_POSITION.x, this.OFF_STAGE_POSITION.y), SoothingGameView.TYPE_4);
		this.addChild(this.piece_4);
		this.pieces.push(this.piece_4);
		this.piece_4.visible = false;

		let frames = [];
		for (let i = 1; i < 9; i++) {
			let val = i < 10 ? '0' + i : i;
			frames.push(Texture.fromFrame('lungebetaendelse_ani_explosion_00' + val));
		}
		this.explosion = new extras.AnimatedSprite(frames);
		this.explosion.loop = false;
		this.explosion.animationSpeed = .5;
		this.explosion.onComplete = ():void => {
			this.onExplosionComplete();
		}

		this.btnBack = new BackBtn(this, HospitalEvent.BACK_FROM_MINIGAME);
	}

	private onExplosionComplete = ():void => {
		this.removeChild(this.explosion);
	}

	private createAndAddTargetObject(texture:string, position:Point, type:string):TargetObject {
		let targetObject:TargetObject = new TargetObject(texture, position, type);
		this.addChild(targetObject);
		this.targetObjects.push(targetObject);
		return targetObject;
	}

	private startGame():void {
		this.piecesInPlace = 0;
		this.targetsPlaced = 0;
		for (let i:number = 0; i < this.pieces.length; i++) {
			let piece:Piece = this.pieces[i];
			piece.signalPiece.add(this.pieceTouched);
			piece.signalPieceTouchDone.add(this.touchDone);
		}

		// Init replay button
//			replayButton.addEventListener(Event.TRIGGERED, onReplayButtonPresseded);
		this.placeAllTargets();
		this.spawnNextPiece();

		this.targetObjectsWaiting = [];
		this.slotsAvailable =[];

		Config.currentTimeout = setTimeout(():void => {
			if(Config.currentSpeakSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
			}
			if(Config.currentSpeakOverlappingViewsSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakOverlappingViewsSound);
			}
			Config.currentSpeakSound = "mille_tag_den_nederste_brik_prov_om_du_kan";
			this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
		}, 1000);
	}

	private placeAllTargets():void {
		let occupiedSlots:Point[] = []; //new Vector.<Point>();
		while (this.targetsPlaced < this.INIT_NUM_OF_TARGETOBJECTS){
			let pointToTry:Point = new Point(Math.ceil(Math.random() * 5), Math.ceil(Math.random() * 3));

			if(!isOccupied(pointToTry)){
				occupiedSlots.push(pointToTry);
				this.placeNextTarget(pointToTry.x, pointToTry.y, this.targetsPlaced);
				this.targetsPlaced++;
			}
		}

		function isOccupied(point:Point):boolean{
			for (let i:number = 0; i < occupiedSlots.length; i++) {
				if(occupiedSlots[i].equals( point)){
					return true;
				}
			}
			return false;
		}
	}

	// private onReplayButtonPresseded():void {
	// 	this.quitGame();
	// }

	private pieceTouched = (data:any):void => {
		this.touchedPiece = data as Piece;
	}

	private touchDone = ():void => {
		this.mouseDown = false;
		let collidedTargetObject: TargetObject = this.checkTargetCollision(this.touchedPiece);
		if (collidedTargetObject != null) {
			TweenLite.to(this.touchedPiece, 0.4, {x: collidedTargetObject.x + this.touchedPiece.width * .5, y: collidedTargetObject.y + this.touchedPiece.height * .5, onComplete:this.placePieceInPuzzle, onCompleteParams:[collidedTargetObject]});
		} else {
			// ease piece to initial position
			TweenLite.to(this.touchedPiece, 0.4, {
				x: this.touchedPiece.initialPosition.x,
				y: this.touchedPiece.initialPosition.y
			});
			AudioPlayer.getInstance().playSound("negative", 0, Config.SPEAK_VOLUME_LEVEL);
		}
	}

	private placePieceInPuzzle = (collidedTarget:any):void => {
		let collidedTargetObject: TargetObject = collidedTarget as TargetObject;
		AudioPlayer.getInstance().playSound("positive", 0, Config.SPEAK_VOLUME_LEVEL);
		this.addChild(this.explosion);
		this.explosion.x = collidedTargetObject.x - collidedTargetObject.width * .5;
		this.explosion.y = collidedTargetObject.y - collidedTargetObject.height * .5;

		Logger.log("collidedTargetObject width / height == "+collidedTargetObject.width+" : "+collidedTargetObject.height)

		this.explosion.gotoAndPlay(1);
		this.slotsAvailable.push(new Point(collidedTargetObject.x, collidedTargetObject.y));
		collidedTargetObject.y = this.OFF_STAGE_POSITION.y;
		this.targetObjectsWaiting.push(collidedTargetObject);
		this.targetObjects.splice(this.targetObjects.indexOf(collidedTargetObject), 1);
		this.touchedPiece.y = this.OFF_STAGE_POSITION.y;
		if (this.targetObjects.length == 0) {
			this.onGameCompleted();
		} else {
			if (this.targetsPlaced <= this.piecesInPlace) {
				this.placeNextTarget();
			}
			this.spawnNextPiece();

			if (this.targetObjects.length == this.INIT_NUM_OF_TARGETOBJECTS - 1) {
				if(Config.currentSpeakSound != null) {
					AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
				}
				Config.currentSpeakSound = "mille_godt_klaret_kan_du_fjerne_en_mere";
				this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
			}
			// halfway through - encouraging speak
			if (this.targetObjects.length < this.INIT_NUM_OF_TARGETOBJECTS / 2 && !this.halfwayEncouragingSpeakDone) {
				if(Config.currentSpeakSound != null) {
					AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
				}
				Config.currentSpeakSound = "mille_super_flot";
				AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
				this.halfwayEncouragingSpeakDone = true;
			}
		}
	}

	private placeNextTarget(column:number = 0, row:number = 0, targetIndex:number = 0):void {
		let nextTarget:TargetObject = this.targetObjects[targetIndex];

		if(column > 0 && row > 0){
			nextTarget.x = this.GRID_POSITION.x + this.SQUARE_SIZE * (column - 1);
			nextTarget.y = this.GRID_POSITION.y + this.SQUARE_SIZE * (row - 1);
		}else{
			nextTarget.x = this.GRID_POSITION.x + this.SQUARE_SIZE * (Math.floor(Math.random() * 6));
			nextTarget.y = this.GRID_POSITION.y + this.SQUARE_SIZE * (Math.floor(Math.random() * 4));
		}
	}

	private spawnNextPiece():void {
		let randomTargetObject:TargetObject = this.targetObjects[Math.floor(Math.random() * this.targetObjects.length)];

		let nextPiece:Piece;
		switch(randomTargetObject.type) {
			case SoothingGameView.TYPE_1:
				nextPiece = this.piece_1;
				break;
			case SoothingGameView.TYPE_2:
				nextPiece = this.piece_2;
				break;
			case SoothingGameView.TYPE_3:
				nextPiece = this.piece_3;
				break;
			case SoothingGameView.TYPE_4:
				nextPiece = this.piece_4;
				break;
			default:
				break;
		}

		nextPiece.initialPosition = this.INITIAL_PIECE_POSITION;
		nextPiece.visible = true;
	}

	private checkTargetCollision(piece:Piece):TargetObject{
		let toReturn:TargetObject;
		let collidingTargetObjects:any[] = [];

		let targetObjectsLength:number = this.targetObjects.length;
		let hit: boolean;
		for (let i:number = 0; i < targetObjectsLength; i++) {
			let nextTarget:TargetObject = this.targetObjects[i];
			if(piece.type == nextTarget.type){
				hit = SpriteHelper.hitTest(piece.getBounds(), nextTarget.getBounds());
				if (hit) {
					collidingTargetObjects.push(nextTarget);
				}
			}
		}
		if(collidingTargetObjects.length > 0){
			let nearestTargetObject:TargetObject;
			let shortestDistance:number;
			for (let j:number = 0; j < collidingTargetObjects.length; j++) {
				let nextCollidingTarget:TargetObject = collidingTargetObjects[j];
				let distance:number = Helper.lineDistance(new Point(piece.x, piece.y), new Point(nextCollidingTarget.x, nextCollidingTarget.y));
				if(!shortestDistance || distance < shortestDistance){
					shortestDistance = distance;
					nearestTargetObject = nextCollidingTarget;
				}
			}
			toReturn = nearestTargetObject;
		}
		return toReturn;
	}

	private onGameCompleted = ():void => {
		if(Config.currentPatient.disease == Level.BURN){
			this.grid.alpha = 0;
			// this.background.alpha = 0;
		}

		if(Config.currentSpeakSound != null) {
			AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
		}
		Config.currentSpeakSound = "mille_wow_du_er_god";
		this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
		this.sndSpeak.on(AudioPlayer.AUDIO_COMPLETE, this.audioGameCompletedComplete);
	}

	private audioGameCompletedComplete = (event:Event):void => {
		this.sndSpeak.off(AudioPlayer.AUDIO_COMPLETE, this.audioGameCompletedComplete);
		this.emit(HospitalEvent.PATIENT_CURED);
		this.emit(HospitalEvent.MINIGAME_COMPLETED);
	}

	// private quitGame():void {
	// 	this.emit("backFromTestGame");
	// }

	public destroy():void {

        console.log("This Button is being destroyed");
		if(this.btnBack != null){
			this.btnBack.destroy();
			this.btnBack = null;
		}

		if(this.bgQuad != null) {
			this.removeChild(this.bgQuad);
			this.bgQuad = null;
		}

		if(this.background != null) {
			this.removeChild(this.background);
			this.background = null;
		}

		if(this.grid != null) {
			this.removeChild(this.grid);
			this.grid = null;
		}

		if(this.explosion != null) {
			this.removeChild(this.explosion);
			this.explosion = null;
		}

		if(Config.currentSpeakSound != null) {
			AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
		}

		for (let i:number = 0; i < this.pieces.length; i++) {
			let piece: Piece = this.pieces[i];
			piece.signalPiece.remove(this.pieceTouched);
			piece.signalPieceTouchDone.remove(this.touchDone);
		}
		 super.destroy();
	}
}
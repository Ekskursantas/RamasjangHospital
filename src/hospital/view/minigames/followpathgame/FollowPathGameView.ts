
import {HospitalGameView} from "../../HospitalGameView";
import {Config} from "../../../Config";
import {DraggableObject} from "./objects/DraggableObject";
import {ScoreBoard} from "./objects/ScoreBoard";
import {AssetLoader} from "../../../utils/AssetLoader";
import {HospitalEvent} from "../../../event/HospitalEvent";
import {Collectable} from "./objects/Collectable";
import {Obstacle} from "./objects/Obstacle";
import {Logger} from "../../../../loudmotion/utils/debug/Logger";
import {TouchEvent} from "../../../../loudmotion/events/TouchLoudEvent";
import {Touch} from "../../../../loudmotion/events/TouchLoud";
import {SpriteHelper} from "../../../../loudmotion/utils/SpriteHelper";
import {Point, Sprite, Graphics, Container, ticker, Texture} from "pixi.js";
import {BackBtn} from "../../buttons/BackBtn";
import {AudioPlayer} from "../../../../loudmotion/utils/AudioPlayer";
import Polygon = PIXI.Polygon;
import {Helper} from "../../../../loudmotion/utils/Helper";

declare var SVGGraphics:any;
declare var $:any;
// declare function drawSVG(graphics, content);

export class FollowPathGameView extends HospitalGameView {
	public static DRAGGABLE_OBJECT_TOUCH_OFFSET:number = 0;
	private static WALL_COLLISIONS_MAX:number = 2;
	private static NUM_OF_COLLECTABLES:number = 10;
	private static NUM_OF_OBSTACLES:number = 3;
	private static RESPAWN_TIME:number = 1000;

	private static ANIMATE_BACTERIA_INTERVAL:number = 200;

	private mazePosition:Point;
	
	private bg:Graphics;
	private maze:Sprite; //BitmapImage;
	private draggableObject:DraggableObject;
	
	private touch:Touch;

	private draggableObjectStartPosition:Point;
	private offsetPosition:Point;
	public btnBack:BackBtn;

	private collectables:Collectable[];
	private obstacles:Obstacle[];
	private collectablesCollected:number;
	
	private scoreBoard:ScoreBoard;

	private elapsed:number;
	private graphicsHitArea:Graphics;
	private previousInsideGraphicPoint:Point;

	private animateBacteriaTimer:number;
	private animateBacteriaInterval:number;

	private stage:Container;

	constructor() {
		super();
	}

	public init():void {
		this.onAddedToStage();
	}
	
	private onAddedToStage():void {
		this.name = "FollowPathGameView";

		this.animateBacteriaInterval = FollowPathGameView.ANIMATE_BACTERIA_INTERVAL;

		this.drawScene();

		let mazeX:number = Math.floor(AssetLoader.STAGE_WIDTH * .5 - this.maze.width * .5);
		this.mazePosition = new Point(mazeX, 0);

		this.drawCollectables();
		this.drawObstacles();

		this.maze.x = this.mazePosition.x;
		this.maze.y = this.mazePosition.y;

		this.draggableObjectStartPosition = new Point(this.mazePosition.x + 200, 130);
		this.draggableObject.x = this.draggableObjectStartPosition.x;
		this.draggableObject.y = this.draggableObjectStartPosition.y;
		this.previousInsideGraphicPoint = this.draggableObjectStartPosition;

		// setTimeout((): void => this.startGame(), 300);
		this.startGame();
	}
	
	private drawScene():void {
		Logger.log(this, " FollowPathGameView drawScene");
		this.bg = new Graphics();
		this.bg.beginFill(0xc1fdf1);
		this.addChild(this.bg);
		this.maze = Sprite.fromFrame("forgiftning_tarm");
		this.addChild(this.maze);

		this.graphicsHitArea = new PIXI.Graphics()
            .beginFill(0x00ffcc)
            .drawPolygon([ 914,86, 968,133, 1005,223, 712,305, 362,284, 609,87 ])
            .drawPolygon([ 301,610, 600,588, 804,734, 153,734, 197,663 ])
            .drawPolygon([ 727,544, 921,681, 804,734, 600,588 ])
            .drawPolygon([ 798,469, 983,600, 921,681, 727,544 ])
            .drawPolygon([ 808,362, 1005,223, 1014,362, 1002,547, 983,600, 798,469 ])
            .drawPolygon([ 93,463, 39,356, 362,284, 666,331, 606,415, 527,471, 337,525, 182,519 ])
            .drawPolygon([ 445,86, 407,146, 300,217, 39,356, 36,169, 72,91 ])
            .drawPolygon([ 771,313, 1005,223, 808,362 ])
            .drawPolygon([ 39,356, 93,463, 61,423 ])
            .drawPolygon([ 305,269, 39,356, 300,217 ])
            .drawPolygon([ 362,284, 39,356, 305,269 ])
            .drawPolygon([ 712,305, 1005,223, 771,313 ])
            .drawPolygon([ 362,284, 712,305, 666,331 ]);

		this.graphicsHitArea.alpha = HospitalGameView.RECT_COVER_ALPHA;
		this.maze.addChild(this.graphicsHitArea);

		this.bg.drawRect(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);

		this.draggableObject = new DraggableObject("forgiftning_kul");
		this.addChild(this.draggableObject);

		this.scoreBoard = new ScoreBoard(FollowPathGameView.NUM_OF_COLLECTABLES);
		this.addChild(this.scoreBoard);
		this.scoreBoard.x = AssetLoader.STAGE_WIDTH - this.scoreBoard.getWidth();

		this.btnBack = new BackBtn(this, HospitalEvent.BACK_FROM_MINIGAME);
	}

	private getInteriorPoint():Point{
		let pointToTry:Point;
		let pointWidth:number = this.maze.width;
		let pointHeight:number = this.maze.height;
		let checkInside:boolean;

		while(!checkInside){
			pointToTry = new Point(Helper.randomRange(this.maze.x, pointWidth), Helper.randomRange(this.maze.y + 150, pointHeight-20, true));
			checkInside = this.graphicsHitArea.containsPoint(pointToTry);
		}
		return pointToTry;
	}

	private drawCollectables():void {
		this.collectables = [];
		let pointToTry:Point;
		let collectableNew:Collectable;
		let texture:string;
		for (let i:number = 0; i < FollowPathGameView.NUM_OF_COLLECTABLES; i++) {
			pointToTry = this.getInteriorPoint();
			texture = "forgiftning_gift_0" + Math.ceil(Math.random() * 3);
			collectableNew = new Collectable(texture);
			collectableNew.x = pointToTry.x;
			collectableNew.y = pointToTry.y;
			this.maze.addChild(collectableNew);
			this.collectables.push(collectableNew);
		}
	}
	
	private drawObstacles():void {
		this.obstacles = [];
		let pointToTry:Point;
		let pointWidth:number = this.maze.width;
		let pointHeight:number = this.maze.height;
		for (let i:number = 0; i < FollowPathGameView.NUM_OF_OBSTACLES; i++) {
			pointToTry = this.getInteriorPoint();
			let texture:string = "forgiftning_forhindring_0" + Math.ceil(Math.random() * 2);
			let obstacleNew:Obstacle =  new Obstacle(texture);
			obstacleNew.x = pointToTry.x + this.mazePosition.x;
			obstacleNew.y = pointToTry.y;
			this.addChild(obstacleNew);
			this.obstacles.push(obstacleNew);
		}
	}
	
	private startGame():void {
		this.elapsed = 0.07;
		this.animateBacteriaTimer = 0;
		this.collectablesCollected = 0;
		if(this.draggableObject != null) {
			this.draggableObject.on(TouchEvent.TOUCH, this.touchDown);
			this.draggableObject.on(TouchEvent.TOUCH_MOVE, this.touchMove);
			this.draggableObject.on(TouchEvent.TOUCH_END, this.touchDone);
		}

		ticker.shared.add( this.onGameTick, this );

		Config.currentTimeout = setTimeout(():void => {
			if(Config.currentSpeakSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
			}
			if(Config.currentSpeakOverlappingViewsSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakOverlappingViewsSound);
			}
			Config.currentSpeakSound = "mille_brug_det_sorte_stykke_kul_til_at_samle_alle_de_gronne_bakterier";
			this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
		}, 1000);
	}

	private touchDown = (event:TouchEvent):void => {
		this.draggableObject.hitObstacle = false;
		let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
		let hit:boolean = this.graphicsHitArea.containsPoint(mousePositionCanvas);
		Logger.log(this, "touchDown  hit  == "+hit);
		this.offsetPosition = new Point(0, 0);
		if(hit){
			this.draggableObject.mouseDown = true;
			this.offsetPosition = new Point(this.draggableObject.x - mousePositionCanvas.x, this.draggableObject.y - mousePositionCanvas.y);
		}
	}

	private touchMove = (event:TouchEvent):void => {
		// Logger.log(this, "FollowPathGameView touchMove  event.type == "+event.type);
		if(this.draggableObject.mouseDown && !this.draggableObject.hitObstacle) {
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			let hit:boolean = this.graphicsHitArea.containsPoint(mousePositionCanvas);
			if(hit) {
				this.draggableObject.x = mousePositionCanvas.x + this.offsetPosition.x;
				this.draggableObject.y = mousePositionCanvas.y + this.offsetPosition.y;
				this.previousInsideGraphicPoint = mousePositionCanvas;
				this.checkCollectablesCollision();

				if (this.obstacleHit()) {
					AudioPlayer.getInstance().playSound("negative", 0, Config.SPEAK_VOLUME_LEVEL);

					// Back to start
					this.draggableObject.x = this.draggableObjectStartPosition.x;
					this.draggableObject.y = this.draggableObjectStartPosition.y;
					this.draggableObject.mouseDown = false;
					this.draggableObject.off(TouchEvent.TOUCH, this.touchDown);
					this.draggableObject.off(TouchEvent.TOUCH_MOVE, this.touchMove);
					this.draggableObject.off(TouchEvent.TOUCH_END, this.touchDone);
					setTimeout((): void => {
						if (this.draggableObject != null) {
							this.draggableObject.on(TouchEvent.TOUCH, this.touchDown);
							this.draggableObject.on(TouchEvent.TOUCH_MOVE, this.touchMove);
							this.draggableObject.on(TouchEvent.TOUCH_END, this.touchDone);
						}
					}, FollowPathGameView.RESPAWN_TIME);

					this.draggableObject.alpha = 0;
					TweenLite.to(this.draggableObject, FollowPathGameView.RESPAWN_TIME / 1000, {alpha: 1, delay:.1});
				}
			}else {
				this.draggableObject.mouseDown = false;
				this.draggableObject.x = this.previousInsideGraphicPoint.x;
				this.draggableObject.y = this.previousInsideGraphicPoint.y;
			}
		}
	}

	private touchDone = (event:TouchEvent):void => {
		this.draggableObject.mouseDown = false;
		let hit:boolean = this.graphicsHitArea.containsPoint(new Point(this.draggableObject.x, this.draggableObject.y));
		if(hit){

		}else {
			this.draggableObject.x = this.previousInsideGraphicPoint.x;
			this.draggableObject.y = this.previousInsideGraphicPoint.y;
		}
	}

	private obstacleHit():boolean {
		for (let i:number = 0; i < this.obstacles.length; i++) {
			let obstacle:Obstacle = this.obstacles[i];
			let hit:boolean = SpriteHelper.hitTest(this.draggableObject.bounds, obstacle.getBounds());
			if(hit){
				return true;
			}
		}
		return false;
	}

	private checkCollectablesCollision():void {
		for (let i:number = 0; i < this.collectables.length; i++) {
			let collectable:Collectable = this.collectables[i];
			if(!collectable.collected) {
				let hit: boolean = SpriteHelper.hitTest(this.draggableObject.bounds, collectable.getBounds());
				if (hit) {
					this.sndSpeak = AudioPlayer.getInstance().playSound("positive", 0, Config.SPEAK_VOLUME_LEVEL);

					this.draggableObject.addCollectable(collectable);
					collectable.x = Math.random() * this.draggableObject.bounds.width;
					collectable.y = Math.random() * this.draggableObject.bounds.height;
					collectable.collected = true;

					this.collectablesCollected++;
					this.scoreBoard.update(this.collectablesCollected);
					if (this.collectablesCollected == FollowPathGameView.NUM_OF_COLLECTABLES) {
						this.onGameCompleted();
					}
				}
			}
		}
	}
	
	
	private onGameTick = (deltaTime):void => {
		this.animateBacteriaTimer += this.elapsed * 1000;
		if (this.animateBacteriaTimer > this.animateBacteriaInterval) {
			this.animateObstacles();
			this.animateBacteriaTimer = 0;
		}
	}
	
	private animateObstacles():void {
		let obstacleToTrack:Obstacle;
		let obstaclesLength:number = this.obstacles.length;
		let pointToTry:Point; 
		for (let i:number = 0; i < obstaclesLength; i++) {
			obstacleToTrack = this.obstacles[i];
			pointToTry = new Point(obstacleToTrack.x + obstacleToTrack.speed * Math.cos(obstacleToTrack.direction), obstacleToTrack.y + obstacleToTrack.speed * Math.sin(obstacleToTrack.direction));

			let hit:boolean = this.graphicsHitArea.containsPoint(pointToTry);
			if(hit) {
				obstacleToTrack.x = pointToTry.x;
				obstacleToTrack.y = pointToTry.y;
			}else{
				obstacleToTrack.changeDirection();
				pointToTry = new Point(obstacleToTrack.x + obstacleToTrack.speed * Math.random() * Math.cos(obstacleToTrack.direction), obstacleToTrack.y + obstacleToTrack.speed * Math.random() * Math.sin(obstacleToTrack.direction));
			}
		}
	}
	
	private onGameCompleted = ():void => {
		if(Config.currentSpeakSound != null) {
			AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
		}
		Config.currentSpeakSound = "mille_super_flot";
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

	public destroy():void {
		Logger.log(this, "FollowPathGameView destroy");
		ticker.shared.remove( this.onGameTick, this );

		if(this.btnBack != null){
			this.btnBack.destroy();
			this.btnBack = null;
		}

		if(this.bg != null){
			this.removeChild(this.bg);
			this.bg = null;
		}

		if(this.draggableObject != null) {
			this.draggableObject.off(TouchEvent.TOUCH, this.touchDown);
			this.draggableObject.off(TouchEvent.TOUCH_MOVE, this.touchMove);
			this.draggableObject.off(TouchEvent.TOUCH_END, this.touchDone);
			this.removeChild(this.draggableObject);
			this.draggableObject.destroy();
			this.draggableObject = null;
		}

		if(this.scoreBoard != null) {
			this.removeChild(this.scoreBoard);
			this.scoreBoard.destroy();
			this.scoreBoard = null;
		}

		if(this.collectables.length > 0){
			for (let i:number = 0; i < this.collectables.length; i++) {
				try{
					let collectable:Collectable = this.collectables[i];
					this.maze.removeChild(collectable);
					collectable.destroy();
					collectable = null;
				} catch (error) {
					Logger.log(this, "CATCH this.removeChild(collectable)");
				}
			}
			this.collectables = null;
		}

		if(this.obstacles.length > 0){
			for (let i:number = 0; i < this.obstacles.length; i++) {
				try{
					let obstacle:Obstacle = this.obstacles[i];
					this.maze.removeChild(obstacle);
					obstacle.destroy();
					obstacle = null;
				} catch (error) {
					Logger.log(this, "CATCH this.removeChild(obstacle)");
				}
			}
			this.obstacles = null;
		}

		if(this.maze != null){
			this.removeChild(this.maze);
			this.maze = null;
		}

		try {
			if(Config.currentSpeakSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
			}
			Logger.log("FollowPathGameView AudioPlayer.getInstance().stopSound(Config.currentSpeakSound)");
		} catch (error) {
			Logger.log("ERROR : FollowPathGameView stopSound(Config.currentSpeakSound)");
		}
		super.destroy();

	}
}
import {PenicillinJar} from "./objects/PenicillinJar";
import {HospitalGameView} from "../../HospitalGameView";
import { Bacterium } from "./objects/Bacterium";
import { Main } from "../../../../Main";
import {AssetLoader} from "../../../utils/AssetLoader";
import {Config} from "../../../Config";
import {HospitalEvent} from "../../../event/HospitalEvent";
import {ButtonEvent} from "../../../event/ButtonEvent";
import {TouchEvent} from "../../../../loudmotion/events/TouchLoudEvent";
import {Logger} from "../../../../loudmotion/utils/debug/Logger";
import {Sprite, Point, Graphics, Container, Texture, extras, ticker} from "pixi.js";
import {BackBtn} from "../../buttons/BackBtn";
import {SpriteHelper} from "../../../../loudmotion/utils/SpriteHelper";
import {AudioPlayer} from "../../../../loudmotion/utils/AudioPlayer";
import {Level} from "../../../vo/Level";
import {Helper} from "../../../../loudmotion/utils/Helper";

export class ShootBacteriaGameView extends HospitalGameView {
	private static BACTERIA_SPLIT_INTERVAL:number = 14000;
	private static ANIMATE_BACTERIA_INTERVAL:number = 200;

	private BACTERIA_POOL_SIZE:number = 30;
	private INITIAL_NUMBER_OF_BACTERIA:number = 2; //6;
	private PENICILLIN_SHOTS_PER_DIP:number = 5;

	private bacteria:Bacterium[]; //Vector.<Bacterium>;
	private bacteriaWaiting:Bacterium[]; //Vector.<Bacterium>;
	private bacteriaToAnimate:Bacterium[]; //Vector.<Bacterium>;

	private lungs:Sprite; //BitmapImage;
	private lungsPosition:Point;

	private penicillinJar:PenicillinJar;

	public btnBack:BackBtn;

	private bg:Graphics; //Quad;

	private timePrevious:number;
	private timeCurrent:number;
	private elapsed:number;

	private shotsOfPenicillin:number;

	private explosion:extras.AnimatedSprite;

	private bacteriaSplitTimer:number;
	private bacteriaSplitInterval:number;

	private animateBacteriaTimer:number;
	private animateBacteriaInterval:number;
	private bacteriaHitCounter:number;
	private touchedBacterium:Bacterium;

	private stage:Container;
	private graphicsHitArea:Graphics;


	constructor () {
		super();
	}

	public init():void {
		this.name = "ShootBacteriaGameView";
		this.onAddedToStage();
	}

	private onAddedToStage():void {

		this.elapsed = 0;
		this.animateBacteriaTimer = 0;
		this.animateBacteriaInterval = 0;

		this.drawScene();
		this.startGame();
	}

	private drawScene():void {
		this.bg = new Graphics();
		this.bg.beginFill(0xc1fdf1);
		this.bg.drawRect(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
		this.addChild(this.bg);

		this.penicillinJar = new PenicillinJar();
		this.penicillinJar.x = Math.floor(AssetLoader.STAGE_WIDTH * .5 + this.penicillinJar.width + 20);
		this.penicillinJar.y = 100;
		this.addChild(this.penicillinJar);
        try {
            this.lungs = PIXI.Sprite.fromImage(Main.ASSETS["media/hospital/assets/textures/1x/lungebetaendelse_lunger.png"]);
        } catch (e) {
            console.log(e);
            this.lungs = Main.ASSETS["media/hospital/assets/textures/1x/lungebetaendelse_lunger.png"];
        }
		this.addChild(this.lungs);
		this.lungs.x = Math.floor(AssetLoader.STAGE_WIDTH * .5 - this.lungs.width * .5 - this.penicillinJar.width * .5);
		this.lungsPosition = new Point(this.lungs.x, this.lungs.y);

		// let mazePositionRect:Graphics = new Graphics();
		// mazePositionRect.beginFill(0x06a484);
		// let width:number = this.lungs.width;
		// let height:number = this.lungs.height;
		// mazePositionRect.drawRect(0, 0, width, height);
		// this.lungs.addChild(mazePositionRect);
		// mazePositionRect.alpha = HospitalGameView.RECT_COVER_ALPHA;

		this.graphicsHitArea = new PIXI.Graphics()
            .beginFill(0x00ffcc)
            .drawPolygon([ 511,170, 572,208, 627,295, 663,438, 675,598, 649,703, 407,252, 446,158 ])
            .drawPolygon([ 263,165, 291,236, 55,671, 12,482, 26,357, 126,197, 203,142, 230,140 ])
            .drawPolygon([ 105,699, 55,671, 291,236, 310,303, 319,420, 297,557 ])
            .drawPolygon([ 390,543, 384,453, 384,372, 395,296, 649,703, 625,723, 457,650, 415,617 ])
            .drawPolygon([ 360,169, 329,173, 324,0, 358,0 ])
            .drawPolygon([ 360,169, 394,250, 348,252, 306,240, 329,173 ])
            .drawPolygon([ 291,236, 348,252, 310,303 ])
            .drawPolygon([ 395,296, 407,252, 649,703 ])
            .drawPolygon([ 348,252, 394,250, 407,252, 395,296 ]);

		this.graphicsHitArea.alpha = HospitalGameView.RECT_COVER_ALPHA;
		this.lungs.addChild(this.graphicsHitArea);

		let frames = [];
		for (let i = 1; i < 9; i++) {
			let val = i < 10 ? '0' + i : i;
			// magically works since the spritesheet was loaded with the pixi loader
			frames.push(Texture.fromFrame('lungebetaendelse_ani_explosion_00' + val));
		}
		// create an AnimatedSprite (brings back memories from the days of Flash, right ?)
		this.explosion = new extras.AnimatedSprite(frames);
		this.explosion.loop = false;
		this.explosion.animationSpeed = .5;
		this.explosion.onComplete = ():void => {
			this.onExplosionComplete();
			this.touchedBacterium.x = 200;
			this.touchedBacterium.y = AssetLoader.STAGE_HEIGHT + 500;
		}

		this.btnBack = new BackBtn(this, HospitalEvent.BACK_FROM_MINIGAME);
	}

	private getInteriorPoint():Point{
		let pointToTry:Point;
		let pointWidth:number = this.lungs.width;
		let pointHeight:number = this.lungs.height;
		let checkInside:boolean;

		while(!checkInside){
			pointToTry = new Point(Helper.randomRange(0, pointWidth), Helper.randomRange(0, pointHeight, true));
			checkInside = this.graphicsHitArea.containsPoint(pointToTry);

			// let tryPositionRect:Graphics = new Graphics(); //TODO for testing
			// tryPositionRect.beginFill(0xFFFFFF);
			// let widthTry:number = 16;
			// tryPositionRect.drawRect(pointToTry.x, pointToTry.y, widthTry, widthTry);
			// tryPositionRect.pivot.x = widthTry * .5;
			// tryPositionRect.pivot.y = widthTry * .5;
			// this.lungs.addChild(tryPositionRect);
		}
		return pointToTry;
	}

	private createBacteria(numOfBacteria:number):void {
		let pointToTry:Point;
		let bacterium:Bacterium;
		let pointWidth:number = this.lungs.width;
		let pointHeight:number = this.lungs.height;
		for (let i:number = 0; i < numOfBacteria; i++) {
			pointToTry = this.getInteriorPoint();
			bacterium = this.bacteriaWaiting.shift();
			bacterium.on(TouchEvent.TOUCH, this.onBacteriumTouch);
			bacterium.x = pointToTry.x + this.lungsPosition.x;
			bacterium.y = pointToTry.y;
			this.addChild(bacterium);
			bacterium.signalPiece.add(this.bacteriumTouched);
			this.bacteriaToAnimate.push(bacterium);
		}
	}

	private startGame():void {
		this.bacteriaHitCounter = 0;
		this.bacteriaWaiting = []; //new Vector.<Bacterium>();
		this.bacteriaToAnimate = []; //new Vector.<Bacterium>();

		// Create pool of bacteria
		for (let i:number = 0; i < this.BACTERIA_POOL_SIZE; i++) {
			let bacterium:Bacterium = new Bacterium();
			this.bacteriaWaiting.push(bacterium);
		}

		this.createBacteria(this.INITIAL_NUMBER_OF_BACTERIA);
		this.penicillinJar.on(TouchEvent.TOUCH, this.onPenicillinJarTouch);
		this.timeCurrent = 0;
		ticker.shared.add( this.onGameTick, this ); //TODO ADD BACK
		this.shotsOfPenicillin = 0;
		this.penicillinJar.highlight();

		this.bacteriaSplitTimer = 0;
		this.bacteriaSplitInterval = ShootBacteriaGameView.BACTERIA_SPLIT_INTERVAL;

		this.animateBacteriaTimer = 0;
		this.animateBacteriaInterval = ShootBacteriaGameView.ANIMATE_BACTERIA_INTERVAL;

		Config.currentTimeout = setTimeout(():void => { //TODO sound
			if(Config.currentSpeakSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
			}
			if(Config.currentSpeakOverlappingViewsSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakOverlappingViewsSound);
			}

			Config.currentSpeakSound = "mille_tryk_pa_skalen";
			if(Config.currentSpeakSound != null) {
				this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
			}
		}, 1000);
	}

	private bacteriumTouched = (data:any):void => {
		this.touchedBacterium = null;
		if (this.shotsOfPenicillin > 0) {
			this.touchedBacterium = data as Bacterium;
		}
	}

	private onGameTick = (deltaTime):void => {
		this.timePrevious = this.timeCurrent;
		this.timeCurrent = new Date().getTime();
		this.elapsed = (this.timeCurrent - this.timePrevious) * 0.001;

		this.animateBacteria();
		this.splitBacteria();
	}

	private splitBacteria():void {
		if(this.bacteriaWaiting.length == 0 || this.bacteriaToAnimate.length == 0 ){

		}else{
			this.bacteriaSplitTimer += this.elapsed * 1000;
			if (this.bacteriaSplitTimer > this.bacteriaSplitInterval) {
				let itemNum:number = Helper.randomRange(0, this.bacteriaToAnimate.length-1, true);
				let bacteriaToSplit:Bacterium = this.bacteriaToAnimate[itemNum];
				if(bacteriaToSplit != null && bacteriaToSplit.state == Bacterium.NOT_TOUCHED) {
					// only split if bacterium has not been touched with penicillin
					// Play split animation
					// TweenLite.to(bacteriaToSplit, 0.2, {x: "+=20", delay: .5});
					TweenLite.to(bacteriaToSplit.scale, 0.5, {
						x: 2, y: 2, ease: Linear.easeNone, onComplete: () => {
							bacteriaToSplit.scale.x = bacteriaToSplit.scale.y = 1;
							AudioPlayer.getInstance().playSound("lung_split", 0, Config.EFFECTS_VOLUME_LEVEL);
							let newBacterium: Bacterium = this.bacteriaWaiting.shift();
							newBacterium.x = bacteriaToSplit.x;
							newBacterium.y = bacteriaToSplit.y;
							this.addChild(newBacterium);
							newBacterium.on(TouchEvent.TOUCH, this.onBacteriumTouch);
							newBacterium.signalPiece.add(this.bacteriumTouched);
							this.bacteriaToAnimate.push(newBacterium);
						}
					});
				}
				this.bacteriaSplitTimer = 0;
			}
		}
	}

	private animateBacteria():void {
		let obstacleToTrack:Bacterium;
		let obstaclesLength:number = this.bacteriaToAnimate.length;
		let pointToTry:Point;
		for (let i:number = 0; i < obstaclesLength; i++) {
			obstacleToTrack = this.bacteriaToAnimate[i];
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

	private onExplosionComplete = ():void => {
		this.removeChild(this.explosion);
	}

	private onBacteriumTouch = (event:TouchEvent):void => {
		if(this.touchedBacterium != null) {
			if (this.shotsOfPenicillin > 0) {
				this.touchedBacterium.receiveTouch();
				if (this.touchedBacterium.state == Bacterium.DEAD) {
					AudioPlayer.getInstance().playSound("lung_die", 0, Config.SPEAK_VOLUME_LEVEL);

					let bacteriumIndex: number = this.bacteriaToAnimate.indexOf(this.touchedBacterium);
					this.touchedBacterium.off(TouchEvent.TOUCH, this.onBacteriumTouch);
					this.touchedBacterium.signalPiece.remove(this.bacteriumTouched);

					this.bacteriaToAnimate.splice(bacteriumIndex, 1);
					this.bacteriaWaiting.push(this.touchedBacterium);

					this.addChild(this.explosion);
					this.explosion.x = this.touchedBacterium.x - this.touchedBacterium.bounds.width;
					this.explosion.y = this.touchedBacterium.y - this.touchedBacterium.bounds.height;
					this.explosion.gotoAndPlay(1);

					// Remove bacterium from stage
					this.touchedBacterium.y = AssetLoader.STAGE_HEIGHT + 500;
					this.touchedBacterium.reInit();

					// 				// check if this was the last bacterium
					if (this.bacteriaToAnimate.length < 1) {
						this.onGameCompleted();
					}
				} else {
					AudioPlayer.getInstance().playSound("lung_hit", 0, Config.SPEAK_VOLUME_LEVEL);
				}

				if (this.shotsOfPenicillin == 0) {
					this.penicillinJar.highlight();
				}

				if (this.bacteriaHitCounter > 8) { //TODO hardcoded counter?
					if (Config.currentSpeakSound != null) {
						AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
					}
					Config.currentSpeakSound = "mille_mega_sejt";
					this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
					this.bacteriaHitCounter = 0;
				}
				this.bacteriaHitCounter++;
			}
		}
	}

	private onPenicillinJarTouch = (event:TouchEvent):void => {
		this.penicillinJar.stopHighlighting();
		this.penicillinJar.showFingerDipped();
		this.shotsOfPenicillin = this.PENICILLIN_SHOTS_PER_DIP;
	}

	private onGameCompleted = ():void => {
		ticker.shared.remove( this.onGameTick, this );
		Config.currentPatient.disease = Level.PNEUMONIA;

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

	public destroy():void {
		if(ticker != null) {
			ticker.shared.remove(this.onGameTick, this);
		}

		if(this.btnBack != null){
			this.btnBack.destroy();
			this.btnBack = null;
		}

		if(this.explosion != null) {
			this.removeChild(this.explosion);
			this.explosion = null;
		}

		if(this.bg != null) {
			this.removeChild(this.bg);
			this.bg = null;
		}

		if(this.lungs != null) {
			this.removeChild(this.lungs);
			this.lungs = null;
		}

        try {
            this.lungs = PIXI.Sprite.fromImage(Main.ASSETS["media/hospital/assets/textures/1x/lungebetaendelse_lunger.png"]);
        } catch (e) {
            console.log(e);
            this.lungs = Main.ASSETS["media/hospital/assets/textures/1x/lungebetaendelse_lunger.png"];
        }
		this.addChild(this.lungs);
		this.lungs.x = Math.floor(AssetLoader.STAGE_WIDTH * .5 - this.lungs.width * .5 - this.penicillinJar.width * .5);
		this.lungsPosition = new Point(this.lungs.x, this.lungs.y);

		if(this.bacteriaWaiting != null) {
			if (this.bacteriaWaiting.length > 0) {
				for (let i: number = 0; i < this.bacteriaWaiting.length; i++) {
					try {
						let bacteriaWait: Bacterium = this.bacteriaWaiting[i];
						bacteriaWait.off(TouchEvent.TOUCH, this.onBacteriumTouch);
						this.removeChild(bacteriaWait);
					} catch (error) {
						Logger.log(this, "CATCH this.removeChild(bacteriaWait)");
					}
				}
				this.bacteriaWaiting = null;
			}
		}

		if(this.bacteriaToAnimate != null) {
			if (this.bacteriaToAnimate.length > 0) {
				for (let i: number = 0; i < this.bacteriaToAnimate.length; i++) {
					try {
						let bacteriaTo: Bacterium = this.bacteriaToAnimate[i];
						bacteriaTo.signalPiece.remove(this.bacteriumTouched);
						this.removeChild(bacteriaTo);
					} catch (error) {
						Logger.log(this, "CATCH this.removeChild(bacteriaTo)");
					}
				}
				this.bacteriaToAnimate = null;
			}
		}

		if(this.penicillinJar != null) {
			this.removeChild(this.penicillinJar);
			this.penicillinJar.destroy();
			this.penicillinJar = null;
		}

		if(Config.currentSpeakSound != null) {
			AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
		}
		super.destroy();
	}
}
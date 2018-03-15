
import {AssetLoader} from "../../../../utils/AssetLoader";
import {CremeBlob} from "./CremeBlob";
import {TouchEvent} from "../../../../../loudmotion/events/TouchLoudEvent";
import {Touch} from "../../../../../loudmotion/events/TouchLoud";
import {SpriteHelper} from "../../../../../loudmotion/utils/SpriteHelper";
import {Sprite, Container, ticker, Point, Graphics} from "pixi.js";
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";
import {AudioPlayer} from "../../../../../loudmotion/utils/AudioPlayer";
import {Config} from "../../../../Config";
import {HospitalGameView} from "../../../HospitalGameView";

export class CremeTube extends Sprite {
	// private sndMan:SoundManager;

	private static CREME_ROTATION:number = (60 * (Math.PI / 180));
	private static ALPHA_MINIMUM:number = 0.1;

	private tubeImage:Sprite;
	private touch:Touch;
	// private sprayingTimer:any; //Timer;
	private cremeBlobsPool:CremeBlob[]; //Vector.<CremeBlob>;
	private blobsToAnimate:CremeBlob[]; //Vector.<CremeBlob>;
	private creamTarget:Sprite;
	private contaminatedArea:Sprite;
	private contaminatedAreas:Sprite[]; //Vector.<Sprite>;

	private sprayingStopped:boolean;
	private contaminatedAreaRemovedCallback:Function;

	private timePrevious:number;
	private timeCurrent:number;
	private elapsed:number;

	private stage:Container;
	private mouseDown:boolean;
	private rectCover:Graphics;


	constructor(contaminatedAreas:Sprite[], contaminatedAreaRemovedCallback:Function) {
		super();
        
		this.interactive = true;
		this.buttonMode = true;
		this.contaminatedAreas = contaminatedAreas;
		this.contaminatedAreaRemovedCallback = contaminatedAreaRemovedCallback;
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.createTubeArt();

		this.cremeBlobsPool = []; //new Vector.<CremeBlob>();
		for (let i:number = 0; i < 200; i++) {
			let blob:CremeBlob = new CremeBlob();
			this.cremeBlobsPool.push(blob);
			this.creamTarget.addChild(blob);
			blob.x = -2000;
		}
		this.blobsToAnimate = []; //new Vector.<CremeBlob>();

		this.on(TouchEvent.TOUCH, this.touchDown);
		this.on(TouchEvent.TOUCH_END, this.touchDone);
		this.on(TouchEvent.TOUCH_MOVE, this.touchMove);
	}

	public get width():number{
		return this.tubeImage.width;
	}

	public get height():number{
		return this.tubeImage.height;
	}

	// public setPivotXY(amt:number = .5):void{
	// 	this.pivot.set(this.tubeImage.width * amt, this.tubeImage.height * amt);
	// }

	private onEnterFrame = (deltaTime):void => {
		this.checkElapsed();
	}

	protected onSprayingTimer = (deltaTime):void => {
		Logger.log(this, "CremeTube onSprayingTimer   this.cremeBlobsPool.length ==== "+this.cremeBlobsPool.length);
		if(this.cremeBlobsPool.length > 0) {
			let nextBlob: CremeBlob = this.cremeBlobsPool.shift();

			nextBlob.x = -50;
			nextBlob.y = -50;
			nextBlob.rotation = (Math.random() * 360 * (Math.PI / 180));

			this.creamTarget.addChild(nextBlob);
			this.blobsToAnimate.push(nextBlob);
			this.checkCollisionWithContaminatedAreas(nextBlob);
		}
	}

	private checkCollisionWithContaminatedAreas(blob:CremeBlob):void {
		let contaminatedAreasLength:number = this.contaminatedAreas.length;
		for (let i:number = 0; i < contaminatedAreasLength; i++) {
			let currentContaminatedArea:Sprite = this.contaminatedAreas[i];
			if(currentContaminatedArea.alpha > (CremeTube.ALPHA_MINIMUM - .03)) {
				let hit:boolean = SpriteHelper.hitTest(blob.getBounds(), currentContaminatedArea.getBounds());
				if (hit) {
					this.contaminatedArea = currentContaminatedArea;
					this.contaminatedArea.alpha -= 0.02;
				}
			}
		}
	}

	private animateBlops = (deltaTime):void => {
		let blobsToAnimateLength:number = this.blobsToAnimate.length;
		if(this.sprayingStopped && blobsToAnimateLength == 0){
			ticker.shared.remove( this.animateBlops, this );
		}else {

			for (let i: number = blobsToAnimateLength - 1; i >= 0; i--) {
				let nextBlob:CremeBlob = this.blobsToAnimate[i];
				nextBlob.alpha -= this.elapsed * 5;
				if (nextBlob.alpha > 0.7) { //TODO add back
					nextBlob.scale.x = nextBlob.scale.y += this.elapsed * 3;
				} else {
					nextBlob.scale.x = nextBlob.scale.y -= this.elapsed * 3;
				}
				if (nextBlob.alpha <= 0) {
					this.blobsToAnimate.splice(i, 1);
					this.cremeBlobsPool.push(nextBlob);
					nextBlob.x = -2000;
					nextBlob.alpha = 1;
					nextBlob.scale.x = nextBlob.scale.y = 1;
				}
			}
		}
	}

	private touchDown = (event:TouchEvent):void => {
		this.mouseDown = true;
		Logger.log(this, "CremeTube touchDown");
		let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
		this.x = mousePositionCanvas.x;
		this.y = mousePositionCanvas.y;

		this.startSpraying();

		try{
			ticker.shared.remove( this.animateBlops, this );
		} catch (error) {
			Logger.log(this, "CATCH CremeTube ticker.shared.remove( this.animateBlops, this )");
		}

		ticker.shared.add( this.animateBlops, this );
	}

	private touchMove = (event:TouchEvent):void => {
		if(this.mouseDown) {
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);

			this.x = Math.abs(mousePositionCanvas.x);
			this.y = Math.abs(mousePositionCanvas.y);
		}
	}

	private touchDone = (event:TouchEvent):void => {
		this.mouseDown = false;
		this.stopSpraying();

		if(this.allContaminatedAreasRemoved()){
			Logger.log(this, "CremeTube allContaminatedAreasRemoved *****************************");
			ticker.shared.remove( this.onSprayingTimer, this );

			this.off(TouchEvent.TOUCH, this.touchDown);
			this.off(TouchEvent.TOUCH_END, this.touchDone);
			this.off(TouchEvent.TOUCH_MOVE, this.touchMove);

			AudioPlayer.getInstance().stopSound("salve_loop");

			if(this.contaminatedAreaRemovedCallback != null) {
				this.contaminatedAreaRemovedCallback();
				this.contaminatedAreaRemovedCallback = null;
			}
		}

	}

	private allContaminatedAreasRemoved():boolean {
		let toReturn:boolean = true;
		let contaminatedAreasLength:number = this.contaminatedAreas.length;
		for (let i:number = 0; i < contaminatedAreasLength; i++) {
			let currentContaminatedArea:Sprite = this.contaminatedAreas[i];
			if (currentContaminatedArea.alpha > CremeTube.ALPHA_MINIMUM) {
				toReturn = false;
			}
		}
		return toReturn;
	}

	private startSpraying():void {
		try{
			ticker.shared.remove( this.onEnterFrame, this );
			ticker.shared.remove( this.onSprayingTimer, this );
		} catch (error) {
			Logger.log(this, "CATCH ticker.shared.remove( this.onEnterFrame, this )");
		}

		ticker.shared.add( this.onEnterFrame, this );
		ticker.shared.add( this.onSprayingTimer, this );
		this.sprayingStopped = false;
		AudioPlayer.getInstance().playSound("salve_loop", 0, Config.SPEAK_VOLUME_LEVEL);
	}

	private stopSpraying():void {
		ticker.shared.remove( this.onEnterFrame, this ); //TODO temp taken out
		ticker.shared.remove( this.onSprayingTimer, this );
		this.sprayingStopped = true;
		AudioPlayer.getInstance().stopSound("salve_loop");
	}

	private createTubeArt():void {


		this.tubeImage = Sprite.fromFrame("insektstik_tube");
		this.addChild(this.tubeImage);

		this.pivot.x = this.tubeImage.width * .5;
		this.pivot.y = this.tubeImage.height * .5;

		this.rectCover = new Graphics(); //TODO temp to check area
		this.rectCover.beginFill(0xFFFFFF);
		this.rectCover.alpha = HospitalGameView.RECT_COVER_ALPHA;
		this.addChild(this.rectCover);
		this.rectCover.drawRect(this.tubeImage.x, this.tubeImage.y, this.tubeImage.width, this.tubeImage.height);

		this.rotation = CremeTube.CREME_ROTATION;

		this.creamTarget = new Sprite();
		// this.addChild(this.creamTarget);
		this.tubeImage.addChild(this.creamTarget);
		this.creamTarget.y += this.tubeImage.height * .5 + 30;

		this.x = 630;
		this.y = 700;
	}

	private checkElapsed():void {
		this.timePrevious = this.timeCurrent;
		this.timeCurrent = new Date().getTime();
		this.elapsed = (this.timeCurrent - this.timePrevious) * 0.0005;
	}

	public destroy():void{
		this.off(TouchEvent.TOUCH, this.touchDown);
		this.off(TouchEvent.TOUCH_MOVE, this.touchMove);
		this.off(TouchEvent.TOUCH_END, this.touchDone);

		try{
			ticker.shared.remove( this.onEnterFrame, this );
			ticker.shared.remove( this.onSprayingTimer, this );
		} catch (error) {
			Logger.log(this, "CATCH ticker.shared.remove( this.onEnterFrame, this )");
		}

		try{
			ticker.shared.remove( this.animateBlops, this );
		} catch (error) {
			Logger.log(this, "CATCH CremeTube ticker.shared.remove( this.animateBlops, this )");
		}

		if(this.tubeImage != null) {
			if(this.creamTarget != null) {
				this.tubeImage.removeChild(this.creamTarget);
				this.creamTarget = null;
			}
			this.removeChild(this.tubeImage);
			this.tubeImage = null;
		}

		if(this.rectCover != null) {
			this.removeChild(this.rectCover);
			this.rectCover = null;
		}

		if(this.contaminatedAreaRemovedCallback != null) {
			this.contaminatedAreaRemovedCallback();
			this.contaminatedAreaRemovedCallback = null;
		}

	}

}
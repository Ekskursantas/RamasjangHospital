import {AssetLoader} from "../../../../utils/AssetLoader";
import {TouchEvent} from "../../../../../loudmotion/events/TouchLoudEvent";
import {Touch} from "../../../../../loudmotion/events/TouchLoud";
import {SpriteHelper} from "../../../../../loudmotion/utils/SpriteHelper";
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";
import {HospitalEvent} from "../../../../event/HospitalEvent";
import {Sprite, Graphics, Point, Container, Rectangle} from "pixi.js";
import {AudioPlayer} from "../../../../../loudmotion/utils/AudioPlayer";
import {Signal} from "signals.js";
import {MainView} from "../../../MainView";
import {Config} from "../../../../Config";
import {Helper} from "../../../../../loudmotion/utils/Helper";
import {HospitalGameView} from "../../../HospitalGameView";

export class Tweezers extends Sprite {
	private static TWEEZER_TOP_OPEN_ROTATION:number = -20 * (Math.PI / 180);
	private static TWEEZER_BOTTOM_OPEN_ROTATION:number = 20 * (Math.PI / 180);

	private static TWEEZER_ROTATION:number = (120 * (Math.PI / 180));

	public static IDLE:string = "idle";
	public static PLACED:string = "placed";
	public static CLOSED:string = "closed";
	public static DISABLED:string = "disabled";

	private _state:string;
	private tweezerTop:Sprite;
	private tweezerBottom:Sprite;

	private touchAreaAll:Graphics; //Quad;
	private touchAreaTop:Graphics; //Quad;
	private touchAreaBottom:Graphics; //Quad;

	private touchAll:Touch;
	private lastTouchXAll:number;
	private previousTouchXAll:number;

	private touchTop:Touch;
	private lastTouchYTop:number;
	private previousTouchYTop:number;

	private touchBottom:Touch;
	private lastTouchYBottom:number;
	private previousTouchYBottom:number;

	private _target:Sprite;
	private _targetArea:Sprite;
	private _targets:Sprite[]; //Vector.<Sprite>;
	private _targetAreas:Sprite[]; //Vector.<Sprite>;
	private targetStartingPoint:Point;
	private pinchingPoint:Point;
	private pinchingTarget:Graphics;

	private stage:Container;
	private tweezerTopImage:Sprite;
	private tweezerBottomImage:Sprite;
	private allAreaIdleMouseDown:boolean;
	private allAreaClosedMouseDown:boolean;
	private topAreaMouseDown:boolean;
	private bottomAreaMouseDown:boolean;
	private currentTargetIndex:number;

	constructor () {
		super();
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.createTweezersArt();
		this.pinchingPoint = new Point(this.tweezerTopImage.width * .9, -this.tweezerTopImage.height * .2);
		this.pinchingTarget = new Graphics();
		this.pinchingTarget.drawRect(this.pinchingPoint.x, this.pinchingPoint.y, 60, 100);
		this.pinchingTarget.pivot.x = this.pinchingTarget.width * .5;
		this.pinchingTarget.pivot.y = this.pinchingTarget.height * .5;

		this.pinchingTarget.beginFill(0x999999);
		this.pinchingTarget.alpha = HospitalGameView.RECT_COVER_ALPHA;
		this.addChild(this.pinchingTarget);
	}

	public get targets():Sprite[] {
		return this._targets;
	}

	public set targets(value:Sprite[]) {
		this._targets = value;
	}

	public set targetAreas(value:Sprite[]) {
		this._targetAreas = value;
	}


	public set target(value:Sprite) {
		this._target = value;
		this.targetStartingPoint = new Point(this._target.x, this._target.y);
	}

	public get state():string {
		return this._state;
	}

	public set state(value:string) {
		this._state = value;
		this.allAreaIdleMouseDown = false;
		this.allAreaClosedMouseDown = false;
		this.topAreaMouseDown = false;
		this.bottomAreaMouseDown = false;

		switch(this._state) {
			case Tweezers.IDLE:
				this.touchAreaTop.visible = this.touchAreaBottom.visible = false;
				this.touchAreaTop.off(TouchEvent.TOUCH, this.topAreaTouchDown);
				this.touchAreaTop.off(TouchEvent.TOUCH_MOVE, this.topAreaTouchMove);
				this.touchAreaTop.off(TouchEvent.TOUCH_END, this.topAreaTouchDone);

				this.touchAreaBottom.off(TouchEvent.TOUCH, this.bottomAreaTouchDown);
				this.touchAreaBottom.off(TouchEvent.TOUCH_MOVE, this.bottomAreaTouchMove);
				this.touchAreaBottom.off(TouchEvent.TOUCH_END, this.bottomAreaTouchDone);

				this.touchAreaAll.visible = true;
				this.touchAreaAll.off(TouchEvent.TOUCH, this.allAreaTouchClosedDown);
				this.touchAreaAll.off(TouchEvent.TOUCH_MOVE, this.allAreaTouchClosedMove);
				this.touchAreaAll.off(TouchEvent.TOUCH_END, this.allAreaTouchClosedDone);

				this.touchAreaAll.on(TouchEvent.TOUCH, this.allAreaTouchIdleDown);
				this.touchAreaAll.on(TouchEvent.TOUCH_MOVE, this.allAreaTouchIdleMove);
				this.touchAreaAll.on(TouchEvent.TOUCH_END, this.allAreaTouchIdleDone);

				break;

			case Tweezers.PLACED:
				this.touchAreaTop.visible = this.touchAreaBottom.visible = true;
				this.touchAreaTop.on(TouchEvent.TOUCH, this.topAreaTouchDown);
				this.touchAreaTop.on(TouchEvent.TOUCH_MOVE, this.topAreaTouchMove);
				this.touchAreaTop.on(TouchEvent.TOUCH_END, this.topAreaTouchDone);

				this.touchAreaBottom.on(TouchEvent.TOUCH, this.bottomAreaTouchDown);
				this.touchAreaBottom.on(TouchEvent.TOUCH_MOVE, this.bottomAreaTouchMove);
				this.touchAreaBottom.on(TouchEvent.TOUCH_END, this.bottomAreaTouchDone);

				this.touchAreaAll.visible = false;
				this.touchAreaAll.off(TouchEvent.TOUCH, this.allAreaTouchIdleDown);
				this.touchAreaAll.off(TouchEvent.TOUCH_MOVE, this.allAreaTouchIdleMove);
				this.touchAreaAll.off(TouchEvent.TOUCH_END, this.allAreaTouchIdleDone);
				this.touchAreaAll.off(TouchEvent.TOUCH, this.allAreaTouchClosedDown);
				this.touchAreaAll.off(TouchEvent.TOUCH_MOVE, this.allAreaTouchClosedMove);
				this.touchAreaAll.off(TouchEvent.TOUCH_END, this.allAreaTouchClosedDone);

				this.pivot.x = this.pinchingPoint.x;
				this.pivot.y = this.pinchingPoint.y;

				break;
			case Tweezers.CLOSED:
				this.touchAreaTop.visible = this.touchAreaBottom.visible = false;

				this.touchAreaTop.off(TouchEvent.TOUCH, this.topAreaTouchDown);
				this.touchAreaTop.off(TouchEvent.TOUCH_MOVE, this.topAreaTouchMove);
				this.touchAreaTop.off(TouchEvent.TOUCH_END, this.topAreaTouchDone);

				this.touchAreaBottom.off(TouchEvent.TOUCH, this.bottomAreaTouchDown);
				this.touchAreaBottom.off(TouchEvent.TOUCH_MOVE, this.bottomAreaTouchMove);
				this.touchAreaBottom.off(TouchEvent.TOUCH_END, this.bottomAreaTouchDone);

				this.touchAreaAll.off(TouchEvent.TOUCH, this.allAreaTouchIdleDown);
				this.touchAreaAll.off(TouchEvent.TOUCH_MOVE, this.allAreaTouchIdleMove);
				this.touchAreaAll.off(TouchEvent.TOUCH_END, this.allAreaTouchIdleDone);
				this.touchAreaAll.on(TouchEvent.TOUCH, this.allAreaTouchClosedDown);
				this.touchAreaAll.on(TouchEvent.TOUCH_MOVE, this.allAreaTouchClosedMove);
				this.touchAreaAll.on(TouchEvent.TOUCH_END, this.allAreaTouchClosedDone);

				this.touchAreaAll.visible = true;
				break;

			case Tweezers.DISABLED:
				this.touchAreaTop.visible = this.touchAreaBottom.visible = false;

				this.touchAreaTop.off(TouchEvent.TOUCH, this.topAreaTouchDown);
				this.touchAreaTop.off(TouchEvent.TOUCH_MOVE, this.topAreaTouchMove);
				this.touchAreaTop.off(TouchEvent.TOUCH_END, this.topAreaTouchDone);

				this.touchAreaBottom.off(TouchEvent.TOUCH, this.bottomAreaTouchDown);
				this.touchAreaBottom.off(TouchEvent.TOUCH_MOVE, this.bottomAreaTouchMove);
				this.touchAreaBottom.off(TouchEvent.TOUCH_END, this.bottomAreaTouchDone);

				this.touchAreaAll.visible = true;
				this.touchAreaAll.off(TouchEvent.TOUCH, this.allAreaTouchIdleDown);
				this.touchAreaAll.off(TouchEvent.TOUCH_MOVE, this.allAreaTouchIdleMove);
				this.touchAreaAll.off(TouchEvent.TOUCH_END, this.allAreaTouchIdleDone);
				this.touchAreaAll.on(TouchEvent.TOUCH, this.allAreaTouchClosedDown);
				this.touchAreaAll.on(TouchEvent.TOUCH_MOVE, this.allAreaTouchClosedMove);
				this.touchAreaAll.on(TouchEvent.TOUCH_END, this.allAreaTouchClosedDone);
				break;

			default:
				break;
		}
	}

	private allAreaTouchIdleDown = (event:TouchEvent):void => {
		this.allAreaIdleMouseDown = true;
		this.pivot.x = 0;
		this.pivot.y = 0;
		let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
		this.x = mousePositionCanvas.x;
		this.y = mousePositionCanvas.y;
	}

	private allAreaTouchIdleMove = (event:TouchEvent):void => {
		if(this.allAreaIdleMouseDown) {
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			this.x = Math.abs(mousePositionCanvas.x);
			this.y = Math.abs(mousePositionCanvas.y);
			let checkCollision:boolean;
			checkCollision = this.checkCollisionWithTargets(this.pinchingTarget, this._targetAreas);
			if(checkCollision){
				this.alpha = .6;
			}else{
				this.alpha = 1;
			}
		}
	}

	private allAreaTouchIdleDone = (event:TouchEvent):void => {
		this.allAreaIdleMouseDown = false;
		if(this.alpha < 1){
			this.state = Tweezers.PLACED;
			this.alpha = 1;

			if(this.currentTargetIndex > -1) {
				this._targets.splice(this.currentTargetIndex, 1);
				this._targetAreas.splice(this.currentTargetIndex, 1);
			}

			this.x = this._target.x;
			this.y = this._target.y;
		}
	}

	private getTargetRect(currentTarget:Sprite):Rectangle{
		let targetImage:Sprite = currentTarget.getChildAt(0) as Sprite;
		let targetBounds:Rectangle = new Rectangle(currentTarget.x, currentTarget.y, targetImage.width, targetImage.height);
		return targetBounds;
	}

	private allAreaTouchClosedDown = (event:TouchEvent):void => {
		this.allAreaClosedMouseDown = true;
		let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
		this.lastTouchXAll = mousePositionCanvas.x;
	}

	private allAreaTouchClosedMove = (event:TouchEvent):void => {
		if(this.allAreaClosedMouseDown) {

			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			this.previousTouchXAll = this.lastTouchXAll || 0;
			this.lastTouchXAll = mousePositionCanvas.x;
			let touchDistanceMoved:number = this.lastTouchXAll - this.previousTouchXAll;
			// Pull out if dragged in the right direction only
			if(touchDistanceMoved > 0){
				this.x += Math.cos(this.rotation - Math.PI) * touchDistanceMoved;
				this.y += Math.sin(this.rotation - Math.PI) * touchDistanceMoved;
			}

			let distanceStartingPoint:number = Helper.lineDistance(new Point(this.x, this.y), this.targetStartingPoint);
			let distanceMoved:number = this.pinchingPoint.x - distanceStartingPoint;

			if(distanceStartingPoint > 50){
				Logger.log(this, "Tweezer PICKED");
				this.touchAreaAll.off(TouchEvent.TOUCH, this.allAreaTouchClosedDown);
				this.touchAreaAll.off(TouchEvent.TOUCH_MOVE, this.allAreaTouchClosedMove);
				this.touchAreaAll.off(TouchEvent.TOUCH_END, this.allAreaTouchClosedDone);
				this.removeChild(this._target);
				this.removeChild(this._targetArea);
				this.emit(HospitalEvent.CONTAMINANT_REMOVED);
				this.state = Tweezers.IDLE;
				this.tweezerTop.rotation = Tweezers.TWEEZER_TOP_OPEN_ROTATION;
				this.tweezerBottom.rotation = Tweezers.TWEEZER_BOTTOM_OPEN_ROTATION;

				AudioPlayer.getInstance().playSound("pop");
			}
		}
	}

	private allAreaTouchClosedDone = (event:TouchEvent):void => {
		Logger.log(this, "Tweezers allAreaTouchClosedDone  event.type == "+event.type);
		this.allAreaClosedMouseDown = false;
		Logger.log(this, "Tweezers allAreaTouchClosedDone this.x == "+this.x+" :  this.y == "+this.y);

	}

	private topAreaTouchDown = (event:TouchEvent):void => {
		this.topAreaMouseDown = true;
		let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
		this.lastTouchYTop = mousePositionCanvas.y;
	}

	private topAreaTouchMove = (event:TouchEvent):void => {
		if(this.topAreaMouseDown) {
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			this.previousTouchYTop = this.lastTouchYTop || 0;
			this.lastTouchYTop = mousePositionCanvas.y;
			let newRotation:number = this.tweezerTop.rotation + (this.previousTouchYTop - this.lastTouchYTop) * (Math.PI / 180) / 2;
			if(newRotation > Tweezers.TWEEZER_TOP_OPEN_ROTATION && newRotation < 0){
				this.tweezerTop.rotation = newRotation;
			}

			let rotateTo:number = (-10 * (Math.PI / 180));
			if(this.tweezerTop.rotation > rotateTo){
				this.tweezerTop.rotation = -0.08 * (Math.PI / 180);
				this.tweezerBottom.rotation = 0.08 * (Math.PI / 180);

				this.state = Tweezers.CLOSED;

				this.addChild(this._target);
				this._target.x = this.pinchingPoint.x;
				this._target.y = this.pinchingPoint.y;
				this._target.rotation -= this.rotation;
			}
		}
	}

	private topAreaTouchDone = (event:TouchEvent):void => {
		this.topAreaMouseDown = false;
		this.tweezerTop.rotation = Tweezers.TWEEZER_TOP_OPEN_ROTATION;
	}

	private bottomAreaTouchDown = (event:TouchEvent):void => {
		this.bottomAreaMouseDown = true;
		let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
		this.lastTouchYBottom = mousePositionCanvas.y;
	}

	private bottomAreaTouchMove = (event:TouchEvent):void => {
		if(this.bottomAreaMouseDown) {
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			this.previousTouchYBottom = this.lastTouchYBottom || 0;
			this.lastTouchYBottom = mousePositionCanvas.y;
			let newRotation:number = this.tweezerBottom.rotation + (this.previousTouchYBottom - this.lastTouchYBottom) * (Math.PI / 180) / 2;
			if(newRotation < Tweezers.TWEEZER_BOTTOM_OPEN_ROTATION && newRotation > 0){
				this.tweezerBottom.rotation = newRotation;
			}

			let rotateTo:number = (10 * (Math.PI / 180));

			if(this.tweezerBottom.rotation < rotateTo){
				this.tweezerTop.rotation = -0.08 * (Math.PI / 180);
				this.tweezerBottom.rotation = 0.08 * (Math.PI / 180);
				this.state = Tweezers.CLOSED;

				this.addChild(this._target);
				this._target.x = this.pinchingPoint.x;
				this._target.y = this.pinchingPoint.y;
				this._target.rotation -= this.rotation;
			}
		}
	}

	private bottomAreaTouchDone = (event:TouchEvent):void => {
		Logger.log(this, "Tweezers touchDone  event.type == "+event.type);
		this.bottomAreaMouseDown = false;
		Logger.log(this, "Tweezers touchDone this.x == "+this.x+" :  this.y == "+this.y);
		this.tweezerBottom.rotation = Tweezers.TWEEZER_BOTTOM_OPEN_ROTATION;
	}

	private checkCollisionWithTargets(tweezer:Graphics, _targetAreas:Sprite[]):boolean {
		let targetsLength:number = _targetAreas.length;
		for (let i:number = 0; i < targetsLength; i++) {
			let currentTarget:Sprite = this._targets[i];
			let currentTargetAreas:Sprite = _targetAreas[i];
			let targetImage:Sprite = currentTargetAreas.getChildAt(0) as Sprite;
			let targetBounds:Rectangle = new Rectangle(currentTargetAreas.x, currentTargetAreas.y, targetImage.width, targetImage.height);

			let hit:boolean = SpriteHelper.hitTest(tweezer.getBounds(), targetBounds);
			if(hit){
				this.currentTargetIndex = i;
				this.target = currentTarget;
				this._targetArea = currentTargetAreas;
				return true;
			}
		}
		this.currentTargetIndex = -1;
		return false;
	}

	private createTweezersArt():void {
		this.tweezerTopImage = Sprite.fromFrame("insektstik_pincet_top");
		this.tweezerTopImage.x = -20;
		this.tweezerTopImage.y = -50;
		this.tweezerTop = new Sprite();
		this.tweezerTop.addChild(this.tweezerTopImage);
		this.addChild(this.tweezerTop);
		this.tweezerTop.rotation = Tweezers.TWEEZER_TOP_OPEN_ROTATION;

		this.tweezerBottomImage = Sprite.fromFrame("insektstik_pincet_bottom");
		this.tweezerBottomImage.x = -20;
		this.tweezerBottomImage.y = -20;

		this.tweezerBottom = new Sprite();
		this.tweezerBottom.addChild(this.tweezerBottomImage);

		this.addChild(this.tweezerBottom);

		this.tweezerBottom.rotation = Tweezers.TWEEZER_BOTTOM_OPEN_ROTATION;

		this.touchAreaAll = new Graphics();
		this.touchAreaAll.interactive = true;
		this.touchAreaAll.beginFill(0x333333);
		this.touchAreaAll.drawRect(-this.tweezerTopImage.width, -this.tweezerTopImage.height * 3, this.tweezerTopImage.width * 2, this.tweezerTopImage.height * 6);
		this.addChild(this.touchAreaAll);
		this.touchAreaAll.alpha = HospitalGameView.RECT_COVER_ALPHA;
		this.addChild(this.touchAreaAll);

		this.touchAreaTop = new Graphics();
		this.touchAreaTop.interactive = true;
		this.touchAreaTop.beginFill(0x000000);
		this.touchAreaTop.drawRect(this.tweezerTopImage.x, this.tweezerTopImage.y, this.tweezerTopImage.width, this.tweezerTopImage.height * 2);
		this.touchAreaTop.alpha = HospitalGameView.RECT_COVER_ALPHA;
		this.tweezerTop.addChild(this.touchAreaTop);

		this.touchAreaBottom = new Graphics();
		this.touchAreaBottom.interactive = true;
		this.touchAreaBottom.beginFill(0xFFFFFF);
		this.touchAreaBottom.drawRect(this.tweezerBottomImage.x, this.tweezerBottomImage.y, this.tweezerBottomImage.width, this.tweezerBottomImage.height * 2);
		this.tweezerBottom.addChild(this.touchAreaBottom);

		this.touchAreaBottom.alpha = HospitalGameView.RECT_COVER_ALPHA;
		this.addChild(this.touchAreaBottom);

		this.rotation = Tweezers.TWEEZER_ROTATION;
		this.x = AssetLoader.STAGE_WIDTH * .5;
		this.y = AssetLoader.STAGE_HEIGHT * .5;
	}

	public destroy ():void{
		this.touchAreaTop.off(TouchEvent.TOUCH, this.topAreaTouchDown);
		this.touchAreaTop.off(TouchEvent.TOUCH_MOVE, this.topAreaTouchMove);
		this.touchAreaTop.off(TouchEvent.TOUCH_END, this.topAreaTouchDone);

		this.touchAreaBottom.off(TouchEvent.TOUCH, this.bottomAreaTouchDown);
		this.touchAreaBottom.off(TouchEvent.TOUCH_MOVE, this.bottomAreaTouchMove);
		this.touchAreaBottom.off(TouchEvent.TOUCH_END, this.bottomAreaTouchDone);

		this.touchAreaAll.off(TouchEvent.TOUCH, this.allAreaTouchIdleDown);
		this.touchAreaAll.off(TouchEvent.TOUCH_MOVE, this.allAreaTouchIdleMove);
		this.touchAreaAll.off(TouchEvent.TOUCH_END, this.allAreaTouchIdleDone);

		this.touchAreaAll.off(TouchEvent.TOUCH, this.allAreaTouchClosedDown);
		this.touchAreaAll.off(TouchEvent.TOUCH_MOVE, this.allAreaTouchIdleMove);
		this.touchAreaAll.off(TouchEvent.TOUCH_END, this.allAreaTouchIdleDone);
	}
}
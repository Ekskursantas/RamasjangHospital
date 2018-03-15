
import {AssetLoader} from "../../../../utils/AssetLoader";
import {Sprite, Point, Graphics} from "pixi.js";
import {Signal} from "signals.js";
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";
import {TouchEvent} from "../../../../../loudmotion/events/TouchLoudEvent";
import {AssemblingGameView} from "../AssemblingGameView";
import {HospitalGameView} from "../../../HospitalGameView";

export class AssemblyPart extends Sprite {
	get type(): string {
		return this._type;
	}
	private assemblyPartSprite:Sprite;
	private textureName:string;
	private _initialPosition:Point;
	private nextMovingAngle:number;

	private _type:string;
	public mouseDown:boolean;
	public signalPart:Signal;
	public signalPartTouchDone:Signal;
	private rectCover:Graphics;

	// private timer:Timer; //TODO


	constructor (texture:string, initialPosition:Point, type:string) {
		super();
		this.textureName = texture;
		this._initialPosition = initialPosition;
		this._type = type;
		// addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
		this.onAddedToStage();
	}

	public get initialPosition():Point {
		return this._initialPosition;
	}

	private onAddedToStage():void {

		this.interactive = true;
		this.buttonMode = true;

		this.signalPart = new Signal();
		this.signalPartTouchDone = new Signal();

		this.createAssemblyPartArt();
		this.pivot.set(this.assemblyPartSprite.width * .5, this.assemblyPartSprite.height * .5);
		this.x = this.initialPosition.x;
		this.y = this.initialPosition.y;

		this.on(TouchEvent.TOUCH, this.touchDown);
		this.on(TouchEvent.TOUCH_END, this.touchDone);
		this.on(TouchEvent.TOUCH_MOVE, this.touchMove);

		this.rotateRandomly();
		// this.timer = new Timer(1000, 999); //TODO
		// this.timer.addEventListener(TimerEvent.TIMER, rotateRandomly);
	}

	private touchDown = (event:TouchEvent):void => {
		this.mouseDown = true;
		this.parent.setChildIndex(this, this.parent.children.length-1);
		let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
		let mousePosition: Point = event.data.getLocalPosition(this);
		this.x = mousePositionCanvas.x;
		this.y = mousePositionCanvas.y;
		this.assemblyPartSprite.y = -AssemblingGameView.PART_TOUCH_OFFSET;

		this.signalPart.dispatch(this);
	}

	private touchMove = (event:TouchEvent):void => {
		if(this.mouseDown) {
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			let mousePosition: Point = event.data.getLocalPosition(this);

			this.x = Math.abs(mousePositionCanvas.x);
			this.y = Math.abs(mousePositionCanvas.y);
		}
	}

	private touchDone = (event:TouchEvent):void => {
		Logger.log(this, "AssemblyPart touchDone  event.type == " + event.type);
		this.mouseDown = false;
		// this.pieceImage.pivot.y = 0;
		// TweenLite.to(this.assemblyPartSprite, 0.4, {y:0}); //TODO do we need this 
		this.signalPartTouchDone.dispatch();

	}

	private createAssemblyPartArt():void {
		this.assemblyPartSprite = Sprite.fromFrame(this.textureName);
		this.addChild(this.assemblyPartSprite);

		this.rectCover = new Graphics(); //TODO temp to check area
		this.rectCover.beginFill(0x444444);
		this.rectCover.alpha = HospitalGameView.RECT_COVER_ALPHA;
		this.addChild(this.rectCover);
		this.rectCover.drawRect(this.assemblyPartSprite.x, this.assemblyPartSprite.y, this.assemblyPartSprite.width, this.assemblyPartSprite.height);
	}

	public startMovingRandomly():void {
//			Logger.log(this, "AssemblyPart.startMovingRandomly()");

		this.nextMovingAngle = Math.random() * .2;
		this.rotateRandomly();
		// this.timer.start(); //TODO
	}

	// private rotateRandomly(event:TimerEvent):void{
	private rotateRandomly = ():void => {
//			Logger.log(this, "nextMovingAngle: " + nextMovingAngle);
		if(this.nextMovingAngle < 0){
			this.nextMovingAngle = Math.random() * .3 + .2;
		}else{
			this.nextMovingAngle = -Math.random() * .3 - .2;
		}
//			TweenLite.to(this, .5, {rotation:nextMovingAngle});
		TweenLite.to(this, this.nextMovingAngle * 10, {rotation:this.nextMovingAngle});
	}

	public stopMovingRandomly():void {
//			Logger.log(this, "AssemblyPart.stopMovingRandomly()");
// 		this.timer.stop(); //TODO
		TweenLite.to(this, .3, {rotation:0});
	}

	public destroy():void{
		this.off(TouchEvent.TOUCH, this.touchDown);
		this.off(TouchEvent.TOUCH_END, this.touchDone);
		this.off(TouchEvent.TOUCH_MOVE, this.touchMove);
	}
}
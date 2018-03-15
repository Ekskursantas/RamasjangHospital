// package appdrhospital.view.minigames.followpathgame.objects
// {
// 	import appdrhospital.Config;
//
// 	import starling.display.Image;
// 	import starling.display.Sprite;
// 	import starling.events.Event;
import {AssetLoader} from "../../../../utils/AssetLoader";
import {Sprite, Rectangle, Graphics, Point} from "pixi.js";
import {Signal} from "signals.js";
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";
import {TouchEvent} from "../../../../../loudmotion/events/TouchLoudEvent";
import {FollowPathGameView} from "../FollowPathGameView";
import {Collectable} from "./Collectable";
import {HospitalGameView} from "../../../HospitalGameView";

export class DraggableObject extends Sprite {
	
	public draggableObjectImage:Sprite;
	private textureName:string;

	private _type:string;
	public mouseDown:boolean;
	private rectCover:Graphics;

	public hitObstacle:boolean;

	constructor (texture:string) {
		super();
		this.interactive = true;
		this.buttonMode = true;
		this.textureName = texture;
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.createDraggableObjectArt();


		// this.x = this.initialPosition.x; //TODO?
		// this.y = this.initialPosition.y;

		// this.addTouchEvents();
	}

	public addTouchEvents():void{
		// this.on(TouchEvent.TOUCH, this.touchDown);
		// this.on(TouchEvent.TOUCH_END, this.touchDone);
		// this.on(TouchEvent.TOUCH_MOVE, this.touchMove);
	}

	private touchDown = (event:TouchEvent):void => {
		this.mouseDown = true;
		this.hitObstacle = false;
		// let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
		// this.x = mousePositionCanvas.x;
		// this.y = mousePositionCanvas.y;
	}

	private touchMove = (event:TouchEvent):void => {
		if(this.mouseDown && !this.hitObstacle){
			// let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			// // let mousePosition: Point = event.data.getLocalPosition(this);
			// this.x = Math.abs(mousePositionCanvas.x);
			// this.y = Math.abs(mousePositionCanvas.y);
		}
	}

	private touchDone = (event:TouchEvent):void => {
		this.mouseDown = false;
	}

	private createDraggableObjectArt():void {
		this.draggableObjectImage = Sprite.fromFrame(this.textureName);

		this.rectCover = new Graphics();
		this.rectCover.beginFill(0xFFFFFF);
		this.rectCover.alpha = HospitalGameView.RECT_COVER_ALPHA;
		this.addChild(this.rectCover);
		this.rectCover.drawRect(this.draggableObjectImage.x, this.draggableObjectImage.y, this.draggableObjectImage.width, this.draggableObjectImage.height);

		this.pivot.x = this.draggableObjectImage.width * .5;
		this.pivot.y = this.draggableObjectImage.height * .5;
		this.addChild(this.draggableObjectImage);
	}

	public addCollectable(item:Collectable):void{
		this.addChild(item);
		this.addChild(this.rectCover);
	}

	public get bounds():Rectangle {
		return this.draggableObjectImage.getBounds();
	}

	public destroy():void{

		this.off(TouchEvent.TOUCH, this.touchDown);
		this.off(TouchEvent.TOUCH_END, this.touchDone);
		this.off(TouchEvent.TOUCH_MOVE, this.touchMove);

		if(this.draggableObjectImage != null){
			this.removeChild(this.draggableObjectImage);
			this.draggableObjectImage = null;
		}
		if(this.rectCover != null){
			this.removeChild(this.rectCover);
			this.rectCover = null;
		}

	}
}
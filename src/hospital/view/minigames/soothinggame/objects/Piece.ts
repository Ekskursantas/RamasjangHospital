import {Sprite, Point, Graphics} from "pixi.js";
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";
import {TouchEvent} from "../../../../../loudmotion/events/TouchLoudEvent";
import {Touch} from "../../../../../loudmotion/events/TouchLoud";
import {AssetLoader} from "../../../../utils/AssetLoader";
import {Signal} from "signals.js";
import {SoothingGameView} from "../SoothingGameView";
import {HospitalGameView} from "../../../HospitalGameView";

export class Piece extends Sprite {
	private pieceImage:Sprite;
	private textureName:string;
	private _initialPosition:Point;
	private _touch:Touch;
	private _type:string;
	public mouseDown:boolean;
	public signalPiece:Signal;
	public signalPieceTouchDone:Signal;
	private rectCover:Graphics;
	
	constructor (texture:string, initialPosition:Point, type:string) {
		super();
		this.interactive = true;
		this.buttonMode = true;
		this.textureName = texture;
		this._initialPosition = initialPosition;
		this._type = type;
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.signalPiece = new Signal();
		this.signalPieceTouchDone = new Signal();
		this.createPieceArt();
		this.pivot.set(this.pieceImage.width * .5, this.pieceImage.height * .5);

		Logger.log("piece width / height == "+this.pieceImage.width+" : "+this.pieceImage.height)
		this.x = this.initialPosition.x;
		this.y = this.initialPosition.y;

		this.on(TouchEvent.TOUCH, this.touchDown);
		this.on(TouchEvent.TOUCH_END, this.touchDone);
		this.on(TouchEvent.TOUCH_MOVE, this.touchMove);
	}

	private touchDown = (event:TouchEvent):void => {
		this.mouseDown = true;
		let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
		let mousePosition: Point = event.data.getLocalPosition(this);
		this.x = mousePositionCanvas.x;
		this.y = mousePositionCanvas.y;
		this.pieceImage.y = -SoothingGameView.PIECE_TOUCH_OFFSET;
		this.signalPiece.dispatch(this);
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
		TweenLite.to(this.pieceImage, 0.4, {y:0});
		this.signalPieceTouchDone.dispatch();
	}

	public get type():string {
		return this._type;
	}

	public set type(value:string) {
		this._type = value;
	}

	public get touch():Touch {
		return this._touch;
	}

	public set touch(value:Touch) {
		this._touch = value;
	}

	public get initialPosition():Point {
		return this._initialPosition;
	}

	public set initialPosition(value:Point) {

		this.x = Math.floor(value.x + this.width * .5);
		this.y = Math.floor(value.y + this.height * .5);
		this._initialPosition = new Point(this.x, this.y);
	}

	public get width() :number {
		return this.pieceImage.width;
	}

	public get height() :number {
		return this.pieceImage.height;
	}

	private createPieceArt():void {
		this.pieceImage = Sprite.fromFrame(this.textureName);
		this.addChild(this.pieceImage);

		this.rectCover = new Graphics(); //TODO temp to check area
		this.rectCover.beginFill(0xFFFFFF);
		this.rectCover.alpha = HospitalGameView.RECT_COVER_ALPHA;
		this.addChild(this.rectCover);
		this.rectCover.drawRect(this.pieceImage.x, this.pieceImage.y, this.pieceImage.width, this.pieceImage.height);
	}

	public destroy():void{
		this.off(TouchEvent.TOUCH, this.touchDown);
		this.off(TouchEvent.TOUCH_END, this.touchDone);
		this.off(TouchEvent.TOUCH_MOVE, this.touchMove);

		if(this.pieceImage != null) {
			this.removeChild(this.pieceImage);
			this.pieceImage = null;
		}

		if(this.rectCover != null) {
			this.removeChild(this.rectCover);
			this.rectCover = null;
		}
	}
}
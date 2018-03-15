
import {Sprite, Graphics, Point, Rectangle} from "pixi.js";
import {Touch} from "../../../../../loudmotion/events/TouchLoud";
import {TouchEvent} from "../../../../../loudmotion/events/TouchLoudEvent";
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";
import {AssetLoader} from "../../../../utils/AssetLoader";
import {Signal} from "signals.js";
import Texture = PIXI.Texture;
import {HospitalGameView} from "../../../HospitalGameView";

export class Bacterium extends Sprite {
	get bacteriumTexture(): PIXI.Texture {
		return this._bacteriumTexture;
	}
	get bacteriumImageCurrent(): PIXI.Sprite {
		return this._bacteriumImageCurrent;
	}
	//states
	public static NOT_TOUCHED:string = "notTouched";
	public static TOUCHED_ONCE:string = "touchedOnce";
	public static TOUCHED_TWICE:string = "touchedTwice";
	public static DEAD:string = "dead";

	private _state:string;

	private bacteriumImage:Sprite;
	private bacteriumImageTouchedOnce:Sprite;
	private bacteriumImageTouchedTwice:Sprite;
	private _bacteriumImageCurrent:Sprite;

	private _bacteriumTexture:Texture;
	private _speed:number;
	private _direction:number;
	private rectCover:Graphics;
	public signalPiece:Signal;


	constructor () {
		super();
		this.interactive = true;
		this.buttonMode = true;
		this._speed = Math.random() + 1;

		this.changeDirection();
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.signalPiece = new Signal();
		this.createBacteriumArt();
		this.state = Bacterium.NOT_TOUCHED;
		this.on(TouchEvent.TOUCH, this.touchDown);
	}

	public get state():string {
		return this._state;
	}

	public set state(value:string) {
		this._state = value;

		switch(value) {
			case Bacterium.NOT_TOUCHED:
				this.showImage(this.bacteriumImage);
				break;

			case Bacterium.TOUCHED_ONCE:
				this.showImage(this.bacteriumImageTouchedOnce);
				break;

			case Bacterium.TOUCHED_TWICE:
				this.showImage(this.bacteriumImageTouchedTwice);
				break;

			default:
				break;
		}
	}

	private touchDown = (event:TouchEvent):void => {
		this.parent.setChildIndex(this, this.parent.children.length-1);
		this.signalPiece.dispatch(this);
	}

	private showImage(image:Sprite):void {
		this.bacteriumImage.visible = false;
		this.bacteriumImageTouchedOnce.visible = false;
		this.bacteriumImageTouchedTwice.visible = false;

		this._bacteriumImageCurrent = image;
		this._bacteriumImageCurrent.visible = true;
	}

	public get direction():number {
		return this._direction;
	}

	public set direction(value:number) {
		this._direction = value;
	}

	public get speed():number {
		return this._speed;
	}

	public set speed(value:number) {
		this._speed = value;
	}

	public changeDirection():void {
		this._direction = Math.random() * (360 * (Math.PI / 180));
	}

	public receiveTouch():void {
		switch(this.state) {
			case Bacterium.NOT_TOUCHED:
				this.state = Bacterium.TOUCHED_ONCE;
				break;

			case Bacterium.TOUCHED_ONCE:
				this.state = Bacterium.TOUCHED_TWICE;
				break;

			case Bacterium.TOUCHED_TWICE:
				this.state = Bacterium.DEAD;
				break;
			default:
				break;
		}
	}

	public reInit():void {
		this._speed = Math.random() + 1;
		this.changeDirection();
		this.state = Bacterium.NOT_TOUCHED;
	}

	private createBacteriumArt():void {
		this.bacteriumImageTouchedOnce = Sprite.fromFrame("lungebetaendelse_bakterie1_skud1");
		this.bacteriumImageTouchedTwice = Sprite.fromFrame("lungebetaendelse_bakterie1_skud2");
		this._bacteriumTexture = Texture.fromFrame('lungebetaendelse_bakterie1');
		this.bacteriumImage = new Sprite(this._bacteriumTexture);

		this._bacteriumImageCurrent = this.bacteriumImage;

		this.rectCover = new Graphics(); //TODO temp to check area
		this.rectCover.beginFill(0xFFFFFF);
		this.rectCover.alpha = HospitalGameView.RECT_COVER_ALPHA;
		this.addChild(this.rectCover);
		this.rectCover.drawRect(this.bacteriumImage.x, this.bacteriumImage.y, this.bacteriumImage.width, this.bacteriumImage.height);

		this.addChild(this.bacteriumImage);
		this.addChild(this.bacteriumImageTouchedOnce);
		this.addChild(this.bacteriumImageTouchedTwice);

		this.pivot.x = this.bacteriumImage.width * .5;
		this.pivot.y = this.bacteriumImage.height * .5;
	}

	public get bounds():Rectangle {
		return this._bacteriumImageCurrent.getBounds();
	}

	public destroy():void{

		if(this._bacteriumImageCurrent != null) {
			this.removeChild(this._bacteriumImageCurrent);
			this._bacteriumImageCurrent = null;
		}

		if(this.bacteriumImage != null) {
			this.removeChild(this.bacteriumImage);
			this.bacteriumImage = null;
		}

		if(this.bacteriumImageTouchedOnce != null) {
			this.removeChild(this.bacteriumImageTouchedOnce);
			this.bacteriumImageTouchedOnce = null;
		}

		if(this.bacteriumImageTouchedTwice != null) {
			this.removeChild(this.bacteriumImageTouchedTwice);
			this.bacteriumImageTouchedTwice = null;
		}

		if(this.rectCover != null) {
			this.removeChild(this.rectCover);
			this.rectCover = null;
		}
	}
}
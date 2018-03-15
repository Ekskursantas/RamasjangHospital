import {AssetLoader} from "../../../../utils/AssetLoader";
import {Sprite, Graphics} from "pixi.js";
import Rectangle = PIXI.Rectangle;
import {Helper} from "../../../../../loudmotion/utils/Helper";
import {HospitalGameView} from "../../../HospitalGameView";

export class Obstacle extends Sprite {
	private obstacleImage:Sprite;
	private textureName:string;
	private _speed:number;
	private _direction:number;
	private rectCover:Graphics;

	constructor (texture:string) {
		super();
		this.textureName = texture;
		this._speed = Math.random() * 2 + 3;
		this.changeDirection();
		this.onAddedToStage();
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
		this._direction = Helper.randomRange(160, 200) * (180 * (Math.PI / 180));
	}

	private onAddedToStage():void {
		this.createObstacleArt();
	}

	private createObstacleArt():void {
		this.obstacleImage = Sprite.fromFrame(this.textureName);
		this.rectCover = new Graphics(); //TODO temp to check area
		this.rectCover.beginFill(0xFFFFFF);
		this.rectCover.alpha = HospitalGameView.RECT_COVER_ALPHA;
		this.addChild(this.rectCover);
		this.rectCover.drawRect(this.obstacleImage.x, this.obstacleImage.y, this.obstacleImage.width, this.obstacleImage.height);
		this.addChild(this.obstacleImage);
		this.pivot.x = this.obstacleImage.width * .5;
		this.pivot.y = this.obstacleImage.height * .5;
	}

	public get bounds():Rectangle{
		return this.obstacleImage.getBounds();
	}

	public destroy():void{
		if(this.obstacleImage != null) {
			this.removeChild(this.obstacleImage);
			this.obstacleImage = null;
		}

		if(this.rectCover != null) {
			this.removeChild(this.rectCover);
			this.rectCover = null;
		}
	}
}
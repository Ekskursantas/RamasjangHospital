
import {AssetLoader} from "../../../../utils/AssetLoader";
import {Sprite, Rectangle, Graphics} from "pixi.js";
import {HospitalGameView} from "../../../HospitalGameView";

export class Collectable extends Sprite {

	private collectableImage:Sprite;
	private textureName:string;
	private rectCover:Graphics;
	public collected:boolean;

	constructor (texture:string) {
		super();
		this.interactive = true;
		this.buttonMode = true;
		this.textureName = texture;
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.createCollectableArt();
		this.createMovement();
	}

	private createCollectableArt():void {
		this.collectableImage = Sprite.fromFrame(this.textureName);

		this.rectCover = new Graphics(); //TODO temp to check area
		this.rectCover.beginFill(0xFFFFFF);
		this.rectCover.alpha = HospitalGameView.RECT_COVER_ALPHA;
		this.addChild(this.rectCover);
		this.rectCover.drawRect(this.collectableImage.x, this.collectableImage.y, this.collectableImage.width, this.collectableImage.height);

		this.addChild(this.collectableImage);
		this.pivot.x = this.collectableImage.width * .5;
		this.pivot.y = this.collectableImage.height * .5;
	}

	private createMovement():void {
		this.rotation = -0.1;
		TweenMax.to(this, 1, {rotation:"+=0.2", repeat:-1, yoyo:true, ease:Linear.easeNone, delay:Math.random()});
	}

	public get bounds():Rectangle{
		return this.collectableImage.getBounds();
	}

	public destroy():void{

		if(this.collectableImage != null){
			this.removeChild(this.collectableImage);
			this.collectableImage = null;
		}
		if(this.rectCover != null){
			this.removeChild(this.rectCover);
			this.rectCover = null;
		}

	}
}
import {Sprite} from "pixi.js";
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";

export class Wiper extends Sprite {
	private wiperImage:Sprite;
	private textureName:string;
	public mouseDown:boolean;

	constructor (texture:string) {
		super();
		this.textureName = texture;
		this.interactive = true;
		this.buttonMode = true;
		this.createPieceArt();
		this.pivot.set(this.wiperImage.width * .5, this.wiperImage.height * .5);
	}

	private createPieceArt():void {
		Logger.log(this, "Wiper createPieceArt");
		this.wiperImage = Sprite.fromFrame(this.textureName);
		this.addChild(this.wiperImage);
	}

	public get width() :number {
		return this.wiperImage.width;
	}

	public get height() :number {
		return this.wiperImage.height;
	}

	public destroy():void {
		if(this.wiperImage != null){
			this.removeChild(this.wiperImage);
			this.wiperImage = null;
		}
	}
}
import {Sprite} from "pixi.js";

export class Target extends Sprite {
	private targetImage:Sprite;
	private textureName:string;

	constructor (texture:string) {
		super();
		this.textureName = texture;
		this.createTargetArt();
	}

	private createTargetArt():void {
		this.interactive = true;
		this.targetImage = Sprite.fromFrame(this.textureName);
		this.addChild(this.targetImage);
		this.targetImage.x = -(Math.floor(this.targetImage.width * .5));
		this.targetImage.y = -(Math.floor(this.targetImage.height * .5));
	}
}
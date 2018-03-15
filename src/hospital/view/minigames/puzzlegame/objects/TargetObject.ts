
import {Sprite, Point} from "pixi.js";

export class TargetObject extends Sprite {
	private pieceImage:Sprite;
	private textureName:string;

	constructor (texture:string, position:Point, rotation:number) {
		super();
		this.textureName = texture;
		this.x = position.x;
		this.y = position.y;
		this.rotation = (rotation * (Math.PI / 180));
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.createPieceArt();
	}

	private createPieceArt():void {
		this.pieceImage = Sprite.fromFrame(this.textureName);
		this.addChild(this.pieceImage);
		this.pieceImage.x = -(this.pieceImage.width/2);
		this.pieceImage.y = -(this.pieceImage.height/2);
		this.pieceImage.alpha = 0.5;
	}
}
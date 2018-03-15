import {Sprite, Point} from "pixi.js";

export class TargetObject extends Sprite {
	private targetObjectImage:Sprite;
	private textureName:string;
	private _type:string;

	constructor(texture:string, position:Point, type:string) {
		super();
		this.textureName = texture;
		this.x = position.x;
		this.y = position.y;

		this.interactive = true;
		this._type = type;

		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.createTargetObjectArt();
	}

	public get type():string {
		return this._type;
	}

	public set type(value:string) {
		this._type = value;
	}

	public get width() :number {
		return this.targetObjectImage.width;
	}

	public get height() :number {
		return this.targetObjectImage.height;
	}

	private createTargetObjectArt():void {
		this.targetObjectImage = Sprite.fromFrame(this.textureName);
		this.addChild(this.targetObjectImage);
	}
}
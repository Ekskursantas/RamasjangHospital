
import {AssetLoader} from "../../../../utils/AssetLoader";
import {Sprite, Graphics} from "pixi.js";
import {HospitalGameView} from "../../../HospitalGameView";
import Rectangle = PIXI.Rectangle;

export class CremeBlob extends Sprite {
	private blobImage:Sprite;
	private rectCover:Graphics;

	constructor () {
		super();
		this.interactive = true;
		this.buttonMode = true;
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.createBlobArt();
	}

	private createBlobArt():void {
		this.blobImage = Sprite.fromFrame("insektstik_salve_01");
		this.addChild(this.blobImage);

		// this.rectCover = new Graphics(); //TODO temp to check area
		// this.rectCover.beginFill(0x666666);
		// this.rectCover.alpha = .3; //HospitalGameView.RECT_COVER_ALPHA;
		// this.rectCover.drawRect(this.blobImage.x, this.blobImage.y, this.blobImage.width, this.blobImage.height);
		// this.rectCover.pivot.x = this.blobImage.width * .5;
		// this.rectCover.pivot.y = this.blobImage.height * .5;
        //this.addChild(this.rectCover);

		this.blobImage.pivot.x = this.blobImage.height * .5;
		this.blobImage.pivot.y = this.blobImage.height * .5;
	}

	public get height():number{
		return this.rectCover.height;
	}

	public destroy():void{
		if(this.blobImage != null){
			this.removeChild(this.blobImage);
			this.blobImage = null;
		}
		if(this.rectCover != null){
			this.removeChild(this.rectCover);
			this.rectCover = null;
		}

	}
}
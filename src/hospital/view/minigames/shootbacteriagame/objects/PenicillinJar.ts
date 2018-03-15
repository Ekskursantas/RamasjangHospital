import {Sprite, Point, Graphics} from "pixi.js";
import {HospitalGameView} from "../../../HospitalGameView";

export class PenicillinJar extends Sprite {
	private imageHighlight:Sprite;
	private imageFull:Sprite;
	private imageFingerDipped:Sprite;
	private initialPosition:Point;
	private rectCover:Graphics;
	
	constructor () {
		super();
		this.interactive = true;
		this.buttonMode = true;
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.createImages();
		this.initialPosition = new Point(this.x, this.y);
	}
	
	public showFingerDipped():void {
		TweenLite.killTweensOf(this.imageFingerDipped);
		this.imageFingerDipped.alpha = 1;
		this.startFadingFingerPrint();
	}
	
	public highlight():void {
		TweenMax.to(this.imageHighlight, 0.5, {alpha:"+=1", repeat:-1, yoyo:true, ease:Linear.easeNone});
	}
	
	public stopHighlighting():void {
		TweenMax.killTweensOf(this.imageHighlight);
		this.imageHighlight.alpha = 0;
	}

	private createImages():void {
		this.imageHighlight = Sprite.fromFrame("lungebetaendelse_penicillin_highlight");
		this.imageFull = Sprite.fromFrame("lungebetaendelse_penicillin1");
		this.imageFingerDipped = Sprite.fromFrame("lungebetaendelse_penicillin2");

		this.rectCover = new Graphics(); //TODO temp to check area
		this.rectCover.beginFill(0xFFFFFF);
		this.rectCover.alpha = HospitalGameView.RECT_COVER_ALPHA;
		this.addChild(this.rectCover);
		this.rectCover.drawRect(this.imageHighlight.x, this.imageHighlight.y, this.imageHighlight.width, this.imageHighlight.height);

		this.addChild(this.imageHighlight);
		this.addChild(this.imageFull);
		this.addChild(this.imageFingerDipped);

		this.imageHighlight.alpha = 0;
		this.imageFingerDipped.alpha = 0;
		
		// let imageHighlightOrigialDiameter:number = this.imageHighlight.width;
		this.imageHighlight.scale.x = this.imageHighlight.scale.y = 1.2;

		// this.imageHighlight.x -= (this.imageHighlight.width - imageHighlightOrigialDiameter) / 2;
		// this.imageHighlight.y -= (this.imageHighlight.width - imageHighlightOrigialDiameter) / 2;

		this.imageHighlight.pivot.x = Math.floor(this.imageHighlight.width * .5 - 2);
		this.imageHighlight.pivot.y = Math.floor(this.imageHighlight.height * .5 - 2);

		this.imageHighlight.x = this.imageHighlight.width * .5;
		this.imageHighlight.y = this.imageHighlight.height * .5;

	}

	public get width():number{
		return this.imageHighlight.width;
	}
	
	private startFadingFingerPrint():void {
		TweenLite.to(this.imageFingerDipped, 4, {alpha:0});
	}

	public destroy():void{
		if(this.imageHighlight != null) {
			this.removeChild(this.imageHighlight);
			this.imageHighlight = null;
		}

		if(this.imageFull != null) {
			this.removeChild(this.imageFull);
			this.imageFull = null;
		}

		if(this.imageFingerDipped != null) {
			this.removeChild(this.imageFingerDipped);
			this.imageFingerDipped = null;
		}

		if(this.rectCover != null) {
			this.removeChild(this.rectCover);
			this.rectCover = null;
		}
	}
}
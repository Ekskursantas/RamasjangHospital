
import {Button} from "../../../../loudmotion/ui/Button";
import {Sprite} from "pixi.js";
import {Signal} from "signals.js";
import {TouchEvent} from "../../../../loudmotion/events/TouchLoudEvent";
import {Logger} from "../../../../loudmotion/utils/debug/Logger";

export class ScannerButton extends Button {
	private highlightImage:Sprite;
	// public touchable:boolean;
	public signalScannerButton:Signal;
	
	constructor() {
		super();

		// upState, text, downState
		// upState:Texture, text:string="", downState:Texture=null
		this.signalScannerButton = new Signal();
		this.highlightImage = Sprite.fromFrame("operationRoom_scannerButton_highlight");
		this.highlightImage.pivot.x = this.highlightImage.width * .5;
		this.highlightImage.pivot.y = this.highlightImage.height * .5;
		this.addChild(this.highlightImage);
		this.highlightImage.x = 4;
		this.highlightImage.y = -4;
		this.highlightImage.alpha = 0;
		this.on(TouchEvent.TOUCH_END, this.touchDone);
	}

	private touchDone = (event:TouchEvent):void => {
		Logger.log(this, "ScannerButton touchDown  event.type == " + event.type);
		this.signalScannerButton.dispatch(this);
	}
	
	public highlight():void {
		TweenMax.to(this.highlightImage, 0.5, {alpha:"+=1", repeat:-1, yoyo:true, ease:Linear.easeNone});
		this.parent.setChildIndex(this, this.parent.children.length - 1);
	}
	
	public endHighlight():void {
		TweenMax.killTweensOf(this.highlightImage);
		this.highlightImage.alpha = 0;
	}

	public destroy():void{
		this.off(TouchEvent.TOUCH_END, this.touchDone);
	}
}
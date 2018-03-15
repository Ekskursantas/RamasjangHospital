
import {Cross} from "./Cross";
import {Sprite} from "pixi.js";

export class Door extends Sprite {
//		private doorImage:Image;
	private doorImageHighlighted:Sprite;
	private doorImageOpen:Sprite;
	private arrow:Sprite;
	private closeTimeout:number;
	private cross:Cross;
	
	
	constructor() {
		super();
		// addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.interactive = true;
		this.createDoorArt();
		this.removeHighlight();
	}
	
	private createDoorArt():void {
		this.cross = new Cross();
		this.addChild(this.cross);
		this.cross.x = 68;
		this.cross.y = 90;

		this.doorImageOpen = Sprite.fromFrame("waitingRoom_door_open");
		this.addChild(this.doorImageOpen);
		this.doorImageOpen.x = 13;
		this.doorImageOpen.y = 10;
		this.doorImageOpen.visible = false;

		this.arrow = Sprite.fromFrame("waitingRoom_door_arrow");
		this.addChild(this.arrow);
		this.arrow.x = 70;
		this.arrow.y = -50;
		this.arrow.visible = false;

		this.doorImageHighlighted = Sprite.fromFrame("waitingRoom_doorOutline");
		this.addChild(this.doorImageHighlighted);
		this.doorImageHighlighted.scale.x = this.doorImageHighlighted.scale.y = 2;
	}
	
	public highlight():void {
		this.doorImageHighlighted.visible = true;
	}
	
	public removeHighlight():void {
		this.doorImageHighlighted.visible = false;
	}
	
	public showOpened():void {
		this.doorImageOpen.visible = true;
		this.animateArrow();
	}
	
	private animateArrow():void {
		clearTimeout(this.closeTimeout);
		this.arrow.visible = true;
		this.arrow.y = -50;
		TweenMax.killTweensOf(this.arrow);
		TweenMax.to(this.arrow, 0.5, {y:"+=20", repeat:-1, yoyo:true, ease:Linear.easeNone});
	}
	
	public showClosed():void {
		this.closeTimeout = setTimeout(():void => {
			if(this.doorImageOpen != null) {
				this.doorImageOpen.visible = false;
			}
			if(this.arrow != null) {
				TweenMax.killTweensOf(this.arrow);
				this.arrow.visible = false;
				this.arrow.y = -50;
			}
		}, 1000);
	}

	public destroy():void{
		if(this.closeTimeout != null) {
			clearTimeout(this.closeTimeout);
		}

		if(this.cross != null) {
			this.removeChild(this.cross);
			this.cross = null;
		}
		if(this.doorImageOpen != null) {
			this.removeChild(this.doorImageOpen);
			this.doorImageOpen = null;
		}
		if(this.arrow != null) {
			this.removeChild(this.arrow);
			this.arrow = null;
		}
		if(this.doorImageHighlighted != null) {
			this.removeChild(this.doorImageHighlighted);
			this.doorImageHighlighted = null;
		}
	}
}


import {Sprite} from "pixi.js";
export class PatientSlot extends Sprite {

	private slotImage:Sprite;

	constructor() {
		super();
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.createSlotArt();
	}

	private createSlotArt():void {
		this.slotImage = Sprite.fromFrame("kid_outline");
		this.addChild(this.slotImage);
		this.slotImage.alpha = 0.5;
	}

	public destroy():void{
		if(this.slotImage != null) {
			this.removeChild(this.slotImage);
			this.slotImage = null;
		}
	}
}
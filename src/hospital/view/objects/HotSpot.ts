import {HospitalEvent} from "../../event/HospitalEvent";
import {Sprite, Texture} from "pixi.js";
import {Logger} from "../../../loudmotion/utils/debug/Logger";
import {Button} from "../../../loudmotion/ui/Button";
import {ButtonEvent} from "../../event/ButtonEvent";

export class HotSpot extends Button {
	private hotSpotImage:Sprite;
	
	constructor () {
		super();
		this.onAddedToStage();
	}
	
	private onAddedToStage():void {
		this.createHotSpotArt();
		this.on(ButtonEvent.CLICKED, this.btnPressedListener);
		this.highlight();
	}

	public enable():void {
		this.touchable = true;
	}

	public disable():void {
		this.touchable = false;
	}

	public highlight():void {
		TweenMax.to(this, 0.4, {scaleX:1.2, scaleY:1.2, repeat:-1, yoyo:true, ease:Linear.easeNone});
	}

	public stopHighlight():void {
		TweenMax.killTweensOf(this);
	}

	private createHotSpotArt():void {
		this.addTexture(Texture.fromFrame("operationRoom_scannerHotspot_rings"));
		this.x = -74;
		this.y = -54;
	}

	protected btnPressedListener = (e:HospitalEvent):void => {
		Logger.log(this, "HotSpot btnPressedListener this.touchable == "+this.touchable);
		if(this.touchable) {
			Logger.log(this, "HotSpot btnPressedListener this.touchable == "+this.touchable);
			this.emit(HospitalEvent.DISEASE_HOTSPOT_PRESSED);
		}
	}

	public destroy():void{
		//TODO flesh out
		this.stopHighlight();
		this.off(ButtonEvent.CLICKED, this.btnPressedListener);
	}
}
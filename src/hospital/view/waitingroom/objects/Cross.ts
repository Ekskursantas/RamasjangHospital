
import {TouchEvent} from "../../../../loudmotion/events/TouchLoudEvent";
import {TouchPhase} from "../../../../loudmotion/events/TouchLoudPhase";
import {Touch} from "../../../../loudmotion/events/TouchLoud";
import {AssetLoader} from "../../../utils/AssetLoader";
import {Sprite} from "pixi.js";
import {ButtonEvent} from "../../../event/ButtonEvent";
import {Logger} from "../../../../loudmotion/utils/debug/Logger";
import {Config} from "../../../Config";
import {AudioPlayer} from "../../../../loudmotion/utils/AudioPlayer";

export class Cross extends Sprite {
	private crossTurnedOn:Sprite;
	private onState:boolean;
	private touch:Touch;

	constructor () {
		super();
		this.on(ButtonEvent.TOUCH, this.touchListener);
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.createCrossArt();
	}

	private touchListener = (event:ButtonEvent):void => {
		this.onState = !this.onState;
		this.crossTurnedOn.alpha = Number(this.onState);
		if(this.onState){
			AudioPlayer.getInstance().playSound("clik_on", 0, Config.EFFECTS_VOLUME_LEVEL);
		}else{
			AudioPlayer.getInstance().playSound("clik_off", 0, Config.EFFECTS_VOLUME_LEVEL);
		}
	}

	private createCrossArt():void {
		this.crossTurnedOn = Sprite.fromFrame("waitingRoom_plusOn");
		this.addChild(this.crossTurnedOn);
		this.crossTurnedOn.alpha = 0;
	}

	public destroy():void{
		this.off(ButtonEvent.TOUCH, this.touchListener);
		if(this.crossTurnedOn != null) {
			this.removeChild(this.crossTurnedOn);
		}
	}
}
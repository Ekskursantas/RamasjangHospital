
import {TouchEvent} from "../../../../loudmotion/events/TouchLoudEvent";
import {TouchPhase} from "../../../../loudmotion/events/TouchLoudPhase";
import {Touch} from "../../../../loudmotion/events/TouchLoud";
import {AssetLoader} from "../../../utils/AssetLoader";
import {Sprite} from "pixi.js";
import {ButtonEvent} from "../../../event/ButtonEvent";
import {Config} from "../../../Config";
import {AudioPlayer} from "../../../../loudmotion/utils/AudioPlayer";

export class PortaitOfMille extends Sprite {
	private touch:Touch;
	private portrait:Sprite;
	// private sndMan:SoundManager;

	constructor () {
		super();
		this.on(ButtonEvent.CLICKED, this.touchListener);
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.interactive = true;
		this.createPortraitArt();
	}

	private touchListener = (event:ButtonEvent):void => {
		this.movePortrait();
		AudioPlayer.getInstance().playSound("picture", 0, Config.EFFECTS_VOLUME_LEVEL);
	}		
	
	private movePortrait():void {
		TweenLite.killTweensOf(this);
		let tl:TimelineLite = new TimelineLite();
		//add a from() tween at the beginning of the timline
		tl.to(this, 0.5, {rotation:0.2, ease:Sine.easeInOut});
		tl.to(this, 0.9, {rotation:-0.12, ease:Sine.easeInOut});
		tl.to(this, 0.7, {rotation:0.08, ease:Sine.easeInOut});
		tl.to(this, 0.6, {rotation:-0.03, ease:Sine.easeInOut});
		tl.to(this, 0.5, {rotation:0, ease:Sine.easeInOut});
		tl.play();
	}

	private createPortraitArt():void {
		this.portrait = Sprite.fromFrame("waitingRoom_motorMille");
		this.addChild(this.portrait);
		this.portrait.x = -139;
		this.portrait.y = -2;
	}

	public destroy():void{
		this.off(ButtonEvent.CLICKED, this.touchListener);
		TweenLite.killTweensOf(this);

		if(this.portrait != null){
			this.removeChild(this.portrait);
			this.portrait = null;
		}
	}
}
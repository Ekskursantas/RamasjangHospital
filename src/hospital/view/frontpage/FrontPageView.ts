
import {AssetLoader} from "src/hospital/utils/AssetLoader";
import {HospitalGameView} from "../HospitalGameView";
import {Config} from "../../Config";
import {HospitalEvent} from "../../event/HospitalEvent";
import {ButtonEvent} from "../../event/ButtonEvent";
import {Logger} from "src/loudmotion/utils/debug/Logger";
import {Sprite, Container, Graphics} from "pixi.js";
import {AudioPlayer} from "../../../loudmotion/utils/AudioPlayer";

export class FrontPageView extends HospitalGameView {

	private background:Sprite; //Image;
	private label:Sprite; //Image;
	private playButton:Sprite; //Image;

	private stage:Container;

	private touch:Touch;
	private screenButton:Graphics;

	// private sndMan:SoundManager;

	
	
	constructor(){
		super();
		// sndMan = SoundManager.getInstance(); //TODO sound
		Logger.log(this, "FrontPageView constructor");
		// this.init();
	}


	public init():void {

		// this.addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
		console.log("FrontPageView init");
		//this.stage = AssetLoader.getInstance().stage;
        this.name = "FrontPageView";
		Config.currentTimeout = setTimeout(this.currentSpeakTimeout, 2000);
		this.onAddedToStage();
	}

	private currentSpeakTimeout = ():void => {
		// sndMan.tweenVolume("intro", 0.3, 0.5);
		Config.currentSpeakSound = "mille_hej_og_velkommen";
		// sndMan.playSound(Config.currentSpeakSound, Config.SPEAK_VOLUME_LEVEL);
		// sndMan.getSoundChannel(Config.currentSpeakSound).addEventListener("soundComplete", audioLetsStartComplete);

        if (Config.currentSpeakSound != null) {
            
            this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
            console.log(AudioPlayer.getInstance().getSoundByName(Config.currentSpeakSound));
            
            console.log(this.sndSpeak);
            
            console.log("--------------------------------------------------");
            
                this.sndSpeak.on(AudioPlayer.AUDIO_COMPLETE, this.audioLetsStartComplete);
            
            
            Logger.log(this, "FrontPageView currentSpeakTimeout Config.currentSpeakSound === " + Config.currentSpeakSound);
		}

		Config.currentTimeout = setTimeout(this.highlight, 1000);
	}

	 private audioLetsStartComplete = (event:Event):void => {
		Logger.log(this, "FrontPageView.audioLetsStartComplete(event)");
		 this.sndSpeak.off(AudioPlayer.AUDIO_COMPLETE, this.audioLetsStartComplete);
// 		sndMan.tweenVolume("intro", 1, 0.5); //TODO sound
	}

	 private onAddedToStage():void {
		 this.drawScene();

		TweenLite.to(this.label, 2, {y:60, ease:Elastic.easeOut, delay:1});
		TweenLite.to(this.playButton, 0.3, {alpha:1, delay:2});

		 this.interactive = true;

	}

	 private highlight = ():void => {
		// TweenMax.to(this.playButton, 0.5, {width:"+40", height:"+40", x:"-20", y:"-20", repeat:-1, yoyo:true, ease:Linear.easeNone});
		TweenMax.to(this.playButton, 0.5, {width:'+=40px', height:'+=40px', x:'-=20px', y:'-=20px', repeat:-1, yoyo:true, ease:Linear.easeNone});
	}

	 private onTouch = (event:ButtonEvent) => {
		 Logger.log(this, "FrontPageView onTouch");
		 this.emit(HospitalEvent.FRONTPAGE_EXITED);
	}

	 private drawScene():void {
		this.background = Sprite.fromFrame("titlePage");
		this.addChild(this.background);

		Logger.log(this, "FrontPageView drawScene  : this.background == "+this.background);
		//  AssetLoader.getInstance().stage.addChild(this.background);

		// this.label = new Image(Config.assetManager.getTexture("title")); //TODO orig
		this.label = Sprite.fromFrame("title");
		this.addChild(this.label);
		this.label.x = AssetLoader.STAGE_WIDTH * .5 - this.label.width/2;
		this.label.y = -this.label.height;

		this.playButton = Sprite.fromFrame("playIkon");
		this.addChild(this.playButton);
		this.playButton.x = AssetLoader.STAGE_WIDTH * .5 - this.playButton.width * .5;
		this.playButton.y = 400;
		this.playButton.alpha = 0;

		 this.screenButton = new Graphics();
		 this.screenButton.interactive = true;
		 this.screenButton.beginFill(0xFFFFFF);
		 this.screenButton.alpha = 0.05;
		 this.screenButton.drawRect(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
		 this.addChild(this.screenButton);
		 this.screenButton.on(ButtonEvent.CLICKED, this.onTouch);
         
	}

	public destroy():void {
		Logger.log(this, "FrontPageView BEFORE destroy");
		Logger.log(this, "FrontPageView this.children.length == "+this.children.length);

		if(this.btnBack != null){
			this.btnBack.destroy();
			this.btnBack = null;
		}

		if(this.background != null){
			this.removeChild(this.background);
			this.background = null;
		}

		if(this.label != null){
			this.removeChild(this.label);
			this.label = null;
		}

		if(this.playButton != null){
			this.removeChild(this.playButton);
			this.playButton = null;
		}

		if(this.screenButton != null){
			this.screenButton.off(ButtonEvent.CLICKED, this.onTouch);
			this.removeChild(this.screenButton);
			this.screenButton = null;
		}

		Logger.log(this, "FrontPageView AFTER this.children.length == "+this.children.length);

		try{
			// this.stage.removeChildren(0, this.stage.children.length);
			// this.stage.removeChildren();
			//AssetLoader.getInstance().stage.removeChildren(0, AssetLoader.getInstance().stage.children.length-1); //0, AssetLoader.getInstance().stage.children.length
		} catch (Error) {
			Logger.log(this, "ERROR FrontPageView removing this.stage.removeChildren(0, this.stage.children.length)");
		}

		clearTimeout(Config.currentTimeout);
		// sndMan.stopSound(Config.currentSpeakSound); //TODO add snd
		if(Config.currentSpeakSound != null) {
			AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
		}
		super.destroy();
	}
}

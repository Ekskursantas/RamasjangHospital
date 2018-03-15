import {Config} from "../../../Config";
import {Target} from "./objects/Target";
import {Wiper} from "./objects/Wiper";
import {HospitalGameView} from "../../HospitalGameView";
import {AssetLoader} from "../../../utils/AssetLoader";
import {HospitalEvent} from "../../../event/HospitalEvent";
import {TouchEvent} from "../../../../loudmotion/events/TouchLoudEvent";
import {Rectangle, Graphics, Sprite, Point} from "pixi.js";
import {BackBtn} from "../../buttons/BackBtn";
import {Logger} from "../../../../loudmotion/utils/debug/Logger";
import {SpriteHelper} from "../../../../loudmotion/utils/SpriteHelper";
import {AudioPlayer} from "../../../../loudmotion/utils/AudioPlayer";

export class WipingGameView extends HospitalGameView {
	private WIPER_TOUCH_OFFSET:number = 0;
	private NUM_OF_TARGETS:number = 10;
	private TARGET_AREA:Rectangle = new Rectangle(350, 230, 500, 180);

	// private sndMan:SoundManager; //TODO sound

	private bgQuad:Graphics; //Quad;
	private background:Sprite;
	private wiper:Wiper;
	private targets:Target[]; //Vector.<Target>;

	public btnBack:BackBtn;

	constructor(){
		super();
	}

	public init():void {
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.name = "WipingGameView";
		this.drawScene();
		this.startGame();
	}

	private drawScene():void {
		this.bgQuad = new Graphics();
		this.bgQuad.beginFill(0xc1fdf1);
		// set the line style to have a width of 5 and set the color to red
		// this.background.lineStyle(5, 0xFF0000);
		// draw a rectangle
		this.bgQuad.drawRect(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
		//this.addChild(this.bgQuad);
		// this.background = color == 0x06a484;
		// this.bgQuad.alpha = 0.2;
		this.addChild(this.bgQuad);

		// background
		let bgTexture:string = "brandsaar_arm_0" + Config.currentPatient.skinType;
		this.background = Sprite.fromFrame(bgTexture);
		this.background.scale.x = this.background.scale.y = 2;
		this.addChild(this.background);


		this.targets = []; //new Vector.<Target>();
		for (let i:number = 0; i < this.NUM_OF_TARGETS; i++) {
			let target:Target = new Target("brandsaar_snavs");
			this.addChild(target);
			target.x = Math.round(Math.random() * this.TARGET_AREA.width) + this.TARGET_AREA.x;
			target.y = Math.round(Math.random() * this.TARGET_AREA.height) + this.TARGET_AREA.y;
			this.targets.push(target);
		}

		this.wiper = new Wiper("brandsaar_klud");
		this.addChild(this.wiper);
		this.wiper.x = 630;
		this.wiper.y = AssetLoader.STAGE_HEIGHT - this.wiper.height * .5;

		this.btnBack = new BackBtn(this, HospitalEvent.BACK_FROM_MINIGAME);
	}

	private startGame():void {
		this.wiper.on(TouchEvent.TOUCH, this.touchDown);
		this.wiper.on(TouchEvent.TOUCH_END, this.touchDone);
		this.wiper.on(TouchEvent.TOUCH_MOVE, this.touchMove);

		Config.currentTimeout = setTimeout(():void => {
			if(Config.currentSpeakSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
			}
			if(Config.currentSpeakOverlappingViewsSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakOverlappingViewsSound);
			}
			Config.currentSpeakSound = "mille_tag_kluden_og_vask_rent_for_snavs";
			this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);

			Config.currentTimeout = setTimeout(():void => {
				if(!this.allTargetsRemoved()){
					if(Config.currentSpeakSound != null) {
						AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
					}
					Config.currentSpeakSound = "mille_hov_der_er_vist_lidt_snavs_tilbage";
					this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
				}
			}, 10000);

		}, 1000);

	}

	private touchDown = (event:TouchEvent):void => {
		this.wiper.mouseDown = true;
		let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
		this.wiper.y = mousePositionCanvas.y;
	}

	private touchMove = (event:TouchEvent):void => {
		if(this.wiper.mouseDown) {
			let mousePositionCanvas: Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
			let mousePosition: Point = event.data.getLocalPosition(this);

            let newPosX:number = Math.abs(mousePositionCanvas.x);
            if (newPosX > 0 && newPosX < AssetLoader.STAGE_WIDTH) {
                this.wiper.x = newPosX;
            }

			let newPosY:number = Math.abs(mousePositionCanvas.y); // this.WIPER_TOUCH_OFFSET;
			if (newPosY > 0 && newPosY < AssetLoader.STAGE_HEIGHT) {
                this.wiper.y = newPosY;
            }

			// If wiper touches target: fade target
// 			// for each(let target:Target in targets)
			for (let target of this.targets) {
				let hit: boolean = SpriteHelper.hitTest(this.wiper.getBounds(), target.getBounds());
				if (hit) {
					target.alpha -= 0.06;
				}
			}
		}
	}

	private touchDone = (event:TouchEvent):void => {
		Logger.log(this, "WipingGameView touchDone  event.type == "+event.type);
		this.wiper.mouseDown = false;
		if(this.allTargetsRemoved()){
			this.wiper.off(TouchEvent.TOUCH, this.touchDown);
			this.wiper.off(TouchEvent.TOUCH_END, this.touchDone);
			this.wiper.off(TouchEvent.TOUCH_MOVE, this.touchMove);

			if(Config.currentSpeakSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
			}
			Config.currentSpeakSound = "mille_super_flot";
			this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
			this.sndSpeak.on(AudioPlayer.AUDIO_COMPLETE, this.audioGameCompletedSpeakComplete);
		}
	}

	private audioGameCompletedSpeakComplete = (event:Event):void => {
		Logger.log(this, "WipingGameView audioGameCompletedSpeakComplete");
		// dispatchEvent(new HospitalEvent(HospitalEvent.MINIGAME_COMPLETED, true));
		this.sndSpeak.off(AudioPlayer.AUDIO_COMPLETE, this.audioGameCompletedSpeakComplete);
		this.emit(HospitalEvent.MINIGAME_COMPLETED);
	}

	private allTargetsRemoved():boolean {
		let toReturn:boolean = true;
		let targetsLength:number = this.targets.length;
		for (let i:number = 0; i < targetsLength; i++) {
			let target:Sprite = this.targets[i];
			if (target.alpha > 0.1) {
				toReturn = false;
			}
		}
		Logger.log(this, "WipingGameView allTargetsRemoved toReturn == "+toReturn);
		return toReturn;
	}

	// override public destroy():void
	public destroy():void {
		if(this.btnBack != null){
			this.btnBack.destroy();
			this.btnBack = null;
		}

		if(this.bgQuad != null){
			this.removeChild(this.bgQuad);
			this.bgQuad = null;
		}

		if(this.background != null){
			this.removeChild(this.background);
			this.background = null;
		}

		if(this.wiper != null){
			this.wiper.off(TouchEvent.TOUCH, this.touchDown);
			this.wiper.off(TouchEvent.TOUCH_END, this.touchDone);
			this.wiper.off(TouchEvent.TOUCH_MOVE, this.touchMove);
			this.removeChild(this.wiper);
			this.wiper.destroy();
			this.wiper = null;
		}


		if(Config.currentSpeakSound != null) {
			AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
		}
		super.destroy();

	}
}
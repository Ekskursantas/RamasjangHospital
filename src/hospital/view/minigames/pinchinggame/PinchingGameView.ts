// package appdrhospital.view.minigames.pinchinggame
// {
// 	import com.greensock.TweenLite;
// 	import com.greensock.easing.ElasticInOut;
//
// 	import flash.geom.Point;
// 	import flash.utils.clearTimeout;
// 	import flash.utils.setTimeout;
//
// 	import appdrhospital.Config;
// 	import appdrhospital.event.HospitalEvent;
// 	import appdrhospital.utils.SoundManager;
// 	import appdrhospital.view.HospitalGameView;
// 	import appdrhospital.view.minigames.pinchinggame.objects.CremeTube;
// 	import appdrhospital.view.minigames.pinchinggame.objects.Tweezers;
// 	import appdrhospital.vo.Level;
//
// 	import dk.nozebra.ramasjangapp.util.StarlingHelper;
//
// 	import starling.display.Button;
// 	import starling.display.Image;
// 	import starling.display.Quad;
// 	import starling.display.Sprite;
// 	import starling.events.Event;
// 	import starling.utils.deg2rad;
import {HospitalGameView} from "../../HospitalGameView";
import {CremeTube} from "./objects/CremeTube";
import {Tweezers} from "./objects/Tweezers";
import {AssetLoader} from "../../../utils/AssetLoader";
import {Config} from "../../../Config";
import {HospitalEvent} from "../../../event/HospitalEvent";
import {Logger} from "../../../../loudmotion/utils/debug/Logger";
import {Level} from "../../../vo/Level";
import {Graphics, Sprite, Container, Point} from "pixi.js";
import {BackBtn} from "../../buttons/BackBtn";
import {AudioPlayer} from "../../../../loudmotion/utils/AudioPlayer";

export class PinchingGameView extends HospitalGameView {
	private bgQuad:Graphics;
	private background:Sprite;
	private tweezers:Tweezers;

	private contaminants:Sprite[]; //Vector.<Sprite>;
	private contaminatedAreas:Sprite[]; //Vector.<Sprite>;
	private contaminatedAreasCreme:Sprite[]; //Vector.<Sprite>;

	public btnBack:BackBtn;

	private cremeTube:CremeTube;
	private cremeTarget:Sprite;

	private contaminantsRemoved:number;

	private stage:Container;

	constructor () {
		super();
	}

	public init():void {
		this.name = "PinchingGameView";
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.drawScene();
		this.startGame();
	}

	private drawScene():void {
		this.bgQuad = new Graphics();
		this.bgQuad.drawRect(0, 0, 300, 200);
		this.addChild(this.bgQuad);

		if(Config.currentPatient.disease == Level.INSECT_BITE){
			this.drawInsectBites();
		} else if(Config.currentPatient.disease == Level.POISONING){
			this.drawMouthWithPoison();
		}

		this.tweezers = new Tweezers();
		this.addChild(this.tweezers);
		this.tweezers.state = Tweezers.IDLE;

		this.tweezers.targets = this.contaminants;
		this.contaminatedAreasCreme = this.contaminatedAreas.slice();
		this.tweezers.targetAreas = this.contaminatedAreas;
		this.btnBack = new BackBtn(this, HospitalEvent.BACK_FROM_MINIGAME);
	}

	private drawMouthWithPoison():void {
		this.background = Sprite.fromFrame("forgiftning_mund_0" + Config.currentPatient.skinType);
		this.background.scale.x = this.background.scale.y = 2;
		this.addChild(this.background);

		this.contaminants = []; //new Vector.<Sprite>();
		this.contaminatedAreas = []; //new Vector.<Sprite>();
		this.contaminatedAreasCreme = []; //new Vector.<Sprite>();

		let contaminantPositions:Point[] = []; //new Vector.<Point>();
		contaminantPositions.push(new Point(380, 300));
		contaminantPositions.push(new Point(450, 280));
		contaminantPositions.push(new Point(500, 400));
		contaminantPositions.push(new Point(640, 300));
		contaminantPositions.push(new Point(800, 600));
		contaminantPositions.push(new Point(900, 500));

		for (let i: number = 0; i < contaminantPositions.length; i++) {
			let position:Point = contaminantPositions[i];
			let randomFrame:number = Math.ceil(Math.random() * 3);

			let contaminatedAreaImage:Sprite = Sprite.fromFrame("insektstik_saar");
			contaminatedAreaImage.pivot.x = contaminatedAreaImage.width * .5;
			contaminatedAreaImage.pivot.y = contaminatedAreaImage.height * .5;
			contaminatedAreaImage.alpha = HospitalGameView.RECT_COVER_ALPHA;
			let contaminatedArea:Sprite = new Sprite();
			contaminatedArea.addChild(contaminatedAreaImage);
			this.addChild(contaminatedArea);
			contaminatedArea.x = position.x;
			contaminatedArea.y = position.y;
			this.contaminatedAreas.push(contaminatedArea);

			let contaminantImage:Sprite = Sprite.fromFrame("forgiftning_gift_0" + randomFrame);
			contaminantImage.pivot.x = contaminantImage.width * .5;
			contaminantImage.pivot.y = contaminantImage.height * .5;
			let contaminant:Sprite = new Sprite();
			contaminant.addChild(contaminantImage);
			this.addChild(contaminant);
			contaminant.x = contaminatedArea.x;
			contaminant.y = contaminatedArea.y;
			this.contaminants.push(contaminant);
		}
	}

	private drawInsectBites():void {
		this.background = Sprite.fromFrame("insektstik_bg_0" + Config.currentPatient.skinType);
		this.background.scale.x = this.background.scale.y = 2;
		this.addChild(this.background);

		this.contaminants = []; //new Vector.<Sprite>();
		this.contaminatedAreas = []; //new Vector.<Sprite>();
		this.contaminatedAreasCreme = []; //new Vector.<Sprite>();

		// var insectBitePositions:Vector.<Point> = new Vector.<Point>();
		let insectBitePositions:Point[] = []; //new Vector.<Point>();
		insectBitePositions.push(new Point(800, 450));
		insectBitePositions.push(new Point(730, 300)); //TODO add back
		insectBitePositions.push(new Point(600, 480));
		insectBitePositions.push(new Point(480, 350));
		insectBitePositions.push(new Point(300, 410));

		for (let i: number = 0; i < insectBitePositions.length; i++) {
			let position:Point = insectBitePositions[i];

			let contaminatedAreaImage:Sprite = Sprite.fromFrame("insektstik_saar");
			contaminatedAreaImage.pivot.x = contaminatedAreaImage.width * .5;
			contaminatedAreaImage.pivot.y = contaminatedAreaImage.height * .5;
			let contaminatedArea:Sprite = new Sprite();
			contaminatedArea.addChild(contaminatedAreaImage);
			this.addChild(contaminatedArea);
			contaminatedArea.x = position.x;
			contaminatedArea.y = position.y;
			this.contaminatedAreas.push(contaminatedArea);

			let contaminantImage:Sprite = Sprite.fromFrame("insektstik_brod");
			contaminantImage.pivot.x = contaminantImage.width * .5;
			contaminantImage.pivot.y = contaminantImage.height;
			let contaminant:Sprite = new Sprite();
			contaminant.addChild(contaminantImage);
			this.addChild(contaminant);
			contaminant.x = contaminatedArea.x;
			contaminant.y = contaminatedArea.y;
			contaminant.rotation = (30 * (Math.PI / 180));
			this.contaminants.push(contaminant);
		}
	}


	private startGame():void {
		Logger.log(this, "PinchingGameView startGame");
		this.contaminantsRemoved = 0;
		this.tweezers.on(HospitalEvent.CONTAMINANT_REMOVED, this.onContaminantRemoved);

		// Help speak
		let speakSound:string;
		if(Config.currentPatient.disease == Level.INSECT_BITE){
			speakSound = "mille_prov_om_du_kan_hive_bistikkene_ud_med_pincetten";
		} else if(Config.currentPatient.disease == Level.POISONING){
			speakSound = "mille_prov_at_traekke_bakterierne_ud_med_pincetten";
		}


		Config.currentTimeout = setTimeout(():void => { //TODO sound
			if(Config.currentSpeakSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
			}
			if(Config.currentSpeakOverlappingViewsSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakOverlappingViewsSound);
			}

			Config.currentSpeakSound = speakSound;
			if(Config.currentSpeakSound != null) {
				this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
			}

			Config.currentTimeout = setTimeout(():void => {
				if(this.contaminantsRemoved == 0){
					if(Config.currentSpeakSound != null) {
						AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
					}

					if(Config.currentPatient.disease == Level.INSECT_BITE){
						Config.currentSpeakSound = "mille_pincetten_skal_have_fat_om_bistikket";
					} else if(Config.currentPatient.disease == Level.POISONING){
						Config.currentSpeakSound = "mille_pincetten_skal_have_fat_om_bakterien";
					}

					if(Config.currentSpeakSound != null) {
						this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
					}
				}
			}, 8000);

		}, 1000);

	}

	private onContaminantRemoved = (event:HospitalEvent):void => {
		// If more than one contaminant has to be removed - check for that
		this.contaminantsRemoved++;

		if(this.contaminantsRemoved == 1){
			if(Config.currentSpeakSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
			}
			if(Config.currentPatient.disease == Level.INSECT_BITE){
				Config.currentSpeakSound = "mille_godt_klaret_kan_du_fjerne_en_mere";
			}else{
				Config.currentSpeakSound = "mille_yey_det_er_flot";
			}

			if(Config.currentSpeakSound != null) {
				this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
			}
		}
		if(this.contaminants.length > 0){

		}else{
			if(Config.currentSpeakSound != null) {
				AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
			}
			Config.currentSpeakSound = "mille_perfekt_alle_bistikkene_er_vaek";
			if(Config.currentSpeakSound != null) {
				this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
			}
			this.tweezers.off(HospitalEvent.CONTAMINANT_REMOVED, this.onContaminantRemoved);
			this.onAllContaminantsRemoved();
		}
	}

	private onAllContaminantsRemoved():void {
		this.tweezers.state = Tweezers.DISABLED;
		this.tweezers.visible = false; //TODO added this to kill tweezers

		if(Config.currentPatient.disease == Level.INSECT_BITE){

			this.cremeTube = new CremeTube(this.contaminatedAreasCreme, this.contaminatedAreaRemovedCallback);
			this.addChild(this.cremeTube);

			TweenLite.from(this.cremeTube, 2, {y:AssetLoader.STAGE_HEIGHT + this.cremeTube.height/2, ease:Elastic.easeInOut});

			Config.currentTimeout = setTimeout(():void => {
				if(Config.currentSpeakSound != null) {
					AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
				}
				Config.currentSpeakSound = "mille_uhh_hvot_sar_bare_klor_helt_vildt_meget_skynd_dig_at_smore_creme_pa";
				if(Config.currentSpeakSound != null) {
					this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
				}
			}, 1000);

		} else if(Config.currentPatient.disease == Level.POISONING){
			this.onGameCompleted();
		}
	}

	private contaminatedAreaRemovedCallback = ():void => {
		this.onGameCompleted();
	}

	private onGameCompleted = ():void => {
		if(Config.currentSpeakSound != null) {
			AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
		}
		Config.currentSpeakSound = "mille_sadan_det_var_du_rigtig_god_til";
		if(Config.currentSpeakSound != null) {
			this.sndSpeak = AudioPlayer.getInstance().playSound(Config.currentSpeakSound, 0, Config.SPEAK_VOLUME_LEVEL);
			this.sndSpeak.on(AudioPlayer.AUDIO_COMPLETE, this.audioGameCompletedComplete);
		}
	}

	private audioGameCompletedComplete = (event:Event):void => {
		this.sndSpeak.off(AudioPlayer.AUDIO_COMPLETE, this.audioGameCompletedComplete);
		if(Config.currentPatient.disease == Level.INSECT_BITE){
			this.emit(HospitalEvent.PATIENT_CURED);
		}
		this.emit(HospitalEvent.MINIGAME_COMPLETED);
	}

	private quitGame():void {
		this.emit("backFromTestGame");
	}

	public destroy():void {
		if(this.btnBack != null){
			this.btnBack.destroy();
			this.btnBack = null;
		}

		if(this.cremeTube != null) {
			this.removeChild(this.cremeTube);
			this.cremeTube.destroy();
			this.cremeTube = null;
		}
		if(this.tweezers != null) {
			this.removeChild(this.tweezers);
			this.tweezers.destroy();
			this.tweezers = null;
		}
		if(this.background != null) {
			this.removeChild(this.background);
			this.background = null;
		}
		if(this.bgQuad != null) {
			this.removeChild(this.bgQuad);
			this.bgQuad = null;
		}
		if(this.contaminants.length > 0){
			for (let i:number = 0; i < this.contaminants.length; i++) {
				try{
					let contaminant: Sprite = this.contaminants[i];
					this.removeChild(contaminant);
				} catch (error) {
					Logger.log(this, "CATCH this.removeChild(contaminant)");
				}
			}
			this.contaminants = null;
		}
		if(this.contaminatedAreas.length > 0){
			for (let i:number = 0; i < this.contaminatedAreas.length; i++) {
				try{
					let contaminatedArea: Sprite = this.contaminatedAreas[i];
					this.removeChild(contaminatedArea);
				} catch (error) {
					Logger.log(this, "CATCH this.removeChild(contaminatedArea)");
				}
			}
			this.contaminatedAreas = null;
		}

		if(Config.currentSpeakSound != null) {
			AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
		}

		super.destroy();
	}
}
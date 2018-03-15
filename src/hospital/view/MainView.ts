// package appdrhospital.view
// {
// 	import com.greensock.TweenMax;
//
// 	import flash.geom.Rectangle;
// 	import flash.media.SoundMixer;
// 	import flash.system.System;
// 	import flash.utils.Dictionary;
//
// 	import appdrhospital.Config;
// 	import appdrhospital.event.HospitalEvent;
// 	import appdrhospital.utils.SoundManager;
// 	import appdrhospital.view.frontpage.FrontPageView;
// 	import appdrhospital.view.minigames.followpathgame.FollowPathGameView;
// 	import appdrhospital.view.minigames.pinchinggame.PinchingGameView;
// 	import appdrhospital.view.minigames.puzzlegame.PuzzleGameView;
// 	import appdrhospital.view.minigames.shootbacteriagame.ShootBacteriaGameView;
// 	import appdrhospital.view.minigames.soothinggame.SoothingGameView;
// 	import appdrhospital.view.minigames.wipingame.WipingGameView;
// 	import appdrhospital.view.operatingroom.OperatingRoomView;
// 	import appdrhospital.view.operatingroom.objects.Scanner;
// 	import appdrhospital.view.waitingroom.WaitingRoomView;
// 	import appdrhospital.vo.Level;
//
// 	import starling.display.Quad;
// 	import starling.display.Sprite;


import {Config} from "../Config";
import {HospitalGameView} from "./HospitalGameView";
import {Logger} from "../../loudmotion/utils/debug/Logger";
import {Button} from "../../loudmotion/ui/Button";
import {AssetLoader} from "../utils/AssetLoader";

import {HospitalEvent} from "../event/HospitalEvent";
import {AudioPlayer} from "../../loudmotion/utils/AudioPlayer";
import {ButtonEvent} from "../event/ButtonEvent";

import { Initializer } from "../Initializer";
import { Main } from "../../Main";
import {WaitingRoomView} from "./waitingroom/WaitingRoomView";
import {Level} from "../vo/Level";
import {PinchingGameView} from "./minigames/pinchinggame/PinchingGameView";
import {PuzzleGameView} from "./minigames/puzzlegame/PuzzleGameView";
import {SoothingGameView} from "./minigames/soothinggame/SoothingGameView";
import {FollowPathGameView} from "./minigames/followpathgame/FollowPathGameView";
import {ShootBacteriaGameView} from "./minigames/shootbacteriagame/ShootBacteriaGameView";
import {WipingGameView} from "./minigames/wipingame/WipingGameView";
import {FrontPageView} from "./frontpage/FrontPageView";
import {OperatingRoomView} from "./operatingroom/OperatingRoomView";
import {AssemblingGameView} from "./minigames/assemblinggame/AssemblingGameView";
import {Scanner} from "./operatingroom/objects/Scanner";
import {Graphics, Texture, Rectangle, Sprite, Container} from "pixi.js";
import {TouchEvent} from "../../loudmotion/events/TouchLoudEvent";
import {TouchPhase} from "../../loudmotion/events/TouchLoudPhase";
import AbstractSoundInstance = createjs.AbstractSoundInstance;
import {BackBtn} from "./buttons/BackBtn";

import SoundJS = createjs.SoundJS;
import WebGLRenderer = PIXI.WebGLRenderer;
import CanvasRenderer = PIXI.CanvasRenderer;


export class MainView extends Sprite {

	private bg:Graphics;
	// private sndMan:SoundManager;
	private currentView:HospitalGameView;
	private currentMusic:string;
	private diseaseGameMap:any; //Dictionary;


	// private backButton:Button;

	// from viewmanager for resizing canvas
	private r_old:number;
	private r_new:number;
	private old_w:number = AssetLoader.STAGE_WIDTH;
	private old_h:number = AssetLoader.STAGE_HEIGHT;
	private new_w:number = 1;
    private new_h:number = 1;
	private _localStorageAvailable:boolean;


    hospitalCanvas: HTMLCanvasElement;
    hospitalCSS: HTMLStyleElement;
    private _renderer: WebGLRenderer | CanvasRenderer;
    private soundMusic: Howl;
    private ratio: number;

	private stage:Container;

	constructor(){
		super();
		// this.addListener(starling.events.Event.ADDED_TO_STAGE, this.added);
		// this.init();
	}


    public init(): void{
        console.log("MainView init - AssetLoaderRumspil.STAGE_WIDTH: " + AssetLoader.STAGE_WIDTH);

		AudioPlayer.getInstance().volume = 1;

		if(Initializer.showLoaderCallbackFunction != null) {
			Initializer.showLoaderCallbackFunction(); //TODO
		}
		// AssetLoader.getInstance().init(this.assetsLoaderComplete); //TODO need this to get stage setup in AssetLoader
        //AssetLoader.getInstance().init(this.textureCompleteHandler); //TODO need this to get stage setup in AssetLoader, also starts AssetLoader
        AssetLoader.getInstance().init();
		//this.stage = AssetLoader.getInstance().stage;

		Config.safeFrame = new Rectangle(Math.floor((AssetLoader.STAGE_WIDTH-1024) * 0.5), 0, 1024, AssetLoader.STAGE_HEIGHT); //TODO from hospitalGame

		// bg = new Quad(stage.width, stage.height, 0x12001a);
		// addChild(bg);
		//this.bg = new Graphics();
		//this.bg.beginFill(0x12001a);
		//// set the line style to have a width of 5 and set the color to red
		//// this.background.lineStyle(5, 0xFF0000);
		//// draw a rectangle
		//this.bg.drawRect(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
		//// this.stage.addChild(this.bg);
		//this.addChild(this.bg);

		//let aspect:number = AssetLoader.getInstance().hospitalCanvas.clientWidth / AssetLoader.getInstance().hospitalCanvas.clientHeight;
		//Logger.log(this, "MainView  init  aspect == "+aspect);

		

		if (Modernizr.localstorage) {
			// window.localStorage is available!
			this._localStorageAvailable = true;
			Logger.log(this, "MainView init  : Modernizr says : window.localStorage is available!");
		} else {
			// no native support for local storage :(
			// try a fallback or another third-party solution
			Logger.log(this, "MainView Modernizr says : NO GOOD no native support for local storage");
		}
        
		//AssetLoader.getInstance().loadAssets();
		// this.onStart();
        // setTimeout(() => this.onStart(), 1000);
        //this.ratio =100-( 854 / 1364);
        this.hospitalCanvas = <HTMLCanvasElement>document.getElementById('canvas_hospital');
        this.hospitalCSS = <HTMLStyleElement>document.getElementsByTagName('style')[1];

        this.stage = new PIXI.Container();
        this._renderer = PIXI.autoDetectRenderer(AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT, { view: this.hospitalCanvas, transparent: true });
        //this.hospitalCanvas = <HTMLCanvasElement>document.getElementById('canvas_hospital');
        this._renderer.view.style['transform'] = 'translatez(0)';

        this.stage = new PIXI.Container();
        this.stage.interactive = true;
        this.stage.hitArea = new Rectangle(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
        // this._renderer.view.width = 1364;
        // this._renderer.view.height = 768;
        // this._renderer.resize(1364 * 2, 768 * 2)
        // this._renderer.screen = new PIXI.Rectangle(0,0,1364*2, 768*2);

        //Logger.log(this, "this.stage.position.x: " + this.stage.position.x);
        //Logger.log(this, "this.stage.position.y: " + this.stage.position.y);

        //Logger.log(this, "this.stage.width: " + this.stage.width);
        //Logger.log(this, "this.stage.height: " + this.stage.height);

        //Logger.log(this, "this._renderer.resolution: " + this._renderer.resolution);
        //Logger.log(this, "this._renderer.width: " + this._renderer.width);

        //Logger.log(this, "Main.DIV_ELEMENT.width: " + Main.DIV_ELEMENT.width);
        //Logger.log(this, "Main.DIV_ELEMENT.height: " + Main.DIV_ELEMENT.height);

        // document.body.appendChild(this._renderer.view);

       
        $(window).on('resize', this.handleResize);
        this.handleResize();
        //Main.DIV_ELEMENT.appendChild(this._renderer.view);


        ////Render the stage
        //this._renderer.render(this.stage);

        requestAnimationFrame(this.update);


        this.onSoundsLoadedComplete();

        // $(window).on('resize', this.handleResize);
        // this.handleResize();


	}
    public update = (): void => {

        if (this.stage && this.stage.children.length > 0) {
            this._renderer.render(this.stage);
        }

        requestAnimationFrame(this.update);
    }
	// private backButtonClicked = (event: ButtonEvent) => {
	// 	Logger.log(this, "MainView  backButtonClicked");
    //
	// 	if(Initializer.exitCallbackFunction) {
	// 		Initializer.exitCallbackFunction(this);
	// 	}
    //
	// 	Logger.log(this, "MainView go back to DR");
    //
	// 	// this.disposeCharacter();
	// 	//
	// 	// if (this.currentSceneIndex == Model.SCENE_INTRO) {
	// 	// 	this.dispose();
	// 	// 	// Initializer.exitCallbackFunction(this); //TODO Orig TEMP take out
	// 	// } else {
	// 	// 	this.handleSceneProgress(new SceneEvent(SceneEvent.JUMP, Model.SCENE_INTRO, true))
	// 	// }
	// }

	//private textureCompleteHandler = ():void => { //resources:dragonBones.Map<loaders.Resource>
	//	Logger.log(this, "MainView textureCompleteHandler");

	//	this.setupUI();
	//	// this.setupSoundManager();  //TODO removed temp


	//	if(Initializer.hideLoaderCallbackFunction) {
	//		Initializer.hideLoaderCallbackFunction(); //TODO add this back TEMP removed
	//	}

	//}

	//private setupUI():void {
	//	Logger.log(this, "MainView setupUI");
	//	AssetLoader.getInstance().loadSoundUrl(this.onSoundsLoadedComplete);
	//}

	private onSoundsLoadedComplete = ():void => {
		Logger.log(this, "onSoundsLoadedComplete");
		this.setupHospital();
	}

	private setupHospital():void {
		Logger.log(this, "MainView setupHospital");

		// Level design
        // TODO: Validate data (persistent store)

        // Testing persistent store
        Logger.log(this, "Main.RAMASJANG_API.version: " + Main.RAMASJANG_API.version);
        // Main.RAMASJANG_API.store.set("testKey", "testValue");
        // Logger.log(this, "Main.RAMASJANG_API.store.get(testKey): " + Main.RAMASJANG_API.store.get("testKey"))

  

		Config.levels = []; //new Vector.<Level>();


		// //unlockedTools:any, unlockedDiseases:Array, unlockedClothes:Array, unlockedBandage:Array, unlockedBandAid:Array, unlockedLemonade:Array

		Config.levels.push(new Level([Scanner.SKELETAL], [Level.FRACTURE_RADIUS, Level.BURN, Level.INSECT_BITE], [], [], [], []));

		Config.levels.push(new Level([], [], [Level.CLOTHES_UPPER_1], [Level.BANDAGE_1], [], []));

		Config.levels.push(new Level([Scanner.MUSCULAR], [Level.SPRAIN], [Level.CLOTHES_LOWER_1], [], [Level.BAND_AID_1], []));

		Config.levels.push(new Level([], [Level.FRACTURE_HAND], [Level.CLOTHES_UPPER_2], [Level.BANDAGE_2], [], []));

		Config.levels.push(new Level([Scanner.DIGESTIVE], [Level.POISONING], [Level.CLOTHES_LOWER_2], [], [Level.BAND_AID_2], []));

		Config.levels.push(new Level([], [], [Level.CLOTHES_UPPER_3], [], [], [Level.LEMONADE_1]));

		Config.levels.push(new Level([Scanner.RESPIRATORY_AND_UNINARY], [Level.PNEUMONIA], [Level.CLOTHES_LOWER_3], [Level.BANDAGE_3], [], []));

		Config.levels.push(new Level([], [], [Level.CLOTHES_UPPER_4], [], [Level.BAND_AID_3], []));

		Config.levels.push(new Level([Scanner.CARDIOVASCULAR], [], [Level.CLOTHES_LOWER_4], [Level.BANDAGE_4], [], []));

		Config.levels.push(new Level([], [], [Level.CLOTHES_UPPER_5], [], [], [Level.LEMONADE_2]));

		Config.levels.push(new Level([Scanner.NERVOUS], [], [Level.CLOTHES_LOWER_5], [], [Level.BAND_AID_4], []));

		Config.levels.push(new Level([], [], [Level.CLOTHES_UPPER_6], [Level.BANDAGE_5], [], []));

		Config.levels.push(new Level([], [], [Level.CLOTHES_LOWER_6], [], [Level.BAND_AID_5], []));

		Config.levels.push(new Level([], [], [Level.CLOTHES_UPPER_7], [Level.BANDAGE_6], [], []));

		Config.levels.push(new Level([], [], [Level.CLOTHES_LOWER_7], [], [], [Level.LEMONADE_3]));

		Config.levels.push(new Level([], [], [Level.CLOTHES_UPPER_8], [], [Level.BAND_AID_6], []));

		Config.levels.push(new Level([], [], [Level.CLOTHES_LOWER_8], [Level.BANDAGE_7], [], []));

		Config.levels.push(new Level([], [], [Level.CLOTHES_UPPER_9], [], [Level.BAND_AID_7], []));

		Config.levels.push(new Level([], [], [Level.CLOTHES_LOWER_9], [Level.BANDAGE_8], [], []));

		Config.levels.push(new Level([], [], [Level.CLOTHES_UPPER_10], [], [], [Level.LEMONADE_4]));

		Config.levels.push(new Level([], [], [Level.CLOTHES_LOWER_10], [Level.BANDAGE_9], [], []));

		Config.levels.push(new Level([], [], [Level.CLOTHES_UPPER_11], [], [Level.BAND_AID_8], []));

		Config.levels.push(new Level([], [], [Level.CLOTHES_LOWER_11], [Level.BANDAGE_10], [], []));

		Config.levels.push(new Level([], [], [Level.CLOTHES_UPPER_12], [], [], [Level.LEMONADE_5]));

		Config.levels.push(new Level([], [], [Level.CLOTHES_LOWER_12], [], [Level.BAND_AID_9], []));

		Config.levels.push(new Level([], [], [], [], [], []));

		// List of cured diseases (used in trophy display)
		// Change: Read from saved data
		// Config.curedDiseases = [];

		// Mapping of diseases to games
		this.diseaseGameMap = {}; //new Dictionary();
		this.diseaseGameMap[Level.INSECT_BITE] = PinchingGameView;
		this.diseaseGameMap[Level.FRACTURE_HAND] = PuzzleGameView;
		this.diseaseGameMap[Level.FRACTURE_RADIUS] = PuzzleGameView;
		this.diseaseGameMap[Level.SPRAIN] = SoothingGameView;
		this.diseaseGameMap[Level.POISONING] = FollowPathGameView;
		this.diseaseGameMap[Level.PNEUMONIA] = ShootBacteriaGameView;
		this.diseaseGameMap[Level.BURN] = WipingGameView;


		// set initial gamestate
		Config.gameState = Config.INTRO;

		// FOR TESTING. Otherwise this value is read from cookie
//			Config.patientsCured = 1;
//			Config.dataSaver.save(String(Config.patientsCured));

//			
// 			// Intro theme
// 		this.currentMusic = "intro";
// 		sndMan.playSound(currentMusic); //TODO sound
//			
// //			currentMusic = "operation_room_music_loop";
        // //			sndMan.playSound(currentMusic, 0.2 , 999 );
        this.currentMusic = "intro";
        this.soundMusic = AudioPlayer.getInstance().playSound("intro", 999, 0.2);
        this.showView(FrontPageView);
           
        
            
        
		
		

		// this.showView(ShootBacteriaGameView);
		// this.showView(FollowPathGameView);

		// this.showView(WaitingRoomView);
		// this.showView(OperatingRoomView);
		// this.showView(SoothingGameView);
		// this.showView(PinchingGameView);
		// this.showView(PuzzleGameView);
		// this.showView(WipingGameView);
		// this.showView(AssemblingGameView);
		// this.showView(FollowPathGameView);
	}

		//-------------------------------------------------------------------------------------------------------------------------------------

		private onFrontpageExited = (event:HospitalEvent):void => {
			//Logger.log(this, "MainView onFrontpageExited this == "+this);

			//let newMusic:string = "waiting_room_loop";
            if (this.currentMusic != null) {
				AudioPlayer.getInstance().stopSound("intro");
            }
            this.currentMusic = "waiting_room_loop";
            AudioPlayer.getInstance().playSound(this.currentMusic, 999, Config.MUSIC_VOLUME_LEVEL);

			// let newMusic:string = "waiting_room_loop"; //TODO sound
			// if(sndMan.soundIsPlaying(currentMusic) && newMusic != currentMusic){
			// 	sndMan.crossFade(currentMusic, newMusic, 0.3, 1, 999);
			// }else{
			// 	sndMan.playSound(newMusic, 1 , 999 );
			// }
			// this.currentMusic = newMusic;

            Config.gameState = Config.IDLE;
            
            //AudioPlayer.getInstance().crossFade("intro", "waiting_room_loop", 1000, 1, 999);
            
            // For testing
//			Config.gameState = Config.POST_TREATMENT;

			this.showView(WaitingRoomView);
		}



	// ////-------------------------------------------------------------------------------------------------------------------------------------
		private onShootBacteriaGameCompleted = (e:HospitalEvent):void => {
			Logger.log(this, "MainView.onShootBacteriaGameCompleted(e)");
// 			sndMan.stopSound("lung_breath_sfx_loop_v02"); //TODO sound
			AudioPlayer.getInstance().stopSound("lung_breath_sfx_loop_v02");
		}


	// //-------------------------------------------------------------------------------------------------------------------------------------
		private onPatientSelected = (e:HospitalEvent):void => {
			Config.gameState = Config.EXAMINING;

//			//var newMusic:string = "operation_room_music_loop";
//
//			//if(newMusic != currentMusic){
//				//sndMan.crossFade(currentMusic, newMusic, 0.3, 1, 999);
//				//currentMusic = newMusic;
//			//}

			this.showView(OperatingRoomView);
		}

	// //-------------------------------------------------------------------------------------------------------------------------------------
		private onDiseaseHotspotPressed = (e:HospitalEvent):void => {
			Logger.log(this, "MainView onDiseaseHotspotPressed ");

			// Decrease music volume
//			//sndMan.tweenVolume(currentMusic, 0.2, 1);


			if(Config.currentPatient.disease == Level.POISONING){
				if(Config.gameState == Config.EXAMINING){
					this.showView(PinchingGameView);
				} else if(Config.gameState == Config.BETWEEN_TREATMENTS){
					this.showView(FollowPathGameView);
				}

			}else if(Config.currentPatient.disease == Level.BURN){
				if(Config.gameState == Config.EXAMINING){
					this.showView(WipingGameView);
				} else if(Config.gameState == Config.BETWEEN_TREATMENTS){
					this.showView(SoothingGameView);
				}

			}else{

				// Show minigame corresponding to current patient's disease
				this.showView(this.diseaseGameMap[Config.currentPatient.disease]);
			}

		}


	// //-------------------------------------------------------------------------------------------------------------------------------------
		private onPatientCured = (e:HospitalEvent):void => {
			Logger.log(this, "MainView.onPatientCured(e)");

			Config.patientsCured++;

			Logger.log(this, "Config.patientsCured: " + Config.patientsCured);

			Config.setCurrentPatientCured();

			Config.updateCuredPatients();


			// Save data
            let patientsCuredStringify: string = String(Config.patientsCured);
            console.log("patientsCuredStringify " + patientsCuredStringify);
            console.log("Config.patientsCured " + Config.patientsCured);
			let curedDiseasesStringify:string = Config.curedDiseases.join();
			Logger.log(this, "Save data");
			Logger.log(this, "Config.patientsCured=== " + Config.patientsCured);
			Logger.log(this, "Config.curedDiseases=== " + Config.curedDiseases);
			Logger.log(this, "patientsCuredStringify=== " + patientsCuredStringify);
			Logger.log(this, "curedDiseasesStringify=== " + curedDiseasesStringify);
			// AppController.getInstance().setLocalStorage(PreloadImages.BOOK_IMAGE_ASSETS, bookImgAssetsStringify);
            
            Config.dataSaver.save(patientsCuredStringify); //TODO saveData
            Config.dataSaver.saveDiseases(curedDiseasesStringify); //TODO saveData


			// Increase music volume
//			//sndMan.tweenVolume(currentMusic, 1, 1);

		}

		
		// //-------------------------------------------------------------------------------------------------------------------------------------
		private onMiniGameCompleted = (e:HospitalEvent):void => {
			Logger.log(this, "MainView.onMiniGameCompleted(e)");
			Logger.log(this, "Config.currentPatient.disease: " + Config.currentPatient.disease);
			Logger.log(this, "Config.gameState: " + Config.gameState);


			// Poisoning and burn has two minigame treatments
			if((Config.currentPatient.disease == Level.POISONING || Config.currentPatient.disease == Level.BURN) && Config.gameState == Config.EXAMINING){
				Config.gameState = Config.BETWEEN_TREATMENTS;
			}else{
				Config.gameState = Config.POST_TREATMENT;
			}

			if((Config.currentPatient.disease == Level.POISONING) && Config.gameState == Config.BETWEEN_TREATMENTS){
				this.showView(FollowPathGameView);
			}else if((Config.currentPatient.disease == Level.BURN) && Config.gameState == Config.BETWEEN_TREATMENTS){
				this.showView(SoothingGameView);
			}else{

				// Increase music volume
                //				//sndMan.tweenVolume(currentMusic, 1, 1);
                
				this.showView(OperatingRoomView);
			}
		}
		
		// //-------------------------------------------------------------------------------------------------------------------------------------
		private onBackFromMiniGame = (e:HospitalEvent):void => {
//			// Logger.log(this, "MainView.onBackFromMiniGame(e)");
//			// Logger.log(this, "Config.currentPatient.disease: " + Config.currentPatient.disease);
//			// Logger.log(this, "Config.gameState: " + Config.gameState);
//            //
//            //
//			// var newMusic:string = "waiting_room_loop";
 //           //
//			// if(newMusic != currentMusic){
//			// 	sndMan.crossFade(currentMusic, newMusic, 0.3, 1, 999);
//			// 	currentMusic = newMusic;
//			// }
            
			this.showView(WaitingRoomView);
		}
		
		// // -------------------------------------------------------------------------------------------------------------------------------------
		private onBackFromOperatingRoom = (e:HospitalEvent):void => {
			Logger.log(this, "MainView onBackFromOperatingRoom");
//			var newMusic:string = "waiting_room_loop";
//
//			if(newMusic != currentMusic){
//				sndMan.crossFade(currentMusic, newMusic, 0.3, 1, 999);
//				currentMusic = newMusic;
            //			}
			this.showView(WaitingRoomView);
		}

		private destroyPreviousView():void{
			Logger.log(this, "MainView destroyPreviousView");
			if(this.currentView != null) {
				if(this.currentView.name != null) {
					Logger.log(this, "MainView destroyPreviousView  this.currentView.name == " + this.currentView.name);
                }
                console.log("REMOVING: " + this.currentView.name);
                (this.currentView as HospitalGameView).destroy();
				this.currentView = null;
			}
			Logger.log(this, "MainView destroyPreviousView AFTER this.currentView == "+this.currentView);
		}

		
		// //-------------------------------------------------------------------------------------------------------------------------------------
		// private showView(view:Class):void{
		private showView(view:any):void{
			Logger.log(this, "MainView showView");
			Logger.log(this, "MainView showView view == "+view.name);
			if(this.currentView != null && this.currentView.name != null) {
				Logger.log(this, "MainView showView this.currentView == " + this.currentView.name);
			}

			this.destroyPreviousView();
			// System.pauseForGCIfCollectionImminent(0); //TODO
			// System.gc();

			this.currentView = new view();
			this.currentView.init();
			this.stage.addChild (this.currentView);
			this.currentView.show();

			// Event listeners
			this.currentView.on(HospitalEvent.PATIENT_CURED, this.onPatientCured);
			this.currentView.on(HospitalEvent.SHOOT_BACTERIA_GAME_COMPLETED, this.onShootBacteriaGameCompleted);
			this.currentView.on(HospitalEvent.PATIENT_SELECTED, this.onPatientSelected);
			this.currentView.on(HospitalEvent.DISEASE_HOTSPOT_PRESSED, this.onDiseaseHotspotPressed);
			this.currentView.on(HospitalEvent.MINIGAME_COMPLETED, this.onMiniGameCompleted);
            this.currentView.on(HospitalEvent.FRONTPAGE_EXITED, this.onFrontpageExited);
            if (this.currentView.name != "WaitingRoomView") {
                if (this.currentView.name != "FrontPageView") {
                    this.currentView.btnBack.on(HospitalEvent.BACK_FROM_OPERATING_ROOM, this.onBackFromOperatingRoom);

                    if (this.currentView.btnToWaitingRoom != null) {
                        this.currentView.btnToWaitingRoom.on(HospitalEvent.BACK_FROM_OPERATING_ROOM, this.onBackFromOperatingRoom);
                    }
                    this.currentView.btnBack.on(HospitalEvent.BACK_FROM_MINIGAME, this.onBackFromMiniGame);
                }
            }
		}

        public handleResize = (event: Event = null): void =>
        {
            // Logger.log(this, "MainView MainView handleResize");
            //http://stackoverflow.com/questions/6023488/how-to-proportionally-respecting-aspect-ratio-scale-a-rectangle
            this.new_w = window.innerWidth;
            this.new_h = window.innerHeight;

            this.r_old = this.old_w / this.old_h;
            this.r_new = this.new_w / this.new_h;
            let width: number;
            let height: number;
            if (this.r_old > this.r_new)
            {
                width = this.new_w;
                console.log("BEFORE: " + width);
                height = width / this.r_old;
                AssetLoader.getInstance().ratioX = width;
                width = width * this.new_h / height;
                console.log("AFTER: " + width);
                AssetLoader.getInstance().ratioX = width - AssetLoader.getInstance().ratioX;
                this.hospitalCSS.innerHTML += ".center-this {position: absolute; left: -" + Math.floor(AssetLoader.getInstance().ratioX / 2) + "px; -webkit - transform: translate(-50 %, 0);}"
                height = this.new_h;


            } else
            {

                height = this.new_h;
                console.log("BEFORE: " + height);
                width = height * this.r_old;
                AssetLoader.getInstance().ratioY = height;
                height = height * this.new_w / width;
                console.log("AFTER: " + height);
                AssetLoader.getInstance().ratioY = height - AssetLoader.getInstance().ratioY;
                this.hospitalCSS.innerHTML += ".center-this {position: absolute; top: -" + Math.floor(AssetLoader.getInstance().ratioY / 2) + "px; -webkit - transform: translate(-50 %, 0);}"
                width = this.new_w;
            }
            //let extra = this.new_w - width;
            //width += extra;

            this._renderer.view.style.width = width + "px"; //TODO orig
            this._renderer.view.style.height = height + "px";


            this.new_w = width;
            this.new_h = height;

        }
		
		// //Destroy
		// //-------------------------------------------------------------------------------------------------------------------------------------
		public destroyApp = ():void => {
			Logger.log(this, "MainView destroyApp");
			Logger.log(this, "MainView destroyApp  this.currentView ==== "+this.currentView);
			// this.currentView.btnBack.off(HospitalEvent.QUIT_APP, this.destroyApp);
			TweenMax.killAll();
			// SoundMixer.stopAll(); //TODO sound

			// sndMan.stopAllSounds(); //TODO sound
			// sndMan.dispose();
			// SoundManager.killInstance();

			Logger.log(this, "MainView destroyApp destroy Sound");
			AudioPlayer.getInstance().stopAllSounds();
			AudioPlayer.getInstance().destroy();
			Logger.log(this, "MainView destroyApp AFTER destroy Sound");

			if(this.bg != null) {
				this.removeChild(this.bg);
				this.bg = null;
			}


			if(this.currentView != null){
				// this.currentView.off(HospitalEvent.PATIENT_CURED, this.onPatientCured);
				// this.currentView.off(HospitalEvent.QUIT_APP, this.destroy);
				// this.currentView.off(HospitalEvent.SHOOT_BACTERIA_GAME_COMPLETED, this.onShootBacteriaGameCompleted);
				// this.currentView.off(HospitalEvent.PATIENT_SELECTED, this.onPatientSelected);
				// this.currentView.off(HospitalEvent.DISEASE_HOTSPOT_PRESSED, this.onDiseaseHotspotPressed);
				// this.currentView.off(HospitalEvent.BACK_FROM_OPERATING_ROOM, this.onBackFromOperatingRoom);
				// this.currentView.off(HospitalEvent.MINIGAME_COMPLETED, this.onMiniGameCompleted);
				// this.currentView.off(HospitalEvent.BACK_FROM_MINIGAME, this.onBackFromMiniGame);
				// this.currentView.off(HospitalEvent.FRONTPAGE_EXITED, this.onFrontpageExited);

				this.currentView.off(HospitalEvent.PATIENT_CURED, this.onPatientCured);
				this.currentView.off(HospitalEvent.SHOOT_BACTERIA_GAME_COMPLETED, this.onShootBacteriaGameCompleted);
				this.currentView.off(HospitalEvent.PATIENT_SELECTED, this.onPatientSelected);
				this.currentView.off(HospitalEvent.DISEASE_HOTSPOT_PRESSED, this.onDiseaseHotspotPressed);
				this.currentView.off(HospitalEvent.MINIGAME_COMPLETED, this.onMiniGameCompleted);
				this.currentView.off(HospitalEvent.FRONTPAGE_EXITED, this.onFrontpageExited);
                if (this.currentView.name != "WaitingRoomView") {
                    if (this.currentView.name != "FrontPageView") {
                        this.currentView.btnBack.off(HospitalEvent.BACK_FROM_OPERATING_ROOM, this.onBackFromOperatingRoom);
                        if (this.currentView.btnToWaitingRoom != null) {
                            this.currentView.btnToWaitingRoom.off(HospitalEvent.BACK_FROM_OPERATING_ROOM, this.onBackFromOperatingRoom);
                        }
                        this.currentView.btnBack.off(HospitalEvent.BACK_FROM_MINIGAME, this.onBackFromMiniGame);
                    }
                }

				
				this.currentView = null;
			}

			Logger.log(this, "MainView destroyApp AFTER this.currentView ==== "+this.currentView);


			

			Logger.log(this, "MainView AFTER this.stage.removeChildren");

			// dispatchEvent(new HospitalEvent(HospitalEvent.KILL_GAME))
			Logger.log(this, "MainView destroyApp call emit");
			this.emit(HospitalEvent.KILL_GAME);

			try{
				AssetLoader.getInstance().destroy();
			} catch (Error) {
				Logger.log(this, "ERROR MainView AssetLoader.getInstance().destroy()");
			}

			Logger.log(this, "MainView destroyApp AFTER AssetLoader.getInstance().destroy");

		}
}
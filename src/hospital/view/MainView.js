"use strict";
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("../Config");
var Logger_1 = require("../../loudmotion/utils/debug/Logger");
var AssetLoader_1 = require("../utils/AssetLoader");
var HospitalEvent_1 = require("../event/HospitalEvent");
var AudioPlayer_1 = require("../../loudmotion/utils/AudioPlayer");
var Initializer_1 = require("../Initializer");
var Main_1 = require("../../Main");
var WaitingRoomView_1 = require("./waitingroom/WaitingRoomView");
var Level_1 = require("../vo/Level");
var PinchingGameView_1 = require("./minigames/pinchinggame/PinchingGameView");
var PuzzleGameView_1 = require("./minigames/puzzlegame/PuzzleGameView");
var SoothingGameView_1 = require("./minigames/soothinggame/SoothingGameView");
var FollowPathGameView_1 = require("./minigames/followpathgame/FollowPathGameView");
var ShootBacteriaGameView_1 = require("./minigames/shootbacteriagame/ShootBacteriaGameView");
var WipingGameView_1 = require("./minigames/wipingame/WipingGameView");
var FrontPageView_1 = require("./frontpage/FrontPageView");
var OperatingRoomView_1 = require("./operatingroom/OperatingRoomView");
var Scanner_1 = require("./operatingroom/objects/Scanner");
var pixi_js_1 = require("pixi.js");
var MainView = /** @class */ (function (_super) {
    __extends(MainView, _super);
    function MainView() {
        var _this = _super.call(this) || this;
        _this.old_w = AssetLoader_1.AssetLoader.STAGE_WIDTH;
        _this.old_h = AssetLoader_1.AssetLoader.STAGE_HEIGHT;
        _this.new_w = 1;
        _this.new_h = 1;
        _this.update = function () {
            if (_this.stage && _this.stage.children.length > 0) {
                _this._renderer.render(_this.stage);
            }
            requestAnimationFrame(_this.update);
        };
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
        _this.onSoundsLoadedComplete = function () {
            Logger_1.Logger.log(_this, "onSoundsLoadedComplete");
            _this.setupHospital();
        };
        //-------------------------------------------------------------------------------------------------------------------------------------
        _this.onFrontpageExited = function (event) {
            //Logger.log(this, "MainView onFrontpageExited this == "+this);
            //let newMusic:string = "waiting_room_loop";
            if (_this.currentMusic != null) {
                AudioPlayer_1.AudioPlayer.getInstance().stopSound("intro");
            }
            _this.currentMusic = "waiting_room_loop";
            AudioPlayer_1.AudioPlayer.getInstance().playSound(_this.currentMusic, 999, Config_1.Config.MUSIC_VOLUME_LEVEL);
            // let newMusic:string = "waiting_room_loop"; //TODO sound
            // if(sndMan.soundIsPlaying(currentMusic) && newMusic != currentMusic){
            // 	sndMan.crossFade(currentMusic, newMusic, 0.3, 1, 999);
            // }else{
            // 	sndMan.playSound(newMusic, 1 , 999 );
            // }
            // this.currentMusic = newMusic;
            Config_1.Config.gameState = Config_1.Config.IDLE;
            //AudioPlayer.getInstance().crossFade("intro", "waiting_room_loop", 1000, 1, 999);
            // For testing
            //			Config.gameState = Config.POST_TREATMENT;
            _this.showView(WaitingRoomView_1.WaitingRoomView);
        };
        // ////-------------------------------------------------------------------------------------------------------------------------------------
        _this.onShootBacteriaGameCompleted = function (e) {
            Logger_1.Logger.log(_this, "MainView.onShootBacteriaGameCompleted(e)");
            // 			sndMan.stopSound("lung_breath_sfx_loop_v02"); //TODO sound
            AudioPlayer_1.AudioPlayer.getInstance().stopSound("lung_breath_sfx_loop_v02");
        };
        // //-------------------------------------------------------------------------------------------------------------------------------------
        _this.onPatientSelected = function (e) {
            Config_1.Config.gameState = Config_1.Config.EXAMINING;
            //			//var newMusic:string = "operation_room_music_loop";
            //
            //			//if(newMusic != currentMusic){
            //				//sndMan.crossFade(currentMusic, newMusic, 0.3, 1, 999);
            //				//currentMusic = newMusic;
            //			//}
            _this.showView(OperatingRoomView_1.OperatingRoomView);
        };
        // //-------------------------------------------------------------------------------------------------------------------------------------
        _this.onDiseaseHotspotPressed = function (e) {
            Logger_1.Logger.log(_this, "MainView onDiseaseHotspotPressed ");
            // Decrease music volume
            //			//sndMan.tweenVolume(currentMusic, 0.2, 1);
            if (Config_1.Config.currentPatient.disease == Level_1.Level.POISONING) {
                if (Config_1.Config.gameState == Config_1.Config.EXAMINING) {
                    _this.showView(PinchingGameView_1.PinchingGameView);
                }
                else if (Config_1.Config.gameState == Config_1.Config.BETWEEN_TREATMENTS) {
                    _this.showView(FollowPathGameView_1.FollowPathGameView);
                }
            }
            else if (Config_1.Config.currentPatient.disease == Level_1.Level.BURN) {
                if (Config_1.Config.gameState == Config_1.Config.EXAMINING) {
                    _this.showView(WipingGameView_1.WipingGameView);
                }
                else if (Config_1.Config.gameState == Config_1.Config.BETWEEN_TREATMENTS) {
                    _this.showView(SoothingGameView_1.SoothingGameView);
                }
            }
            else {
                // Show minigame corresponding to current patient's disease
                _this.showView(_this.diseaseGameMap[Config_1.Config.currentPatient.disease]);
            }
        };
        // //-------------------------------------------------------------------------------------------------------------------------------------
        _this.onPatientCured = function (e) {
            Logger_1.Logger.log(_this, "MainView.onPatientCured(e)");
            Config_1.Config.patientsCured++;
            Logger_1.Logger.log(_this, "Config.patientsCured: " + Config_1.Config.patientsCured);
            Config_1.Config.setCurrentPatientCured();
            Config_1.Config.updateCuredPatients();
            // Save data
            var patientsCuredStringify = String(Config_1.Config.patientsCured);
            console.log("patientsCuredStringify " + patientsCuredStringify);
            console.log("Config.patientsCured " + Config_1.Config.patientsCured);
            var curedDiseasesStringify = Config_1.Config.curedDiseases.join();
            Logger_1.Logger.log(_this, "Save data");
            Logger_1.Logger.log(_this, "Config.patientsCured=== " + Config_1.Config.patientsCured);
            Logger_1.Logger.log(_this, "Config.curedDiseases=== " + Config_1.Config.curedDiseases);
            Logger_1.Logger.log(_this, "patientsCuredStringify=== " + patientsCuredStringify);
            Logger_1.Logger.log(_this, "curedDiseasesStringify=== " + curedDiseasesStringify);
            // AppController.getInstance().setLocalStorage(PreloadImages.BOOK_IMAGE_ASSETS, bookImgAssetsStringify);
            Config_1.Config.dataSaver.save(patientsCuredStringify); //TODO saveData
            Config_1.Config.dataSaver.saveDiseases(curedDiseasesStringify); //TODO saveData
            // Increase music volume
            //			//sndMan.tweenVolume(currentMusic, 1, 1);
        };
        // //-------------------------------------------------------------------------------------------------------------------------------------
        _this.onMiniGameCompleted = function (e) {
            Logger_1.Logger.log(_this, "MainView.onMiniGameCompleted(e)");
            Logger_1.Logger.log(_this, "Config.currentPatient.disease: " + Config_1.Config.currentPatient.disease);
            Logger_1.Logger.log(_this, "Config.gameState: " + Config_1.Config.gameState);
            // Poisoning and burn has two minigame treatments
            if ((Config_1.Config.currentPatient.disease == Level_1.Level.POISONING || Config_1.Config.currentPatient.disease == Level_1.Level.BURN) && Config_1.Config.gameState == Config_1.Config.EXAMINING) {
                Config_1.Config.gameState = Config_1.Config.BETWEEN_TREATMENTS;
            }
            else {
                Config_1.Config.gameState = Config_1.Config.POST_TREATMENT;
            }
            if ((Config_1.Config.currentPatient.disease == Level_1.Level.POISONING) && Config_1.Config.gameState == Config_1.Config.BETWEEN_TREATMENTS) {
                _this.showView(FollowPathGameView_1.FollowPathGameView);
            }
            else if ((Config_1.Config.currentPatient.disease == Level_1.Level.BURN) && Config_1.Config.gameState == Config_1.Config.BETWEEN_TREATMENTS) {
                _this.showView(SoothingGameView_1.SoothingGameView);
            }
            else {
                // Increase music volume
                //				//sndMan.tweenVolume(currentMusic, 1, 1);
                _this.showView(OperatingRoomView_1.OperatingRoomView);
            }
        };
        // //-------------------------------------------------------------------------------------------------------------------------------------
        _this.onBackFromMiniGame = function (e) {
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
            _this.showView(WaitingRoomView_1.WaitingRoomView);
        };
        // // -------------------------------------------------------------------------------------------------------------------------------------
        _this.onBackFromOperatingRoom = function (e) {
            Logger_1.Logger.log(_this, "MainView onBackFromOperatingRoom");
            //			var newMusic:string = "waiting_room_loop";
            //
            //			if(newMusic != currentMusic){
            //				sndMan.crossFade(currentMusic, newMusic, 0.3, 1, 999);
            //				currentMusic = newMusic;
            //			}
            _this.showView(WaitingRoomView_1.WaitingRoomView);
        };
        _this.handleResize = function (event) {
            if (event === void 0) { event = null; }
            // Logger.log(this, "MainView MainView handleResize");
            //http://stackoverflow.com/questions/6023488/how-to-proportionally-respecting-aspect-ratio-scale-a-rectangle
            _this.new_w = window.innerWidth;
            _this.new_h = window.innerHeight;
            _this.r_old = _this.old_w / _this.old_h;
            _this.r_new = _this.new_w / _this.new_h;
            var width;
            var height;
            if (_this.r_old > _this.r_new) {
                width = _this.new_w;
                console.log("BEFORE: " + width);
                height = width / _this.r_old;
                AssetLoader_1.AssetLoader.getInstance().ratioX = width;
                width = width * _this.new_h / height;
                console.log("AFTER: " + width);
                AssetLoader_1.AssetLoader.getInstance().ratioX = width - AssetLoader_1.AssetLoader.getInstance().ratioX;
                _this.hospitalCSS.innerHTML += ".center-this {position: absolute; left: -" + Math.floor(AssetLoader_1.AssetLoader.getInstance().ratioX / 2) + "px; -webkit - transform: translate(-50 %, 0);}";
                height = _this.new_h;
            }
            else {
                height = _this.new_h;
                console.log("BEFORE: " + height);
                width = height * _this.r_old;
                AssetLoader_1.AssetLoader.getInstance().ratioY = height;
                height = height * _this.new_w / width;
                console.log("AFTER: " + height);
                AssetLoader_1.AssetLoader.getInstance().ratioY = height - AssetLoader_1.AssetLoader.getInstance().ratioY;
                _this.hospitalCSS.innerHTML += ".center-this {position: absolute; top: -" + Math.floor(AssetLoader_1.AssetLoader.getInstance().ratioY / 2) + "px; -webkit - transform: translate(-50 %, 0);}";
                width = _this.new_w;
            }
            //let extra = this.new_w - width;
            //width += extra;
            _this._renderer.view.style.width = width + "px"; //TODO orig
            _this._renderer.view.style.height = height + "px";
            _this.new_w = width;
            _this.new_h = height;
        };
        // //Destroy
        // //-------------------------------------------------------------------------------------------------------------------------------------
        _this.destroyApp = function () {
            Logger_1.Logger.log(_this, "MainView destroyApp");
            Logger_1.Logger.log(_this, "MainView destroyApp  this.currentView ==== " + _this.currentView);
            // this.currentView.btnBack.off(HospitalEvent.QUIT_APP, this.destroyApp);
            TweenMax.killAll();
            // SoundMixer.stopAll(); //TODO sound
            // sndMan.stopAllSounds(); //TODO sound
            // sndMan.dispose();
            // SoundManager.killInstance();
            Logger_1.Logger.log(_this, "MainView destroyApp destroy Sound");
            AudioPlayer_1.AudioPlayer.getInstance().stopAllSounds();
            AudioPlayer_1.AudioPlayer.getInstance().destroy();
            Logger_1.Logger.log(_this, "MainView destroyApp AFTER destroy Sound");
            if (_this.bg != null) {
                _this.removeChild(_this.bg);
                _this.bg = null;
            }
            if (_this.currentView != null) {
                // this.currentView.off(HospitalEvent.PATIENT_CURED, this.onPatientCured);
                // this.currentView.off(HospitalEvent.QUIT_APP, this.destroy);
                // this.currentView.off(HospitalEvent.SHOOT_BACTERIA_GAME_COMPLETED, this.onShootBacteriaGameCompleted);
                // this.currentView.off(HospitalEvent.PATIENT_SELECTED, this.onPatientSelected);
                // this.currentView.off(HospitalEvent.DISEASE_HOTSPOT_PRESSED, this.onDiseaseHotspotPressed);
                // this.currentView.off(HospitalEvent.BACK_FROM_OPERATING_ROOM, this.onBackFromOperatingRoom);
                // this.currentView.off(HospitalEvent.MINIGAME_COMPLETED, this.onMiniGameCompleted);
                // this.currentView.off(HospitalEvent.BACK_FROM_MINIGAME, this.onBackFromMiniGame);
                // this.currentView.off(HospitalEvent.FRONTPAGE_EXITED, this.onFrontpageExited);
                _this.currentView.off(HospitalEvent_1.HospitalEvent.PATIENT_CURED, _this.onPatientCured);
                _this.currentView.off(HospitalEvent_1.HospitalEvent.SHOOT_BACTERIA_GAME_COMPLETED, _this.onShootBacteriaGameCompleted);
                _this.currentView.off(HospitalEvent_1.HospitalEvent.PATIENT_SELECTED, _this.onPatientSelected);
                _this.currentView.off(HospitalEvent_1.HospitalEvent.DISEASE_HOTSPOT_PRESSED, _this.onDiseaseHotspotPressed);
                _this.currentView.off(HospitalEvent_1.HospitalEvent.MINIGAME_COMPLETED, _this.onMiniGameCompleted);
                _this.currentView.off(HospitalEvent_1.HospitalEvent.FRONTPAGE_EXITED, _this.onFrontpageExited);
                if (_this.currentView.name != "WaitingRoomView") {
                    if (_this.currentView.name != "FrontPageView") {
                        _this.currentView.btnBack.off(HospitalEvent_1.HospitalEvent.BACK_FROM_OPERATING_ROOM, _this.onBackFromOperatingRoom);
                        if (_this.currentView.btnToWaitingRoom != null) {
                            _this.currentView.btnToWaitingRoom.off(HospitalEvent_1.HospitalEvent.BACK_FROM_OPERATING_ROOM, _this.onBackFromOperatingRoom);
                        }
                        _this.currentView.btnBack.off(HospitalEvent_1.HospitalEvent.BACK_FROM_MINIGAME, _this.onBackFromMiniGame);
                    }
                }
                _this.currentView = null;
            }
            Logger_1.Logger.log(_this, "MainView destroyApp AFTER this.currentView ==== " + _this.currentView);
            Logger_1.Logger.log(_this, "MainView AFTER this.stage.removeChildren");
            // dispatchEvent(new HospitalEvent(HospitalEvent.KILL_GAME))
            Logger_1.Logger.log(_this, "MainView destroyApp call emit");
            _this.emit(HospitalEvent_1.HospitalEvent.KILL_GAME);
            try {
                AssetLoader_1.AssetLoader.getInstance().destroy();
            }
            catch (Error) {
                Logger_1.Logger.log(_this, "ERROR MainView AssetLoader.getInstance().destroy()");
            }
            Logger_1.Logger.log(_this, "MainView destroyApp AFTER AssetLoader.getInstance().destroy");
        };
        return _this;
        // this.addListener(starling.events.Event.ADDED_TO_STAGE, this.added);
        // this.init();
    }
    MainView.prototype.init = function () {
        console.log("MainView init - AssetLoaderRumspil.STAGE_WIDTH: " + AssetLoader_1.AssetLoader.STAGE_WIDTH);
        AudioPlayer_1.AudioPlayer.getInstance().volume = 1;
        if (Initializer_1.Initializer.showLoaderCallbackFunction != null) {
            Initializer_1.Initializer.showLoaderCallbackFunction(); //TODO
        }
        // AssetLoader.getInstance().init(this.assetsLoaderComplete); //TODO need this to get stage setup in AssetLoader
        //AssetLoader.getInstance().init(this.textureCompleteHandler); //TODO need this to get stage setup in AssetLoader, also starts AssetLoader
        AssetLoader_1.AssetLoader.getInstance().init();
        //this.stage = AssetLoader.getInstance().stage;
        Config_1.Config.safeFrame = new pixi_js_1.Rectangle(Math.floor((AssetLoader_1.AssetLoader.STAGE_WIDTH - 1024) * 0.5), 0, 1024, AssetLoader_1.AssetLoader.STAGE_HEIGHT); //TODO from hospitalGame
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
            Logger_1.Logger.log(this, "MainView init  : Modernizr says : window.localStorage is available!");
        }
        else {
            // no native support for local storage :(
            // try a fallback or another third-party solution
            Logger_1.Logger.log(this, "MainView Modernizr says : NO GOOD no native support for local storage");
        }
        //AssetLoader.getInstance().loadAssets();
        // this.onStart();
        // setTimeout(() => this.onStart(), 1000);
        //this.ratio =100-( 854 / 1364);
        this.hospitalCanvas = document.getElementById('canvas_hospital');
        this.hospitalCSS = document.getElementsByTagName('style')[1];
        this.stage = new PIXI.Container();
        this._renderer = PIXI.autoDetectRenderer(AssetLoader_1.AssetLoader.STAGE_WIDTH, AssetLoader_1.AssetLoader.STAGE_HEIGHT, { view: this.hospitalCanvas, transparent: true });
        //this.hospitalCanvas = <HTMLCanvasElement>document.getElementById('canvas_hospital');
        this._renderer.view.style['transform'] = 'translatez(0)';
        this.stage = new PIXI.Container();
        this.stage.interactive = true;
        this.stage.hitArea = new pixi_js_1.Rectangle(0, 0, AssetLoader_1.AssetLoader.STAGE_WIDTH, AssetLoader_1.AssetLoader.STAGE_HEIGHT);
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
    };
    MainView.prototype.setupHospital = function () {
        Logger_1.Logger.log(this, "MainView setupHospital");
        // Level design
        // TODO: Validate data (persistent store)
        // Testing persistent store
        Logger_1.Logger.log(this, "Main.RAMASJANG_API.version: " + Main_1.Main.RAMASJANG_API.version);
        // Main.RAMASJANG_API.store.set("testKey", "testValue");
        // Logger.log(this, "Main.RAMASJANG_API.store.get(testKey): " + Main.RAMASJANG_API.store.get("testKey"))
        Config_1.Config.levels = []; //new Vector.<Level>();
        // //unlockedTools:any, unlockedDiseases:Array, unlockedClothes:Array, unlockedBandage:Array, unlockedBandAid:Array, unlockedLemonade:Array
        Config_1.Config.levels.push(new Level_1.Level([Scanner_1.Scanner.SKELETAL], [Level_1.Level.FRACTURE_RADIUS, Level_1.Level.BURN, Level_1.Level.INSECT_BITE], [], [], [], []));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_UPPER_1], [Level_1.Level.BANDAGE_1], [], []));
        Config_1.Config.levels.push(new Level_1.Level([Scanner_1.Scanner.MUSCULAR], [Level_1.Level.SPRAIN], [Level_1.Level.CLOTHES_LOWER_1], [], [Level_1.Level.BAND_AID_1], []));
        Config_1.Config.levels.push(new Level_1.Level([], [Level_1.Level.FRACTURE_HAND], [Level_1.Level.CLOTHES_UPPER_2], [Level_1.Level.BANDAGE_2], [], []));
        Config_1.Config.levels.push(new Level_1.Level([Scanner_1.Scanner.DIGESTIVE], [Level_1.Level.POISONING], [Level_1.Level.CLOTHES_LOWER_2], [], [Level_1.Level.BAND_AID_2], []));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_UPPER_3], [], [], [Level_1.Level.LEMONADE_1]));
        Config_1.Config.levels.push(new Level_1.Level([Scanner_1.Scanner.RESPIRATORY_AND_UNINARY], [Level_1.Level.PNEUMONIA], [Level_1.Level.CLOTHES_LOWER_3], [Level_1.Level.BANDAGE_3], [], []));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_UPPER_4], [], [Level_1.Level.BAND_AID_3], []));
        Config_1.Config.levels.push(new Level_1.Level([Scanner_1.Scanner.CARDIOVASCULAR], [], [Level_1.Level.CLOTHES_LOWER_4], [Level_1.Level.BANDAGE_4], [], []));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_UPPER_5], [], [], [Level_1.Level.LEMONADE_2]));
        Config_1.Config.levels.push(new Level_1.Level([Scanner_1.Scanner.NERVOUS], [], [Level_1.Level.CLOTHES_LOWER_5], [], [Level_1.Level.BAND_AID_4], []));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_UPPER_6], [Level_1.Level.BANDAGE_5], [], []));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_LOWER_6], [], [Level_1.Level.BAND_AID_5], []));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_UPPER_7], [Level_1.Level.BANDAGE_6], [], []));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_LOWER_7], [], [], [Level_1.Level.LEMONADE_3]));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_UPPER_8], [], [Level_1.Level.BAND_AID_6], []));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_LOWER_8], [Level_1.Level.BANDAGE_7], [], []));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_UPPER_9], [], [Level_1.Level.BAND_AID_7], []));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_LOWER_9], [Level_1.Level.BANDAGE_8], [], []));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_UPPER_10], [], [], [Level_1.Level.LEMONADE_4]));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_LOWER_10], [Level_1.Level.BANDAGE_9], [], []));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_UPPER_11], [], [Level_1.Level.BAND_AID_8], []));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_LOWER_11], [Level_1.Level.BANDAGE_10], [], []));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_UPPER_12], [], [], [Level_1.Level.LEMONADE_5]));
        Config_1.Config.levels.push(new Level_1.Level([], [], [Level_1.Level.CLOTHES_LOWER_12], [], [Level_1.Level.BAND_AID_9], []));
        Config_1.Config.levels.push(new Level_1.Level([], [], [], [], [], []));
        // List of cured diseases (used in trophy display)
        // Change: Read from saved data
        // Config.curedDiseases = [];
        // Mapping of diseases to games
        this.diseaseGameMap = {}; //new Dictionary();
        this.diseaseGameMap[Level_1.Level.INSECT_BITE] = PinchingGameView_1.PinchingGameView;
        this.diseaseGameMap[Level_1.Level.FRACTURE_HAND] = PuzzleGameView_1.PuzzleGameView;
        this.diseaseGameMap[Level_1.Level.FRACTURE_RADIUS] = PuzzleGameView_1.PuzzleGameView;
        this.diseaseGameMap[Level_1.Level.SPRAIN] = SoothingGameView_1.SoothingGameView;
        this.diseaseGameMap[Level_1.Level.POISONING] = FollowPathGameView_1.FollowPathGameView;
        this.diseaseGameMap[Level_1.Level.PNEUMONIA] = ShootBacteriaGameView_1.ShootBacteriaGameView;
        this.diseaseGameMap[Level_1.Level.BURN] = WipingGameView_1.WipingGameView;
        // set initial gamestate
        Config_1.Config.gameState = Config_1.Config.INTRO;
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
        this.soundMusic = AudioPlayer_1.AudioPlayer.getInstance().playSound("intro", 999, 0.2);
        this.showView(FrontPageView_1.FrontPageView);
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
    };
    MainView.prototype.destroyPreviousView = function () {
        Logger_1.Logger.log(this, "MainView destroyPreviousView");
        if (this.currentView != null) {
            if (this.currentView.name != null) {
                Logger_1.Logger.log(this, "MainView destroyPreviousView  this.currentView.name == " + this.currentView.name);
            }
            console.log("REMOVING: " + this.currentView.name);
            this.currentView.destroy();
            this.currentView = null;
        }
        Logger_1.Logger.log(this, "MainView destroyPreviousView AFTER this.currentView == " + this.currentView);
    };
    // //-------------------------------------------------------------------------------------------------------------------------------------
    // private showView(view:Class):void{
    MainView.prototype.showView = function (view) {
        Logger_1.Logger.log(this, "MainView showView");
        Logger_1.Logger.log(this, "MainView showView view == " + view.name);
        if (this.currentView != null && this.currentView.name != null) {
            Logger_1.Logger.log(this, "MainView showView this.currentView == " + this.currentView.name);
        }
        this.destroyPreviousView();
        // System.pauseForGCIfCollectionImminent(0); //TODO
        // System.gc();
        this.currentView = new view();
        this.currentView.init();
        this.stage.addChild(this.currentView);
        this.currentView.show();
        // Event listeners
        this.currentView.on(HospitalEvent_1.HospitalEvent.PATIENT_CURED, this.onPatientCured);
        this.currentView.on(HospitalEvent_1.HospitalEvent.SHOOT_BACTERIA_GAME_COMPLETED, this.onShootBacteriaGameCompleted);
        this.currentView.on(HospitalEvent_1.HospitalEvent.PATIENT_SELECTED, this.onPatientSelected);
        this.currentView.on(HospitalEvent_1.HospitalEvent.DISEASE_HOTSPOT_PRESSED, this.onDiseaseHotspotPressed);
        this.currentView.on(HospitalEvent_1.HospitalEvent.MINIGAME_COMPLETED, this.onMiniGameCompleted);
        this.currentView.on(HospitalEvent_1.HospitalEvent.FRONTPAGE_EXITED, this.onFrontpageExited);
        if (this.currentView.name != "WaitingRoomView") {
            if (this.currentView.name != "FrontPageView") {
                this.currentView.btnBack.on(HospitalEvent_1.HospitalEvent.BACK_FROM_OPERATING_ROOM, this.onBackFromOperatingRoom);
                if (this.currentView.btnToWaitingRoom != null) {
                    this.currentView.btnToWaitingRoom.on(HospitalEvent_1.HospitalEvent.BACK_FROM_OPERATING_ROOM, this.onBackFromOperatingRoom);
                }
                this.currentView.btnBack.on(HospitalEvent_1.HospitalEvent.BACK_FROM_MINIGAME, this.onBackFromMiniGame);
            }
        }
    };
    return MainView;
}(pixi_js_1.Sprite));
exports.MainView = MainView;
//# sourceMappingURL=MainView.js.map
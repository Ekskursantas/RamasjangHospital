import {Logger} from "../loudmotion/utils/debug/Logger";
import {Initializer} from "./Initializer";
import {MainView} from "./view/MainView";
import {HospitalEvent} from "./event/HospitalEvent";
import {Sprite, Rectangle} from "pixi.js";
import {ProgressBar} from "./utils/ProgressBar";
import {DataSaver} from "./utils/DataSaver";
import {Config} from "./Config";

var _callback;
export class GameHospital extends Sprite {

		
		private progressBar:ProgressBar;
		private initializer:Initializer;
		private assetPrefix:string;
		// private assets:AssetManager;
		private viewPort:Rectangle;
		private mainView:MainView;

        constructor(debug: boolean = false, callback, assetPrefix:string = "media/hospital/assets/"){
			super();

            Logger.log(this, " Hospital(assetPrefix == " + this.assetPrefix);
            _callback = callback;
			this.assetPrefix = assetPrefix;
			// this.addEventListener( Event.ADDED_TO_STAGE, onAddedToStage );
			this.init();
		}

	//ENQUEUE ASSETS AND LOAD THEM
	//-------------------------------------------------------------------------------------------------------------------------------------
	protected init( event:Event=null ):void {
		Logger.log(this, " Hospital init");

		// this.setupAssetManager();
		// this.starLoading();

        this.validateData();
        _callback();
        this.startApp();
        
		if(Initializer.showLoaderCallbackFunction != null) {
			Initializer.showLoaderCallbackFunction();
		}
	}


		//-------------------------------------------------------------------------------------------------------------------------------------
		/**
		 * 	Validate if users has saved data before otherwise save default data
		 */
		
		private validateData():void {
			// Config.dataSaver = new DataSaver (Config.STORAGE_FILE_NAME_PATIENTS_CURED, Config.STORAGE_FILE_NAME_DISEASES_CURED); //TODO add back?
			Config.dataSaver = new DataSaver();
		}
		

		//-------------------------------------------------------------------------------------------------------------------------------------
		/**
		 * Start app and hide loader listen for when the game is killed
		 */

	private startApp():void {
		Logger.log(this, "GameHospital.startApp()");


		// System.pauseForGCIfCollectionImminent(0);
		// System.gc();

		// Game is inited and ready to be shown
		if (Initializer.initDoneCallbackFunction != null) {
			Initializer.initDoneCallbackFunction();
		}

		this.mainView = new MainView();
		this.mainView.on(HospitalEvent.KILL_GAME, this.onkillGame);
		this.addChild((this.mainView));
		this.mainView.init();

		// Hide load. Game is ready
		if(Initializer.hideLoaderCallbackFunction != null) {
			Initializer.hideLoaderCallbackFunction();
		}

		// progressBar.removeFromParent(true); //TODO
		// progressBar.dispose();
	}
		
		
		
		// KILL THE GAME - PURGE ASSETMANAGER
		//-------------------------------------------------------------------------------------------------------------------------------------
		// private onkillGame = (e:Event):void => {
		private onkillGame = ():void => {
			Logger.log(this, "GameHospital.onkillGame");

			this.mainView.off(HospitalEvent.KILL_GAME , this.onkillGame ); //TODO add back?

			if(this.mainView != null) {
				this.removeChild(this.mainView);
			}

			// assets.purge(); //TODO can we do this with PIXI?
			this.endGame();
		}		
		
		private endGame():void {
			Logger.log(this, "GameHospital endGame if Initializer.exitCallbackFunction) "+Initializer.exitCallbackFunction);
			if (Initializer.exitCallbackFunction != null) {
				Initializer.exitCallbackFunction();
			}
		}
		
		
		
		// Set up a Initializer
		//-------------------------------------------------------------------------------------------------------------------------------------
		
		public getInitializer():Initializer{
			if (!this.initializer) {
				this.initializer = new Initializer ()
			}
			Logger.log(this, "GameHospital getInitializer : return this.initializer == "+this.initializer);
			return this.initializer;
		}

}
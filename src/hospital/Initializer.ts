


// import {MainView} from "src/hospital/view/MainView";

import {Logger} from "src/loudmotion/utils/debug/Logger";
import {GameHospital} from "./GameHospital";
var _callback;
export class Initializer {
	// must be called when initialization of the game is done and the game is ready to be shown
		static initDoneCallbackFunction:Function;

		// must be called when game has disposed all objects and are ready to be removed from displaylist
		static exitCallbackFunction:Function;

		// must be called when standard Ramasjang loader should be shown
		static showLoaderCallbackFunction:Function;

		// must be called when standard Ramasjang loader should be hidden
		static hideLoaderCallbackFunction:Function;

		// call with a string parameter to log in frontpage debug textfield (DEPRECATED)
		static debugCallbackFunction:Function;

		// this function is called from The Core when the backbutton is pressed on an Android device
		static backButtonCallback:Function;

	//private _starling:Starling;
	private _subGameToStart:string;

	//constructor() {
	//	super();
	//}
    
	public setCallbacks(initDoneCallback:Function, exitCallback:Function, showLoaderCallBack:Function, hideLoaderCallBack:Function, debugCallBack:Function):void {
		Logger.log(this, "setCallbacks");
		Initializer.initDoneCallbackFunction= initDoneCallback;
		Initializer.exitCallbackFunction= exitCallback;
		Initializer.showLoaderCallbackFunction= showLoaderCallBack;
		Initializer.hideLoaderCallbackFunction= hideLoaderCallBack;
		Initializer.debugCallbackFunction= debugCallBack;
	}

	public startGame(subGameToStart:string, callback):void {
		Logger.log(this, "startGame  subGameToStart == "+subGameToStart);
		//_starling = starlingInstance;
        this._subGameToStart = subGameToStart;
        _callback = callback;
		this.onInitDone();
	}

	public backButtonCallbackProxy():void {
		if (Initializer.backButtonCallback != null){
			Initializer.backButtonCallback();
		}
	}

	/**
	 * Returns true if this game uses a wide stage (all new games should do this!), false if it uses the standard 4:3 stage
	 * The wide stage is 1364 x 768, which scales to 1136 x 640 on IPhone 5, which is the widest device we support.
	 *
	 *
	 * @return
	 *
	 */
	public getUseWideStage():boolean {
		return true;
	}

	private onInitDone():void {
		Logger.log(this, "onInitDone");
		// let game:MainView = new MainView();
		// let game:Rosa = new Rosa(true);
		// Logger.log(this, "game == "+game);
		// Initializer.initDoneCallbackFunction(game, this.backButtonCallbackProxy); //TODO

        let game: GameHospital = new GameHospital(false, _callback);
		if (Initializer.initDoneCallbackFunction != null) {
			Initializer.initDoneCallbackFunction(game, this.backButtonCallbackProxy);
		}
	}
}

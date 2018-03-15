// package appdrhospital.view
import {Logger} from "../../loudmotion/utils/debug/Logger";
import {Sprite} from "pixi.js";
import {BackBtn} from "./buttons/BackBtn";
import AbstractSoundInstance = createjs.AbstractSoundInstance;
import {Config} from "../Config";

export class HospitalGameView extends Sprite {


	public static RECT_COVER_ALPHA:number = 0.01;
	// import starling.display.Sprite;

	public _name:string;
	public btnBack:BackBtn;
	public btnToWaitingRoom:BackBtn;
	public mouseDown:boolean;

	protected sndSpeak:Howl;
	protected sndSpeakDone:Howl;

	constructor() {
		super();
		// this.interactive = true;
	}

	public set name(_name:string){
		this._name = _name;
	}

	public get name():string{
		return this._name;
	}

	public show():void {
		this.visible = true;
	}

	public hide():void {
		this.visible = false;

	}

	public destroy():void {
		Logger.log(this, "HospitalGameView destroy  this.children.length == "+this.children.length);
        clearTimeout(Config.currentTimeout);
		 this.removeChildren();
	}

	public init():void {}
}
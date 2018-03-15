import {Eye} from "./Eye";
import {AssetLoader} from "../../utils/AssetLoader";
import {Sprite, Point, Container} from "pixi.js";
import {Logger} from "../../../loudmotion/utils/debug/Logger";

// export class PairOfEyes extends ClippedSprite { //TODO ClippedSprite in PIXI?
export class PairOfEyes extends Sprite {
	private eyeColorType:number;
	private eyeRight:Eye;
	private eyeLeft:Eye;
	private movementInterval:number;
	private idleMovementTimeout:number;
	private stage:Container;

//		private maskRect:Rectangle;

	constructor (eyeColorType:number) {
		super();
		this.eyeColorType = eyeColorType;
		// addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
		this.onAddedToStage();
	}

	private onAddedToStage():void {
			Logger.log(this, "PairOfEyes.onAddedToStage(event)");

		//this.stage = AssetLoader.getInstance().stage;
		Logger.log(this, "PairOfEyes.onAddedToStage(event)   this.stage == "+this.stage);

		this.createEyes();
		this.createReflections();
	}


	private createEyes():void {
		this.eyeRight = new Eye(this.eyeColorType);
		this.addChild(this.eyeRight);

		this.eyeLeft = new Eye(this.eyeColorType);
		this.addChild(this.eyeLeft);
		this.eyeLeft.x = 106;

		Logger.log(this, "PairOfEyes createEyes   this.eyeColorType == "+this.eyeColorType);
	}

	private createReflections():void {
		// Reflections
		let reflection:Sprite = Sprite.fromFrame("kid_eyes_highlights");
		this.addChild(reflection);
		reflection.x = 14;
		reflection.y = -18;
	}

	public initIdleMovement():void {
		// clearTimeout(this.idleMovementTimeout); //TODO
		// this.idleMovementTimeout = setTimeout(this.lookInRandomDirection, this.movementInterval);
	}

	private lookInRandomDirection = ():void => {
		// Logger.log(this, "PairOfEyes lookInRandomDirection  this.stage == "+this.stage);
		
			let randomX:number = Math.round(Math.random() * AssetLoader.STAGE_WIDTH);
			let randomY:number = Math.round(Math.random() * AssetLoader.STAGE_HEIGHT);

			let randomPoint:Point = new Point(randomX, randomY);
			// Logger.log(this, "PairOfEyes lookInRandomDirection   randomPoint == "+randomPoint);
			this.eyeRight.lookAtPoint(randomPoint);
			this.eyeLeft.lookAtPoint(randomPoint);

			this.movementInterval = Math.round((Math.random() * 2000) + 2000);
			this.idleMovementTimeout = setTimeout(this.lookInRandomDirection, this.movementInterval);
			// this.initIdleMovement();
		
	}
}
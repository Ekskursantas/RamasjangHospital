import {HospitalGameView} from "../../HospitalGameView";
import {AssemblyPart} from "./objects/AssemblyPart";
import {Logger} from "../../../../loudmotion/utils/debug/Logger";
import {AssetLoader} from "../../../utils/AssetLoader";
import {Point, Container} from "pixi.js";

export class AssemblingGameView extends HospitalGameView {
	public static PART_TOUCH_OFFSET:Number = -60;

	private assemblyPart_1:AssemblyPart;
	private assemblyPart_2:AssemblyPart;
	private touchedPart:AssemblyPart;

	private stage:Container;

	private touches:Touch[];

	constructor () {
		super();
	}

	public init():void {
		this.name = "AssemblingGameView";

		this.drawScene();
		this.startGame();
	}

	private drawScene():void {
		this.assemblyPart_1 = new AssemblyPart("brokenBonesGame_boneRadius_complete", new Point(AssetLoader.STAGE_WIDTH/2 - 200, AssetLoader.STAGE_WIDTH/2), "assemblyPart_1");
		this.addChild(this.assemblyPart_1);

		this.assemblyPart_2 = new AssemblyPart("brokenBonesGame_boneRadius_complete", new Point(this.assemblyPart_1.x + 400, this.assemblyPart_1.y - 100), "assemblyPart_2");
		this.addChild(this.assemblyPart_2);
	}

	private startGame():void {
		Logger.log(this, "AssemblingGameView");
		this.assemblyPart_1.signalPart.add(this.pieceTouched);
		this.assemblyPart_1.signalPartTouchDone.add(this.touchDone);

		this.assemblyPart_2.signalPart.add(this.pieceTouched);
		this.assemblyPart_2.signalPartTouchDone.add(this.touchDone);
	}

	private pieceTouched = (data:any):void => {
		this.touchedPart = data as AssemblyPart;
		Logger.log(this, "AssemblingGameView pieceTouched "+this.touchedPart);
		// this.parent.setChildIndex(this, this.parent.children.length-1);
	}

	private touchDone = ():void => {
		this.mouseDown = false;
		Logger.log(this, "AssemblingGameView touchDone");
		if(this.assemblyPart_2.x - this.assemblyPart_1.x > this.assemblyPart_1.width && this.assemblyPart_1.y < this.assemblyPart_2.y + 10 && this.assemblyPart_1.y > this.assemblyPart_2.y - 10 && this.bothPartsStraight()){
			this.snapPartsAndEndGame();
		}else{
			TweenLite.killTweensOf(this.touchedPart);
			TweenLite.to(this.touchedPart, .3, {x: this.touchedPart.initialPosition.x});
			this.touchedPart.stopMovingRandomly();
		}
	}

	private bothPartsStraight():boolean {
		return this.assemblyPart_1.rotation < 0.05 && this.assemblyPart_2.rotation < 0.05;
	}

	private snapPartsAndEndGame():void {
		this.assemblyPart_1.signalPart.remove(this.pieceTouched);
		this.assemblyPart_1.signalPartTouchDone.remove(this.touchDone);

		this.assemblyPart_2.signalPart.remove(this.pieceTouched);
		this.assemblyPart_2.signalPartTouchDone.remove(this.touchDone);

		TweenLite.killTweensOf(this.assemblyPart_1);
		TweenLite.killTweensOf(this.assemblyPart_2);

		this.assemblyPart_1.stopMovingRandomly();
		this.assemblyPart_2.stopMovingRandomly();

		TweenLite.to(this.assemblyPart_2, .3, {x: this.assemblyPart_1.x + this.assemblyPart_1.width, y: this.assemblyPart_1.y});
	}

	public destroy():void{

		if(this.assemblyPart_1 != null) {
			this.assemblyPart_1.signalPart.remove(this.pieceTouched);
			this.assemblyPart_1.signalPartTouchDone.remove(this.touchDone);
			this.removeChild(this.assemblyPart_1);
			this.assemblyPart_1 = null;
		}

		if(this.assemblyPart_2 != null) {
			this.assemblyPart_2.signalPart.remove(this.pieceTouched);
			this.assemblyPart_2.signalPartTouchDone.remove(this.touchDone);
			this.removeChild(this.assemblyPart_2);
			this.assemblyPart_2 = null;
		}

		super.destroy();
	}
}
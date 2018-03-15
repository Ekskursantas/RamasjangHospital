import {Button} from "../../../loudmotion/ui/Button";
import {Point, Sprite} from "pixi.js";

export class InflatableButton extends Button {

	private _padding:number;

	private text:string;
	
	constructor () {
		super();
	}

	public get padding():number {
		return this._padding;
	}
	
	public set padding(value:number) {
		this._padding = value;
	}
	
	public hitTest(localPoint:Point, forTouch:boolean = false):Sprite {
		// on a touch test, invisible or untouchable objects cause the test to fail
		if (forTouch && (!this.visible || !this.touchable)) {
			return null;
		}

		// var theBounds:Rectangle = getBounds(this); //TODO orig
		// theBounds.inflate(_padding, this._padding); //TODO orig

		// let theBounds:Rectangle = this.getBounds(false, this); //TODO check original above
		// theBounds.inflate(this._padding, this._padding);
		// if (theBounds.containsPoint(localPoint)) return this;
		return null;
	}
}
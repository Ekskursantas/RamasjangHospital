import {Sprite, Point} from "pixi.js";
export class DraggableItem extends Sprite {
	protected _initialPosition:Point;

	constructor () {
		super();
		this.interactive = true;
	}

	public get initialPosition():Point {
		return this._initialPosition;
	}

	public set initialPosition(value:Point) {
		this._initialPosition = value;
	}
}
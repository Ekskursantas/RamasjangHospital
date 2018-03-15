import {Sprite} from "pixi.js";

export class ConfettiBit extends Sprite {
	private _speed:number;
	private touchable:boolean;

	constructor () {
		super();
		this.touchable = false;
	}

	public get speed():number {
		return this._speed;
	}

	public set speed(value:number) {
		this._speed = value;
	}
}
import {Logger} from "../../loudmotion/utils/debug/Logger";
import {Button} from "../../loudmotion/ui/Button";

export class ButtonEvent extends Event {
	// public static CLICKED:string = "click";
	public static CLICKED:string = "pointerdown";
	public static TOUCH:string = "touch";
	public button:Button;

	constructor (type:string, button:Button, bubbles:boolean=false, data:Object=null) {
		super(type);
		this.button = button;
		Logger.log(this, "ButtonEvent   this.button === "+this.button);
	}
}
import {Button} from "../../../loudmotion/ui/Button";
import {ButtonEvent} from "../../event/ButtonEvent";
import {Logger} from "../../../loudmotion/utils/debug/Logger";
import {Sprite, Graphics, Texture} from "pixi.js";

export class TestMenu extends Sprite {
	private spacing: number;
	private bg:Graphics;
	
	constructor () {
		super();
		this.DrawMenu();
	}

	private DrawMenu():void {
		// bg = new Quad(600, 200, 0xcccccc);
		this.bg = new Graphics();
		this.bg.beginFill(0xcccccc);
		// set the line style to have a width of 5 and set the color to red
		// this.background.lineStyle(5, 0xFF0000);
		// draw a rectangle
		this.bg.drawRect(0, 0, 600, 200);
		this.addChild(this.bg);

		let btn_1:Button = new Button();
		btn_1.addTexture(Texture.fromFrame("testButtons_forstuvning"));
		this.addChild(btn_1);
		btn_1.x = this.spacing;
		btn_1.y = this.spacing;
		btn_1.on(ButtonEvent.CLICKED, this.btn_1PressedListener);

		this.spacing = (this.bg.width - btn_1.width * 5) / 6;

		let btn_2:Button = new Button();
		btn_2.addTexture(Texture.fromFrame("testButtons_insektstik"));
		this.addChild(btn_2);
		btn_2.x = this.spacing * 2 + btn_1.width;
		btn_2.y = this.spacing;
		btn_2.on(ButtonEvent.CLICKED, this.btn_4PressedListener);

		let btn_3:Button = new Button();
		btn_3.addTexture(Texture.fromFrame("testButtons_knoglepuslespil"));
		this.addChild(btn_3);
		btn_3.x = this.spacing * 3 + btn_1.width * 2;
		btn_3.y = this.spacing;
		btn_3.on(ButtonEvent.CLICKED, this.btn_4PressedListener);

		let btn_4:Button = new Button();
		btn_4.addTexture(Texture.fromFrame("testButtons_lungebetaendelse"));
		this.addChild(btn_4);
		btn_4.x = this.spacing * 4 + btn_1.width * 3;
		btn_4.y = this.spacing;
		btn_1.on(ButtonEvent.CLICKED, this.btn_4PressedListener);

		let btn_5:Button = new Button();
		btn_5.addTexture(Texture.fromFrame("testButtons_tarmChase"));
		this.addChild(btn_5);
		btn_5.x = this.spacing * 5 + btn_1.width * 4;
		btn_5.y = this.spacing;
		btn_5.on(ButtonEvent.CLICKED, this.btn_5PressedListener);
	}
	
	private btn_1PressedListener = (event:Event):void => {
		Logger.log(this, "TestMenu.btn_1PressedListener(event)");
		this.emit("btn_1Pressed");
	}
	
	private btn_2PressedListener = (event:Event):void => {
		Logger.log(this, "TestMenu.btn_2PressedListener(event)");
		this.emit("btn_2Pressed");
	}
	
	private btn_3PressedListener = (event:Event):void => {
		Logger.log(this, "TestMenu.btn_3PressedListener(event)");
		this.emit("btn_3Pressed");
	}
	
	private btn_4PressedListener = (event:Event):void => {
		Logger.log(this, "TestMenu.btn_4PressedListener(event)");
		this.emit("btn_4Pressed");
	}
	
	private btn_5PressedListener = (event:Event):void => {
		Logger.log(this, "TestMenu.btn_5PressedListener(event)");
		this.emit("btn_5Pressed");
	}
}
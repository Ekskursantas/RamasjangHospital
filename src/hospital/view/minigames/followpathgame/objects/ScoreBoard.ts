
import {AssetLoader} from "../../../../utils/AssetLoader";
import {Sprite, Graphics} from "pixi.js";
import {Logger} from "../../../../../loudmotion/utils/debug/Logger";

export class ScoreBoard extends Sprite {
	private numOfSlots:number;
	private slots:any;
	private background:Graphics;
	private imageEmpty:Sprite;

	constructor (numOfSlots:number) {
		super();
		this.numOfSlots = numOfSlots;
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.createScoreBoardArt();
	}

	private createScoreBoardArt():void {
		this.background = new Graphics();
		this.background.beginFill(0x06a484);

		// set the line style to have a width of 5 and set the color to red
		// this.background.lineStyle(5, 0xFF0000);
		// draw a rectangle
		this.background.drawRect(0, 0, AssetLoader.STAGE_WIDTH, 76);
		this.addChild(this.background);
		// this.background = color == 0x06a484;
		this.background.alpha = 0.2;


		this.slots = [];
		for (let i:number = 0; i < this.numOfSlots; i++) {
			this.imageEmpty = Sprite.fromFrame("forgiftning_gift_01");

			let slot:Sprite = new Sprite();
			slot.addChild(this.imageEmpty);
			// this.addChild(slot);
			this.addChild(slot);

//				slot.x = i * slot.width + 20;
//				slot.x = i * slot.width + 20 + (StarlingHelper.rightXOffsetVirtual - (numOfSlots * (slot.width + 20)));
// 			slot.x = StarlingHelper.rightXOffsetVirtual - ((slot.width ) * numOfSlots + 30) +  i * slot.width + 20;
// 			slot.x = ((imageEmpty.width) * this.numOfSlots + 10) + i * imageEmpty.width + 20;
			slot.x = i * this.imageEmpty.width + 20;
			slot.alpha = 0.2;

			this.slots.push(slot);
		}
	}

	public getWidth():number{
		return (this.imageEmpty.width * this.numOfSlots + (this.numOfSlots * 20));
	}

	public update(collectablesCollected:number):void {
		// let slot:Sprite = this.slots[collectablesCollected - 1] as Sprite;
		let editNum:number = collectablesCollected - 1;
		Logger.log(this, "ScoreBoard collectablesCollected == "+collectablesCollected+" : editNum == "+editNum);
		let slot:Sprite = this.slots[editNum] as Sprite;
		slot.alpha = 1;
//			slot.addChild(new Image(Config.assetManager.getTexture("gui_IconBunnyFull"))); //TODO?
	}

	public destroy():void{
		// TODO need to flesh out
	}
}
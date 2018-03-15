import {AssetLoader} from "../../utils/AssetLoader";
import {TouchEvent} from "../../../loudmotion/events/TouchLoudEvent";
import {Touch} from "../../../loudmotion/events/TouchLoud";
import {Sprite, Point, interaction} from "pixi.js";
import {Logger} from "../../../loudmotion/utils/debug/Logger";
import {Helper} from "../../../loudmotion/utils/Helper";
import InteractionEvent = interaction.InteractionEvent;

export class Eye extends Sprite {
	private apple:Sprite;
	private iris:Sprite;
	private irisTarget:Sprite;
	private reflection:Sprite;
	private eyeColorType:number;
	
	private touch:Touch;
	
	private movementInterval:number;
	private mouseDown:boolean;

	constructor (eyeColorType:number) {
		super();
		this.eyeColorType = eyeColorType;
		this.onAddedToStage();
	}
	
	private onAddedToStage():void {
		this.createEyeArt();
		this.initStageTouchListener();
	}

	private createEyeArt():void {
		this.apple = new Sprite();
		let appleImage:Sprite = Sprite.fromFrame("kid_eyes");
		this.apple.addChild(appleImage);
		appleImage.x = -(appleImage.width * .5);
		appleImage.y = -(appleImage.height * .5);
		this.addChild(this.apple);

		this.irisTarget = new Sprite();
		this.addChild(this.irisTarget);

		this.iris = new Sprite();

		let irisImage:Sprite = Sprite.fromFrame("kid_iris_0" + this.eyeColorType);
		this.iris.addChild(irisImage);
		irisImage.x = -(irisImage.width * .5);
		irisImage.y = -(irisImage.height * .5);
		this.irisTarget.addChild(this.iris);
	}
	
	private initStageTouchListener():void {
		Logger.log(this, "Eye initStageTouchListener");
		AssetLoader.getInstance().assetCanvas.on(TouchEvent.TOUCH, this.stageTouchListener);
		AssetLoader.getInstance().assetCanvas.on(TouchEvent.TOUCH_END, this.stageTouchListener);
		AssetLoader.getInstance().assetCanvas.on(TouchEvent.TOUCH_MOVE, this.stageTouchListener);
	}

	private stageTouchListener = (event:TouchEvent):void => {
		let mousePosition:Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
		this.lookAtPoint(mousePosition);
	}
	
	public lookAtPoint(pointToLookAt:Point):void {
		let pointThisGlobal:Point = this.getGlobalPosition(new Point(0, 0));
		let distance:number = Helper.lineDistance(pointThisGlobal,  pointToLookAt);
		let deltaX:number = pointToLookAt.x - pointThisGlobal.x;
		let deltaY:number = pointToLookAt.y - pointThisGlobal.y;
		let angle:number = Math.atan2( deltaY, deltaX ) * 180 / Math.PI;
		let angleRadians:number = Math.atan2(deltaY, deltaX); // In radians
		this.lookInDirection(distance, angleRadians);
	}

	
	private lookInDirection(distance:number, angleRadians:number):void {
		let irisDistance:number = distance / 40;
		if(irisDistance > 15) {
			irisDistance = 15;
		}

		let irisDestX:number = Math.cos(angleRadians) * irisDistance;
		let irisDestY:number = Math.sin(angleRadians) * irisDistance;

		TweenLite.to(this.iris, 0.5, {x:irisDestX, y:irisDestY});
	}
}
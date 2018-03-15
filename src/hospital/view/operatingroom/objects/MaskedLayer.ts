import {AssetLoader} from "../../../utils/AssetLoader";
import {Logger} from "../../../../loudmotion/utils/debug/Logger";
import {Scanner} from "./Scanner";
import {Sprite, Graphics, Container} from "pixi.js";

// export class MaskedLayer extends ClippedSprite { //TODO do we have this in PIXI?
export class MaskedLayer extends Sprite {
	public maskedLayerBG:Graphics;

	public patientLayerSkeletal:Sprite;
	public patientLayerCardioVascular:Sprite;
	public patientLayerMuscular:Sprite;
	public patientLayerDigestive:Sprite;
	public patientLayerRespiratoryAndUrinary:Sprite;
	public patientLayerNervous:Sprite;

	constructor() {
		super();
		this.createLayers();
	}

	private createLayers():void {
		Logger.log(this, "MaskedLayer createLayers");
		this.maskedLayerBG = new Graphics();
		this.maskedLayerBG.beginFill(0x222222);
		// set the line style to have a width of 5 and set the color to red
		// this.background.lineStyle(5, 0xFF0000);
		// draw a rectangle
		this.maskedLayerBG.drawRect(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);

		let maskedLayerSilhouette:Sprite = Sprite.fromFrame("insideLayers_silhouette");
		this.addChild(this.maskedLayerBG);
		this.addChild(maskedLayerSilhouette);
		maskedLayerSilhouette.scale.x = maskedLayerSilhouette.scale.y = 2;

		// offset layers so they correspond with skin layer
		maskedLayerSilhouette.x = 107;

		Logger.log(this, "MaskedLayer createLayers  maskedLayerSilhouette == "+maskedLayerSilhouette+" : maskedLayerSilhouette.x == "+maskedLayerSilhouette.x);

		this.patientLayerSkeletal = this.createAndAddLayer("insideLayers_skeletalSystem");
		this.patientLayerCardioVascular = this.createAndAddLayer("insideLayers_cardiovascularSystem");
		this.patientLayerMuscular = this.createAndAddLayer("insideLayers_muscularSystem");
		this.patientLayerDigestive = this.createAndAddLayer("insideLayers_digestiveSystem");
		this.patientLayerRespiratoryAndUrinary = this.createAndAddLayer("insideLayers_respiratoryAndUrinarySystem");
		this.patientLayerNervous = this.createAndAddLayer("insideLayers_nervousSystem");
	}

	private createAndAddLayer(texture:string):Sprite {
		Logger.log(this, "MaskedLayer createAndAddLayer");
		let patientLayer:Sprite = Sprite.fromFrame(texture);
		this.addChild(patientLayer);

		// offset layers so they correspond with skin layer
		patientLayer.x = 107;

		return patientLayer;
	}

	public update(state:string):void {
		this.patientLayerSkeletal.visible = false;
		this.patientLayerCardioVascular.visible = false;
		this.patientLayerMuscular.visible = false;
		this.patientLayerDigestive.visible = false;
		this.patientLayerRespiratoryAndUrinary.visible = false;
		this.patientLayerNervous.visible = false;

		Logger.log(this, "MaskedLayer update state == "+state);

		switch(state) {
			case Scanner.SKELETAL:
				this.patientLayerSkeletal.visible = true;
				break;

			case Scanner.CARDIOVASCULAR:
				this.patientLayerCardioVascular.visible = true;
				break;

			case Scanner.MUSCULAR:
				this.patientLayerMuscular.visible = true;
				break;

			case Scanner.DIGESTIVE:
				this.patientLayerDigestive.visible = true;
				break;

			case Scanner.RESPIRATORY_AND_UNINARY:
				this.patientLayerRespiratoryAndUrinary.visible = true;
				break;

			case Scanner.NERVOUS:
				this.patientLayerNervous.visible = true;
				break;

			default:
				break;
		}
	}

	public destroy():void{

		this.removeChildren();
		//TODO is the above enough or should we use below to remove children
		// this.patientLayerSkeletal = this.createAndAddLayer("insideLayers_skeletalSystem");
		// this.patientLayerCardioVascular = this.createAndAddLayer("insideLayers_cardiovascularSystem");
		// this.patientLayerMuscular = this.createAndAddLayer("insideLayers_muscularSystem");
		// this.patientLayerDigestive = this.createAndAddLayer("insideLayers_digestiveSystem");
		// this.patientLayerRespiratoryAndUrinary = this.createAndAddLayer("insideLayers_respiratoryAndUrinarySystem");
		// this.patientLayerNervous = this.createAndAddLayer("insideLayers_nervousSystem");
	}
}
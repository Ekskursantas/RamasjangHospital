
import {Button} from "../../../../loudmotion/ui/Button";
import {Logger} from "../../../../loudmotion/utils/debug/Logger";
import {Config} from "../../../Config";
import {Level} from "../../../vo/Level";
import {ButtonEvent} from "../../../event/ButtonEvent";
import {Sprite, Texture} from "pixi.js";
import {AudioPlayer} from "../../../../loudmotion/utils/AudioPlayer";

export class TrophyDisplay extends Sprite {
	public static OPENED:string = "appdrhospital.view.waitingroom.objects.TrophyDisplay.OPENED";

	public btnOpenClose:Button;
	private trophyContainer:Sprite;
	
	private trophySkinDiseases:Sprite;
	private trophyBonesDiseases:Sprite;
	private trophyLungsDiseases:Sprite;
	private trophyIntestinesDiseases:Sprite;
	private trophyMusclesDiseases:Sprite;

	private onState:boolean;
	private SPACING_HORIZONTAL:number = 60;
	private SPACING_VERTICAL:number = 60;

	constructor() {
		super();
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.interactive = true;
		this.createTrophyDisplayArt();
		this.update();
		this.initOpenCloseButton();
		this.onState = false;
		this.trophyContainer.visible = this.onState;
	}

	public close():void{
		this.onState = false;
		this.trophyContainer.visible = this.onState;
	}

	private initOpenCloseButton():void {
		this.btnOpenClose.on(ButtonEvent.CLICKED, this.btnOpenCloseTriggered);
	}
	
	private btnOpenCloseTriggered = (event:Event):void => {
		this.onState = !this.onState;
		this.trophyContainer.visible = this.onState;

		if(this.onState){
			this.emit(TrophyDisplay.OPENED);
			AudioPlayer.getInstance().playSound("toj_swipe_swoosh", 0, Config.EFFECTS_VOLUME_LEVEL);
		}else{
			AudioPlayer.getInstance().playSound("toj_swipe_swoosh", 0, Config.EFFECTS_VOLUME_LEVEL);
		}
	}
	
	private createTrophyDisplayArt():void {
		this.btnOpenClose = new Button();
		this.btnOpenClose.addTexture(Texture.fromFrame("medalje"));
		this.addChild(this.btnOpenClose);
		this.btnOpenClose.pivot.x = this.btnOpenClose.width * .5;
		this.btnOpenClose.pivot.y = this.btnOpenClose.height * .5;

		this.trophyContainer = new Sprite();
		let backgroundImage:Sprite = Sprite.fromFrame("bg");
		backgroundImage.scale.x = backgroundImage.scale.y = 2;
		this.trophyContainer.addChild(backgroundImage);
		this.addChild(this.trophyContainer);
		this.trophyContainer.x = 76;
		this.trophyContainer.y = -95;
	}

	private update():void {
		if(this.diseaseCured(Level.BURN) || this.diseaseCured(Level.INSECT_BITE)){
			this.trophySkinDiseases = Sprite.fromFrame("medalje_hud");
		}else{
			this.trophySkinDiseases = Sprite.fromFrame("medalje_hud_locked");
			this.trophySkinDiseases.alpha = 0.4;
		}
		this.trophyContainer.addChild(this.trophySkinDiseases);
		this.trophySkinDiseases.x = this.SPACING_HORIZONTAL;
		this.trophySkinDiseases.y = this.SPACING_VERTICAL;
		
		if(this.diseaseCured(Level.FRACTURE_HAND) || this.diseaseCured(Level.FRACTURE_RADIUS)){
			this.trophyBonesDiseases = Sprite.fromFrame("medalje_skelet");
		}else{
			this.trophyBonesDiseases = Sprite.fromFrame("medalje_skelet_locked");
			this.trophyBonesDiseases.alpha = 0.4;
		}
		this.trophyContainer.addChild(this.trophyBonesDiseases);
		this.trophyBonesDiseases.x = this.SPACING_HORIZONTAL * 2 + this.trophySkinDiseases.width * 1;
		this.trophyBonesDiseases.y = this.SPACING_VERTICAL;
		
		
		if(this.diseaseCured(Level.PNEUMONIA)){
			this.trophyLungsDiseases = Sprite.fromFrame("medalje_lunger");
		}else{
			this.trophyLungsDiseases = Sprite.fromFrame("medalje_lunger_locked");
			this.trophyLungsDiseases.alpha = 0.4;
		}
		this.trophyContainer.addChild(this.trophyLungsDiseases);
		this.trophyLungsDiseases.x = this.SPACING_HORIZONTAL * 3 + this.trophySkinDiseases.width * 2;
		this.trophyLungsDiseases.y = this.SPACING_VERTICAL;
		
		if(this.diseaseCured(Level.POISONING)){
			this.trophyIntestinesDiseases = Sprite.fromFrame("medalje_tarm");
		}else{
			this.trophyIntestinesDiseases = Sprite.fromFrame("medalje_tarm_locked");
			this.trophyIntestinesDiseases.alpha = 0.4;
		}
		this.trophyContainer.addChild(this.trophyIntestinesDiseases);
		this.trophyIntestinesDiseases.x = this.SPACING_HORIZONTAL * 4 + this.trophySkinDiseases.width * 3;
		this.trophyIntestinesDiseases.y = this.SPACING_VERTICAL;
		
		if(this.diseaseCured(Level.SPRAIN)){
			this.trophyMusclesDiseases = Sprite.fromFrame("medalje_muskler");
		}else{
			this.trophyMusclesDiseases = Sprite.fromFrame("medalje_muskler_locked");
			this.trophyMusclesDiseases.alpha = 0.4;
		}
		this.trophyContainer.addChild(this.trophyMusclesDiseases);
		this.trophyMusclesDiseases.x = this.SPACING_HORIZONTAL * 5 + this.trophySkinDiseases.width * 4;
		this.trophyMusclesDiseases.y = this.SPACING_VERTICAL;
	}
	
	private diseaseCured(disease:string):boolean {
		let toReturn:boolean;
		for (let i:number = 0; i < Config.curedDiseases.length; i++) {
			if(Config.curedDiseases[i] == disease){
				toReturn = true;
			}
		}
		return toReturn;
	}

	public destroy():void{
		if(this.btnOpenClose != null) {
			this.btnOpenClose.off(ButtonEvent.CLICKED, this.btnOpenCloseTriggered);
			this.removeChild(this.btnOpenClose);
			this.btnOpenClose = null;
		}

		if(this.trophyContainer != null) {
			this.removeChild(this.trophyContainer);
			this.trophyContainer.removeChildren();
			this.trophyContainer = null;
		}
	}
}
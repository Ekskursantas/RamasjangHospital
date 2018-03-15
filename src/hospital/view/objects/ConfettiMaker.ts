import {ConfettiBit} from "./ConfettiBit";
import {AssetLoader} from "../../utils/AssetLoader";
import {Sprite, Texture, extras, ticker} from "pixi.js";
import {Logger} from "../../../loudmotion/utils/debug/Logger";

export class ConfettiMaker extends Sprite {
	private bitsToAnimate:ConfettiBit[];

	private timePrevious:number;
	private timeCurrent:number;
	private elapsed:number;
	private firstFrameElapsed:boolean;


	constructor () {
		super();
		this.timeCurrent = 0;
		// addEventListener(Event.ENTER_FRAME, onEnterFrame); //TODO add tick / enterFrame
		this.onAddedToStage();
	}

	private onAddedToStage():void {
		this.createKonfetti();
		ticker.shared.add( this.onEnterFrame, this );
		ticker.shared.add( this.animateConfetti, this );
	}

	private animateConfetti = (deltaTime):void => {

		if(!this.firstFrameElapsed){
			this.firstFrameElapsed = true;
			return;
		}

		let bitsToAnimateLength:number = this.bitsToAnimate.length;
		for (let i:number = 0; i < bitsToAnimateLength; i++) {
			let bitToAnimate:ConfettiBit = this.bitsToAnimate[i];

			bitToAnimate.y += bitToAnimate.speed * this.elapsed;
			if(bitToAnimate.y > AssetLoader.STAGE_HEIGHT){
				bitToAnimate.y = -10;
			}
		}
	}

	private createKonfetti():void {
		// Bits
		this.bitsToAnimate = [];
		for (let i:number = 0; i < 100; i++) {
			let textureName:string;
			if(i < 10){
				textureName = "konfetti_g";
			} else if(i < 20){
				textureName = "konfetti_h";
			} else if(i < 30){
				textureName = "konfetti_i";
			} else if(i < 40){
				textureName = "konfetti_j";
			} else if(i < 50){
				textureName = "konfetti_k";
			} else if(i < 60){
				textureName = "konfetti_l";
			} else if(i < 70){
				textureName = "konfetti_m";
			} else if(i < 80){
				textureName = "konfetti_n";
			} else if(i < 100){
				textureName = "konfetti_o";
			}

			let confettiBitImage:Sprite = Sprite.fromFrame(textureName);
			let confettiBit:ConfettiBit = new ConfettiBit();
			confettiBit.addChild(confettiBitImage);
			confettiBit.speed = 2 + Math.random() * 2;

			this.addChild(confettiBit);
			confettiBit.x = Math.round(Math.random() * AssetLoader.STAGE_WIDTH);
			confettiBit.y = -10 - Math.round(Math.random() * AssetLoader.STAGE_HEIGHT);
			this.bitsToAnimate.push(confettiBit);
		}

		// Clips
		for (let j:number = 0; j < 60; j++) {
			if(j < 10){
				let textureClip:string = "konfetti_a_ani_00";
				let clipsToAnimate = [];
				for (let i = 1; i < 5; i++) {
					let val = i < 10 ? '0' + i : i;
					// magically works since the spritesheet was loaded with the pixi loader
					clipsToAnimate.push(Texture.fromFrame(textureClip + val));
				}
				this.addConfettiClip(clipsToAnimate);
			} else if(j < 20){
				let textureClip:string = "konfetti_b_ani_00";
				let clipsToAnimate = [];
				for (let i = 1; i < 5; i++) {
					let val = i < 10 ? '0' + i : i;
					// magically works since the spritesheet was loaded with the pixi loader
					clipsToAnimate.push(Texture.fromFrame(textureClip + val));
				}
				this.addConfettiClip(clipsToAnimate);
			} else if(j < 30){
				let textureClip:string = "konfetti_c_ani_00";
				let clipsToAnimate = [];
				for (let i = 1; i < 5; i++) {
					let val = i < 10 ? '0' + i : i;
					// magically works since the spritesheet was loaded with the pixi loader
					clipsToAnimate.push(Texture.fromFrame(textureClip + val));
				}
				this.addConfettiClip(clipsToAnimate);
			} else if(j < 40){
				let textureClip:string = "konfetti_d_ani_00";
				let clipsToAnimate = [];
				for (let i = 1; i < 6; i++) {
					let val = i < 10 ? '0' + i : i;
					// magically works since the spritesheet was loaded with the pixi loader
					clipsToAnimate.push(Texture.fromFrame(textureClip + val));
				}
				this.addConfettiClip(clipsToAnimate);
			} else if(j < 50){
				let textureClip:string = "konfetti_e_ani_00";
				let clipsToAnimate = [];
				for (let i = 1; i < 5; i++) {
					let val = i < 10 ? '0' + i : i;
					// magically works since the spritesheet was loaded with the pixi loader
					clipsToAnimate.push(Texture.fromFrame(textureClip + val));
				}
				this.addConfettiClip(clipsToAnimate);
			} else if(j < 60){
				let textureClip:string = "konfetti_f_ani_00";
				let clipsToAnimate = [];
				for (let i = 1; i < 5; i++) {
					let val = i < 10 ? '0' + i : i;
					// magically works since the spritesheet was loaded with the pixi loader
					clipsToAnimate.push(Texture.fromFrame(textureClip + val));
				}
				this.addConfettiClip(clipsToAnimate);
			}
		}
	}

	private addConfettiClip(clip:any):void{
		let confettiClip:extras.AnimatedSprite = new extras.AnimatedSprite(clip);
		confettiClip.animationSpeed = .1;
		let confettiBitClip:ConfettiBit = new ConfettiBit();
		confettiBitClip.addChild(confettiClip);
		confettiBitClip.speed = 2 + Math.random() * 2;
		this.addChild(confettiBitClip);
		confettiClip.play();

		confettiBitClip.x = Math.round(Math.random() * AssetLoader.STAGE_WIDTH);
		confettiBitClip.y = -10 - Math.round(Math.random() * AssetLoader.STAGE_HEIGHT);
		this.bitsToAnimate.push(confettiBitClip);
	}

	private onEnterFrame = (deltaTime):void => {
		this.checkElapsed();
	}

	private checkElapsed():void {
		this.timePrevious = this.timeCurrent;
		// this.timeCurrent = getTimer();
		this.timeCurrent = new Date().getTime();
		this.elapsed = (this.timeCurrent - this.timePrevious) * 0.1;
	}

	public destroy():void{
		if(ticker != null) {
			ticker.shared.remove(this.onEnterFrame, this);
			ticker.shared.remove(this.animateConfetti, this);
		}
		Logger.log(this, "ConfettiMaker destroy  this.children.length == "+this.children.length);
		this.removeChildren(0, this.children.length-1);
		Logger.log(this, "ConfettiMaker destroy  AFTER this.children.length == "+this.children.length);
	}
}


import {Logger} from "src/loudmotion/utils/debug/Logger";
import {AssetLoader} from "src/hospital/utils/AssetLoader";
import {ButtonEvent} from "../../hospital/event/ButtonEvent";
import {Sprite, Texture, Point, Bounds, Rectangle} from "pixi.js";


export class Button extends Sprite {

  static SCALE_DOWN:number = .9;

  protected isOver:boolean;
  protected isDown:boolean;

  protected textureButtonDown:Texture;
  protected textureButtonOver:Texture;
  protected textureButton:Texture;

  public touchable:boolean = true;
  name:string;

  constructor(){
    super();
    // enable interactive... this will allow it to respond to mouse and touch events
    this.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    this.buttonMode = true;


    this.anchor.set(0.5);
    // this.x = buttonPositions[i*2];
    // this.y = buttonPositions[i*2 + 1];


    this
    // Mouse & touch events are normalized into
    // the pointer* events for handling different
    // button events.
        .on('pointerdown', this.onButtonDown)
        .on('pointerup', this.onButtonUp)
        .on('pointerupoutside', this.onButtonUp)
        .on('pointerover', this.onButtonOver)
        .on('pointerout', this.onButtonOut);

    // Use mouse-only events
    // .on('mousedown', onButtonDown)
    // .on('mouseup', onButtonUp)
    // .on('mouseupoutside', onButtonUp)
    // .on('mouseover', onButtonOver)
    // .on('mouseout', onButtonOut)

    // Use touch-only events
    // .on('touchstart', onButtonDown)
    // .on('touchend', onButtonUp)
    // .on('touchendoutside', onButtonUp)

  }

  protected onButtonDown() {
    Logger.log(this, "Button onButtonDown");
    if(this.touchable) {
      this.isDown = true;
      this.texture = this.textureButtonDown != null ? this.textureButtonDown : this.texture;
      // this.alpha = .7;
      this.scale.x = this.scale.y = Button.SCALE_DOWN;
    }
  }

  protected onButtonUp() {
    // Logger.log(this, "Button onButtonUp");
    if(this.touchable) {
      if (this.isOver) {
        this.texture = this.textureButtonOver != null ? this.textureButtonOver : this.texture;
      } else {
        this.texture = this.textureButton;
      }

      if (this.isDown) {
        // this.emit(ButtonEvent.CLICKED);
      }
      this.isDown = false;
      this.alpha = 1;
      this.scale.x = this.scale.y = 1;
    }
  }

  protected onButtonOver() {
    if(this.touchable) {
      // Logger.log(this, "Button onButtonOver");
      this.isOver = true;
      // this.alpha = .7;
      this.texture = this.textureButtonOver != null ? this.textureButtonOver : this.texture;
    }
  }

  protected onButtonOut() {
    if(this.touchable) {
      // Logger.log(this, "Button onButtonOut");
      this.isOver = false;
      this.isDown = false;
      // if (!this.isDown) {
      //   this.texture = this.textureButton;
      // }
      this.alpha = 1;
      this.texture = this.textureButton;
    }
  }



  public addTexture(texture:Texture):void {
    this.textureButton = texture;
    this.texture = this.textureButton;
    // this.pivot.x = this.texture.width * .5;
    // this.pivot.y = this.texture.height * .5;
  }

  public addTextureButtonDown(texture:Texture):void {
    this.textureButtonDown = texture;
  }

  public addTextureButtonOver(texture:Texture):void {
    this.textureButtonOver = texture;
  }

  public getTextureBounds():Rectangle{
    return new Rectangle(this.x, this.y, this.width, this.height);
  }

  public dispose():void{
    Logger.log(this, "Button dispose() this == "+this);
    // AssetLoader.getInstance().stage.removeChild(this);
  }

  public destroy():void{
    // override in subclass
    this.off('pointerdown', this.onButtonDown);
    this.off('pointerup', this.onButtonUp);
    this.off('pointerupoutside', this.onButtonUp);
    this.off('pointerover', this.onButtonOver);
    this.off('pointerout', this.onButtonOut);
  }


}

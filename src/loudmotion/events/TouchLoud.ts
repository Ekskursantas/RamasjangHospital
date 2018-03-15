
import {Sprite, DisplayObject, utils, Point, Matrix} from "pixi.js";
import {Logger} from "../utils/debug/Logger";
import {MatrixUtils} from "../utils/MatrixUtils";
import {TouchPhase} from "./TouchLoudPhase";
import EventEmitter = utils.EventEmitter;

export class Touch extends Sprite{


  // public static TOUCH:string = "mousedown";
  // public static TOUCH_END:string = "mouseup";
  // public static TOUCH_OUT:string = "mouseout";
  // public static TOUCH_MOVE:string = "mousemove";

  public static TOUCH:string = "pointerdown";
  public static TOUCH_END:string = "pointerup";
  public static TOUCH_OUT:string = "pointerout";
  public static TOUCH_MOVE:string = "pointermove";


  private mID:number;
  private mGlobalX:number;
  private mGlobalY:number;
  private mPreviousGlobalX:number;
  private mPreviousGlobalY:number;

  phase:string;
  private touchDown:boolean;
  
  target:Sprite;

  private mBubbleChain:EventEmitter[];
  private mTarget:DisplayObject;
  /** Helper object. */
  private static sHelperMatrix:Matrix = new Matrix();


  // public Touch(id:int, globalX:number, globalY:number, phase:String, target:DisplayObject) Starling Touch

  constructor(){
    super();

    this.mBubbleChain = [];
    // this.mTarget = target;

    // enable interactive... this will allow it to respond to mouse and touch events
    this.interactive = true;

    // hand cursor appears when you roll over the item
    this.buttonMode = true;


    // this.anchor.set(0.5); //TODO do we need this?


    // this.x = buttonPositions[i*2];
    // this.y = buttonPositions[i*2 + 1];


    this
    // Mouse & touch events are normalized into
    // the pointer* events for handling different
    // button events.
    //     .on('pointerdown', this.onTouchStart)
    //     .on('pointerup', this.onTouchEnd)
    //     .on('pointerupoutside', this.onTouchEnd)
    //     .on('pointerout', this.onTouchOut);

        .on(Touch.TOUCH, this.onTouchStart)
        .on(Touch.TOUCH_END, this.onTouchEnd)
        .on(Touch.TOUCH_OUT, this.onTouchOut)
        .on(Touch.TOUCH_MOVE, this.onTouchMove)


    // AssetLoader.getInstance().assetCanvas.on('mousedown', this.mouseDownCallback);
    // AssetLoader.getInstance().assetCanvas.on('mouseup', this.mouseUpCallback);
    // AssetLoader.getInstance().assetCanvas.on('mousemove', this.mouseMoveCallback);



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


  protected onTouchStart() {
    this.touchDown = true;
    Logger.log(this, "Touch onTouchStart");
  }

  protected onTouchEnd() {
    this.touchDown = false;
    Logger.log(this, "Touch onTouchEnd");

  }

  protected onTouchMove() {
    Logger.log(this, "Touch onTouchMove");
  }

  protected onTouchOut() {
    this.touchDown = false;
    Logger.log(this, "Touch onTouchOut");
  }

  /** Indicates if the target or one of its children is touched. */
  public isTouching(target:DisplayObject):boolean {
    return this.mBubbleChain.indexOf(target) != -1;
  }

  private updateBubbleChain():void {
    if (this.mTarget) {
      let length:number = 1;
      let element:DisplayObject = this.mTarget;

      this.mBubbleChain.length = 1;
      this.mBubbleChain[0] = element;

      while ((element = element.parent) != null)
        this.mBubbleChain[Number(length++)] = element;
    } else {
      this.mBubbleChain.length = 0;
    }
  }


  /** Converts the current location of a touch to the local coordinate system of a display
   *  object. If you pass a 'resultPoint', the result will be stored in this point instead
   *  of creating a new object.*/
  public getLocation(space:DisplayObject, resultPoint:Point=null):Point {
    // if (resultPoint == null) resultPoint = new Point();
    //   // space.base.getTransformationMatrix(space, Touch.sHelperMatrix); //TODO orig
    //   return MatrixUtils.transformCoords(Touch.sHelperMatrix, this.mGlobalX, this.mGlobalY, resultPoint);
    // }
    return new Point(space.x, space.y);
  }

  setPosition(globalX:number, globalY:number):void {
    this.mPreviousGlobalX = this.mGlobalX;
    this.mPreviousGlobalY = this.mGlobalY;
    this.mGlobalX = globalX;
    this.mGlobalY = globalY;
  }

  /** The x-position of the touch in stage coordinates. */
  public get globalX():number { return this.mGlobalX; }

  /** The y-position of the touch in stage coordinates. */
  public get globalY():number { return this.mGlobalY; }

  /** The previous x-position of the touch in stage coordinates. */
  public get previousGlobalX():number { return this.mPreviousGlobalX; }

  /** The previous y-position of the touch in stage coordinates. */
  public get previousGlobalY():number { return this.mPreviousGlobalY; }

}



// private initStageTouchListener():void {
//   Logger.log(this, "Eye initStageTouchListener");
// // AssetLoader.getInstance().stage.on(TouchEvent.TOUCH, this.stageTouchListener);
// // AssetLoader.getInstance().assetCanvas.on(ButtonEvent.CLICKED, this.stageTouchListener);
// AssetLoader.getInstance().assetCanvas.on('mousedown', this.mouseDownCallback);
// AssetLoader.getInstance().assetCanvas.on('mouseup', this.mouseUpCallback);
// AssetLoader.getInstance().assetCanvas.on('mousemove', this.mouseMoveCallback);
// }
//
// private mouseDownCallback = (event:InteractionEvent) => {
//   this.mouseDown = true;
//   let mousePosition:Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
//   this.lookAtPoint(mousePosition);
// }
//
// private mouseUpCallback = (event:InteractionEvent) => {
//   this.mouseDown = false;
// }
//
// private mouseMoveCallback = (event:InteractionEvent) => {
//   if(this.mouseDown){
//     Logger.log(this, "Eye mouseMoveCallback getLocalPosition === "+event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas).x+" : "+event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas).y);
//
//     let mousePosition:Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);
//     this.lookAtPoint(mousePosition);
//   }
// }

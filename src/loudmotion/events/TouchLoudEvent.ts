
import {Sprite, DisplayObject, interaction, utils} from "pixi.js";
import {Logger} from "../utils/debug/Logger";
import InteractionEvent = interaction.InteractionEvent;
import EventEmitter = utils.EventEmitter;
import InteractionData = interaction.InteractionData;
import {TouchPhase} from "./TouchLoudPhase";
import {Touch} from "./TouchLoud";

export class TouchEvent extends EventEmitter implements InteractionEvent {

    // public static TOUCH:string = "mousedown";
    // public static TOUCH_END:string = "mouseup";
    // public static TOUCH_OUT:string = "mouseout";
    // public static TOUCH_MOVE:string = "mousemove";

    public static TOUCH:string = "pointerdown";
    public static TOUCH_END:string = "pointerup";
    public static TOUCH_OUT:string = "pointerout";
    public static TOUCH_MOVE:string = "pointermove";

    stopped: boolean;
    target: DisplayObject;
    touchedItem: DisplayObject;
    currentTarget: DisplayObject;
    type: string;
    data: InteractionData;

    private mBubbles:boolean;
    private mData:Object;
    /** Arbitrary data that is attached to the event. */
    public get dataObject():Object {
        return this.mData;
    }

    private static sTouches:Touch[] = [];

    // currentTarget:Sprite;
    // target:Sprite;

    constructor (type:string, touchedItem:Sprite, bubbles:boolean=false, data:Object=null){
        super();
        this.type = type;
        this.touchedItem = touchedItem;
        this.mBubbles = bubbles;
        this.mData = data;
        Logger.log(this, "TouchEvent constructor  type == "+type);
    }

    // getTouch(display:DisplayObject, touchPhase:string="touchphase"):Touch{
    //   let displayReturn:Touch;
    //   return displayReturn;
    // }


    /** Returns a list of touches that originated over a certain target. If you pass a
     *  'result' vector, the touches will be added to this vector instead of creating a new
     *  object. */
    public getTouches(target:DisplayObject, phase:string=null, result:Touch[]=null):Touch[] {
        if (result == null) {
            result = [];
        }
        let allTouches:Touch[] = this.dataObject as Touch[];
        let numTouches:number = allTouches.length;

        for (let i:number=0; i<numTouches; ++i) {
            let touch:Touch = allTouches[i];
            let correctTarget:boolean = touch.isTouching(target);
            let correctPhase:boolean = (phase == null || phase == touch.phase);

            if (correctTarget && correctPhase)
                result.push(touch);
        }
        return result;
    }

    /** Returns a touch that originated over a certain target. */
    public getTouch = (target:DisplayObject, phase:string=null):Touch => {

        let toReturn:Touch;
        this.getTouches(target, phase, TouchEvent.sTouches);
        Logger.log(this, "TouchEvent getTouch TouchEvent.sTouches.length == "+TouchEvent.sTouches.length);
        if (TouchEvent.sTouches.length) {
            let touch:Touch = TouchEvent.sTouches[0];
            TouchEvent.sTouches.length = 0;
            toReturn = touch;
        }
        return toReturn;
    }

    stopPropagation():void{

    }

    /** All touches that are currently available. */
    public get touches():Touch[] {
        return (this.dataObject as Touch[]).concat();
    }
}

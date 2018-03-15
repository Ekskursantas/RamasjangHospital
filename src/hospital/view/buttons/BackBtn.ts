import {ButtonEvent} from "../../event/ButtonEvent";
import {HospitalEvent} from "../../event/HospitalEvent";
import {Logger} from "../../../loudmotion/utils/debug/Logger";
import {Button} from "../../../loudmotion/ui/Button";
import {Sprite, Texture} from "pixi.js";
import {AssetLoader} from "../../utils/AssetLoader";
import {AudioPlayer} from "../../../loudmotion/utils/AudioPlayer";
import {Config} from "../../Config";


/**
 * Created by loudmotion on 01/03/2017.
 */


export class BackBtn extends Sprite {

    public static OFFSET_X:number = 20;
    public static OFFSET_Y: number = 600;

    public btnBack:Button;
    private destination:string;
    private sprite:Sprite;
    private textureName:string;

    constructor(sprite:Sprite, destination:string = HospitalEvent.QUIT_APP, textureName:string = "ramasjang_tilbagepil", posRight:boolean=false) {
        super();
        this.sprite = sprite;
        this.destination = destination;
        this.textureName = textureName;
        this.createButton(posRight);
    }

    //TODO minigames and sound
    // private btnBackPressed(event:Event):void {
    //     clearTimeout(Config.currentTimeout);
    //     // sndMan.stopSound(Config.currentSpeakSound); //TODO sound
    //
    //     // dispatchEvent(new HospitalEvent(HospitalEvent.BACK_FROM_OPERATING_ROOM, true));
    //     this.emit(HospitalEvent.BACK_FROM_OPERATING_ROOM);
    // }
    //
    // private btnToWaitingRoomPressed(event:Event):void {
    //     clearTimeout(Config.currentTimeout);
    //     // sndMan.stopSound(Config.currentSpeakSound); //TODO sound
    //
    //     // dispatchEvent(new HospitalEvent(HospitalEvent.BACK_FROM_OPERATING_ROOM, true));
    //     this.emit(HospitalEvent.BACK_FROM_OPERATING_ROOM);
    // }

    private createButton(posRight:boolean=false):void{
        this.btnBack = new Button();
        this.btnBack.addTexture(Texture.fromFrame(this.textureName));
        this.sprite.addChild(this.btnBack);
        this.btnBack.pivot.x = Math.floor(this.btnBack.width * .5);
        this.btnBack.pivot.y = Math.floor(this.btnBack.height * .5);
        this.btnBack.name = "back";

        if(posRight){
            this.btnBack.x = Math.floor(AssetLoader.STAGE_WIDTH - (BackBtn.OFFSET_X + Math.abs(Math.floor(AssetLoader.getInstance().ratioX / 2)))-15);
        }else {
            this.btnBack.x = Math.floor(this.btnBack.width + (BackBtn.OFFSET_X + Math.abs(Math.floor(AssetLoader.getInstance().ratioX / 2))));
        }
        let addedY:number = posRight ? 20 : 0;
        this.btnBack.y = Math.floor(this.btnBack.height + BackBtn.OFFSET_Y + addedY + Math.abs(Math.floor(AssetLoader.getInstance().ratioY / 2)) + addedY);
        this.btnBack.on(ButtonEvent.CLICKED, this.btnBackPressed);
    }

    private btnBackPressed = (event:Event):void => {
        Logger.log(this, "BackBtn btnBackPressed");
        this.btnBack.off(ButtonEvent.CLICKED, this.btnBackPressed);
        // sndMan.stopSound(Config.currentSpeakSound); //TODO sound
        if(Config.currentSpeakSound != null) {
            AudioPlayer.getInstance().stopSound(Config.currentSpeakSound);
        }
        this.emit(this.destination);
    }

    public destroy():void{
        this.btnBack.off(ButtonEvent.CLICKED, this.btnBackPressed);
        this.sprite.removeChild(this.btnBack);
        Logger.log(this, "BackBtn this.btnBack destroy");

    }

}




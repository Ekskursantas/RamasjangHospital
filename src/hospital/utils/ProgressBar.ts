
import {Logger} from "../../loudmotion/utils/debug/Logger";
import {Sprite, Graphics} from "pixi.js";
import {AssetLoader} from "./AssetLoader";

export class ProgressBar extends Sprite {

    public static PROGRESS_BAR_HEIGHT:number = 20;

    private mBar:Graphics; //TODO was Quad from Starling
    private mBarBg:Graphics; //TODO was Quad from Starling
    private mBackground:Sprite;
    private progressAmount:number;

    constructor (width:number, height:number) {
        super();
        this.init(width, height);
    }

    private init(width:number = AssetLoader.STAGE_WIDTH * .5, height:number = ProgressBar.PROGRESS_BAR_HEIGHT):void {
        Logger.log(this, "ProgressBar.init(width, height)  width == "+width+" : height == "+height);

        // var scale:number = Starling.contentScaleFactor;
        let scale:number = 1; //TODO

        // let padding:number = height * 0.2;
        // let cornerRadius:number = padding * scale * 2;


        // create progress bar quad

        // this.mBar = new Rectangle(padding, padding, width - 2 * padding, height - 2 * padding, );

        this.mBarBg = new Graphics(); //TODO temp to check area
        this.mBarBg.beginFill(0x333333);
        this.addChild(this.mBarBg);
        this.mBarBg.drawRect(0, 0, width, height);
        this.mBarBg.x = Math.floor(AssetLoader.STAGE_WIDTH * .5 - this.mBarBg.width * .5);
        this.mBarBg.y = Math.floor(AssetLoader.STAGE_HEIGHT * .5 - this.mBarBg.height * .5);

        this.mBar = new Graphics(); //TODO temp to check area
        this.mBar.beginFill(0xaaaaaa);
        this.addChild(this.mBar);
        this.mBar.drawRect(0, 0, width, height);
        this.mBar.x = this.mBarBg.x;
        this.mBar.y = this.mBarBg.y;
        this.mBar.scale.x = 0;

        Logger.log(this, "ProgressBar init this.mBar == "+this.mBar.x+" : "+this.mBar.y+" : "+this.mBar.width+" : "+this.mBar.height);


        // this.mBar.setVertexColor(2, 0xaaaaaa); //TODO
        // this.mBar.setVertexColor(3, 0xaaaaaa);
        // color = 0xeeeeee; //TODO
        // this.mBar.scaleX = 0; //TODO
        // this.addChild(this.mBar); //TODO
    }

    public get ratio():number {
        return this.progressAmount;
        // return this.mBar.scale.x;
    }

    public set ratio(value:number) {
        this.progressAmount = value;
        // Logger.log(this, "ProgressBar set ratio this.progressAmount == "+this.progressAmount);
        if(this.mBar != null) {
            this.mBar.scale.x = Math.max(0.0, Math.min(1.0, value));
            this.mBar.x = this.mBarBg.x;
        }
    }

    public destroy():void{
        if(this.mBar != null) {
            this.removeChild(this.mBar);
        }
        if(this.mBarBg != null) {
            this.removeChild(this.mBarBg);
        }

    }
}
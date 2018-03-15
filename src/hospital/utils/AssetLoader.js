"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
//import InteractionEvent = interaction.InteractionEvent;
//import {AudioPlayer} from "../../loudmotion/utils/AudioPlayer";
//import LoadQueue = createjs.LoadQueue;
//import {ProgressBar} from "./ProgressBar";
var AssetLoader = /** @class */ (function (_super) {
    __extends(AssetLoader, _super);
    function AssetLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AssetLoader.getInstance = function () {
        if (AssetLoader._instance == null) {
            AssetLoader._instance = new AssetLoader();
        }
        return AssetLoader._instance;
    };
    Object.defineProperty(AssetLoader, "instantiated", {
        get: function () {
            return Boolean(AssetLoader._instance);
        },
        enumerable: true,
        configurable: true
    });
    AssetLoader.destroySingleton = function () {
        if (AssetLoader.instantiated) {
            AssetLoader._instance.destroy();
        }
    };
    AssetLoader.prototype.init = function () {
        //let devicePixelRatio:number = 1; //TODO TEMP added for testing
        this.ratioX = 0;
        this.ratioY = 0;
        //this.destroying = false;
        //this._onCompleteCallback = onCompleteCallback;
        //AssetLoader.STAGE_WIDTH *= devicePixelRatio; //TODO do we need to take devicePixelRatio into account?
        //AssetLoader.STAGE_HEIGHT *= devicePixelRatio;
        //Logger.log(this, "init  NOW AssetLoader.STAGE_WIDTH == "+AssetLoader.STAGE_WIDTH);
        //Logger.log(this, "init  NOW AssetLoader.STAGE_HEIGHT == "+AssetLoader.STAGE_HEIGHT);
        //// create stage and point it to the canvas:
        //this.hospitalCanvas = <HTMLCanvasElement>document.getElementById('canvas_hospital');
        //Logger.log(this, "init  this.hospitalCanvas == "+this.hospitalCanvas);
        //this._renderer = autoDetectRenderer(AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT, {view: this.hospitalCanvas});
        //this._renderer.backgroundColor = 0x1099bb;
        ///*
        // * Fix for iOS GPU issues
        // */
        //this._renderer.view.style['transform'] = 'translatez(0)'; //TODO do we need this? https://codepen.io/osublake/pen/ORJjGj
        //AssetLoader.getInstance().stage = new Container();
        //AssetLoader.getInstance().stage.interactive = true;
        //AssetLoader.getInstance().stage.hitArea = new Rectangle(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
        this.assetCanvas = new pixi_js_1.Graphics();
        this.assetCanvas.interactive = true;
        this.assetCanvas.beginFill(0xFFFFFF);
        this.assetCanvas.alpha = 0.05;
        this.assetCanvas.drawRect(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
    };
    AssetLoader.QUEUE_COMPLETE = "complete";
    AssetLoader.QUEUE_FILE_LOAD = "fileload";
    AssetLoader.QUEUE_PROGRESS = "progress";
    AssetLoader.QUEUE_ERROR = "error";
    //get assetLoader(): Loader {
    //	return this._assetLoader;
    //}
    // IOS screen info
    // https://developer.apple.com/ios/human-interface-guidelines/graphics/launch-screen/
    // Device							Portrait size				Landscape size
    // iPhone 6s Plus, iPhone 6 Plus 	1080px by 1920px			1920px by 1080px
    // iPhone 6s, iPhone 6				750px by 1334px				1334px by 750px
    // iPhone SE						640px by 1136px				1136px by 640px
    // 12.9-inch iPad Pro				2048px by 2732px			2732px by 2048px
    // 9.7-inch iPad Pro, iPad Air 2,
    //iPad mini 4, iPad mini 2 		1536px by 2048px			2048px by 1536px
    // https://developer.apple.com/ios/human-interface-guidelines/graphics/image-size-and-resolution/
    // Device											Scale factor
    // iPhone 6s Plus and iPhone 6 Plus				@3x
    // All other high-resolution iOS devices			@2x
    //
    // A standard resolution image has a scale factor of 1.0 and is referred to as an @1x image.
    // High resolution images have a scale factor of 2.0 or 3.0 and are referred to as @2x and @3x images.
    // Suppose you have a standard resolution @1x image that’s 100px by 100px, for example.
    // The @2x version of this image would be 200px by 200px.
    // The @3x version would be 300px by 300px.
    // Android screen info
    // https://developer.android.com/guide/practices/screens_support.html
    //public static soundsManifest:any[];
    AssetLoader.ASSET_LOADED = "asset_loaded";
    AssetLoader.STAGE_WIDTH = 1364; //TODO orig size of as3 project
    AssetLoader.STAGE_HEIGHT = 768;
    AssetLoader.leftXOffsetVirtual = 0;
    AssetLoader.rightXOffsetVirtual = 1364;
    //static assets:any;
    //static MEDIA_PATH:string;
    //private progressBar:ProgressBar;
    AssetLoader._instance = null;
    return AssetLoader;
}(pixi_js_1.Sprite));
exports.AssetLoader = AssetLoader;
//# sourceMappingURL=AssetLoader.js.map
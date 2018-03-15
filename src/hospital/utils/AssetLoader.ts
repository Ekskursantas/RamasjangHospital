import {
	Texture,
	Sprite,
	Rectangle,
	autoDetectRenderer,
	Container,
	WebGLRenderer,
	CanvasRenderer,
	Graphics,
	Point,
	loaders,
	loader,
	interaction
} from "pixi.js";
//import {TouchPhase} from "../../loudmotion/events/TouchLoudPhase";
//import {TouchEvent} from "../../loudmotion/events/TouchLoudEvent";
//import { Logger } from "../../loudmotion/utils/debug/Logger";
import Loader = loaders.Loader;
//import InteractionEvent = interaction.InteractionEvent;
//import {AudioPlayer} from "../../loudmotion/utils/AudioPlayer";
//import LoadQueue = createjs.LoadQueue;
//import {ProgressBar} from "./ProgressBar";


export class AssetLoader extends Sprite {
    public phase: string;

    public static QUEUE_COMPLETE: string = "complete";
    public static QUEUE_FILE_LOAD: string = "fileload";
    public static QUEUE_PROGRESS: string = "progress";
    public static QUEUE_ERROR: string = "error";

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

    static ASSET_LOADED: string = "asset_loaded";
    static STAGE_WIDTH: number = 1364; //TODO orig size of as3 project
    static STAGE_HEIGHT: number = 768;


    static leftXOffsetVirtual: number = 0;
    static rightXOffsetVirtual: number = 1364;
    //static assets:any;
    //static MEDIA_PATH:string;

    //private progressBar:ProgressBar;

    private static _instance: AssetLoader = null;
    static getInstance(): AssetLoader {
        if (AssetLoader._instance == null) {
            AssetLoader._instance = new AssetLoader();
        }
        return AssetLoader._instance;
    }

    public static get instantiated(): boolean {
        return Boolean(AssetLoader._instance);
    }

    public static destroySingleton(): void {
        if (AssetLoader.instantiated) {
            AssetLoader._instance.destroy();
        }
    }
    
    //public get sprites():any {
    //	return this._sprites;
    //}
    //public get renderer():any {
    //	return this._renderer;
    //}

    //public set renderer(value:any) {
    //	this._renderer = value;
    //}

    //private _assetLoader:Loader;
    //private _renderer:WebGLRenderer | CanvasRenderer;
    //stage:Container;
    assetCanvas: Graphics;

    //private mStarted:boolean;
    //public get isStarted():boolean {
    //	return this.mStarted;
    //}
    //public set isStarted(set:boolean) {
    //	this.mStarted = set;
    //}

    //private _onCompleteCallback:Function;

    //private _loader:Loader;
    //private _sprites:any = {};
    //loadedData:any[] = [];//store json

    //protected characterAssets:Object = {};

    //dragging:boolean;
    //dragPos:Point;
    //lastDragPos:Point;
    //slice1:Sprite;

    //hospitalCanvas:HTMLCanvasElement;

    //private _assetLoadQueue:createjs.LoadQueue;

    //private timePassed:number;
    //private destroying:boolean;

    //constructor() {
    //	super();

    //}
    ratioX: number;
    ratioY: number;

    public init(): void {
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

        this.assetCanvas = new Graphics();
        this.assetCanvas.interactive = true;
        this.assetCanvas.beginFill(0xFFFFFF);
        this.assetCanvas.alpha = 0.05;
        this.assetCanvas.drawRect(0, 0, AssetLoader.STAGE_WIDTH, AssetLoader.STAGE_HEIGHT);
    }
        //this.stage.addChild(this.assetCanvas);

        //this.assetCanvas.on(TouchEvent.TOUCH, this.onTouch);
        //this.assetCanvas.on(TouchEvent.TOUCH_END, this.onTouch);
        //// this.assetCanvas.on(TouchEvent.TOUCH_OUT, this.onTouch);
        //this.assetCanvas.on(TouchEvent.TOUCH_MOVE, this.onTouch);

        //this.timePassed = new Date().getTime();
        //this.update();
        //}

        // app = new Application(); //TODO check this out
        //public update = ():void => {
        //	if(!this.destroying) {
        //		if (AssetLoader.getInstance().stage && AssetLoader.getInstance().stage.children.length > 0) {
        //			this._renderer.render(AssetLoader.getInstance().stage);
        //		}

        //		requestAnimationFrame(this.update);
        //	}else{
        //		Logger.log(this, "update  this.destroying == "+this.destroying);
        //	}
        //}

        //private onAssetsLoaded = (loader: loaders.Loader) :void => {

        //	Logger.log(this, "onAssetsLoaded  this._onCompleteCallback == "+this._onCompleteCallback);
        //	this.isStarted = true;



        //	if(this._onCompleteCallback != null) {
        //		this._onCompleteCallback();
        //	}

        //	Logger.log(this, "onAssetsLoaded AFTER CALLBACK this._onCompleteCallback == "+this._onCompleteCallback);
        //}

        //private onTouch = (event:TouchEvent):void => {
        //	let mousePosition:Point = event.data.getLocalPosition(AssetLoader.getInstance().assetCanvas);

        //	if (this.isStarted) {

        //		switch (event.type) {
        //			case TouchEvent.TOUCH:
        //				this.phase = TouchPhase.BEGAN;
        //				break;
        //			case TouchEvent.TOUCH_MOVE:
        //				this.phase = TouchPhase.MOVED;
        //				break;
        //			case TouchEvent.TOUCH_END:
        //				this.phase = TouchPhase.ENDED;
        //				break;
        //		}
        //	}
        //}

        //public loadAssets():void{
        //	Logger.log(this, "loadAssets");

        //	this.progressBar = new ProgressBar(AssetLoader.STAGE_WIDTH * .5, ProgressBar.PROGRESS_BAR_HEIGHT);
        //	this.stage.addChild(this.progressBar);
        //       Logger.log(this, "loadAssets this.progressBar == " + this.progressBar);
        //       this._assetLoader = loader; //baseUrl?
        //	this._assetLoader.on("progress", this.loadAssetsProgressHandler);
        //       this._assetLoader.on('complete', this.onAssetsLoaded);

        //       AssetLoader.MEDIA_PATH = "http://139.59.133.187:3000/modules/dist_folder/" + AssetLoader.MEDIA_PATH;

        //       this._assetLoader
        //           .add(AssetLoader.MEDIA_PATH + "textures/1x/ramasjangHospitalet_spriteAtlas_1.json")
        //           .add(AssetLoader.MEDIA_PATH + "textures/1x/ramasjangHospitalet_spriteAtlas_2.json")
        //           .add(AssetLoader.MEDIA_PATH + "textures/1x/ramasjangHospitalet_spriteAtlas_3.json")
        //           .add(AssetLoader.MEDIA_PATH + "textures/1x/ramasjangHospitalet_spriteAtlas_4.json")
        //           .add(AssetLoader.MEDIA_PATH + "textures/1x/ramasjangHospitalet_spriteAtlas_5.json")

        //		.add("BackArrow", AssetLoader.MEDIA_PATH + "textures/1x/BackArrow.png")
        //		.add("forgiftning_tarm", AssetLoader.MEDIA_PATH + "textures/1x/forgiftning_tarm.png")
        ////           .add("lungebetaendelse_lunger", AssetLoader.MEDIA_PATH + "textures/1x/lungebetaendelse_lunger.png");
        //       console.log(this._assetLoader.resources);
        //       this._assetLoader.load();

        //}

        //public loadSoundUrl(onCompleteCallback:Function):void{

        //	this._onCompleteCallback = onCompleteCallback;
        //	Logger.log(this, "loadSoundUrl   this._onCompleteCallback == "+this._onCompleteCallback);
        //	this._assetLoadQueue = new LoadQueue(true, null, true);
        //	this._assetLoadQueue.installPlugin(<any>createjs.Sound);
        //	//this._assetLoadQueue.setMaxConnections(8); // Allow multiple concurrent loads - taken out, was causing hang on load for slower connections july_15
        //	this._assetLoadQueue.on(AssetLoader.QUEUE_COMPLETE, (e: createjs.Event) => { this.onSoundLoadComplete(e) });
        //	this._assetLoadQueue.on(AssetLoader.QUEUE_PROGRESS, (e: createjs.Event) => { this.handleSoundProgress(e) });
        //	// this._assetLoadQueue.on(AssetLoader.QUEUE_FILE_LOAD, (e: createjs.Event) => { this.handleFileLoad(e) });
        //	this._assetLoadQueue.on(AssetLoader.QUEUE_ERROR, (e: createjs.Event) => { this.loadSoundError(e) });


        //	// TODO sound manifests not working on external load
        //	AssetLoader.soundsManifest = [];

        //       AssetLoader.soundsManifest.push({ src: AssetLoader.MEDIA_PATH + "audio/music/intro_music/intro_02.mp3", id: "intro" });
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/music/waiting_room_music/fastguitar_loop_04.mp3", id:"waiting_room_loop"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/lung_sfx/lung_breath/lung_breath_sfx_loop_v02.mp3", id:"lung_breath_sfx_loop"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/done_v08.mp3", id:"done"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/done_patient_v01.mp3", id:"done_patient"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/negative_v05.mp3", id:"negative"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/positive_v03.mp3", id:"positive"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/klapsalve_03.mp3", id:"klapsalve"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/lung_sfx/die_bacteria/lung_die_v01.mp3", id:"lung_die"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/lung_sfx/hit_bacteria/lung_hit_v01.mp3", id:"lung_hit"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/lung_sfx/pinicillin/lung_pincillin_v01.mp3", id:"lung_pincillin"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/lung_sfx/split_bacteria/lung_split_v01.mp3", id:"lung_split"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/lung_sfx/lung_cough/lung_cough_v01.mp3", id:"lung_cough_v01"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/lung_sfx/lung_cough/lung_cough_v02.mp3", id:"lung_cough_v02"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/lung_sfx/lung_cough/lung_cough_v03.mp3", id:"lung_cough_v03"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/1_bruise_sfx/pincet_v04.mp3", id:"pincet_v04"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/knogle_v04.mp3", id:"knogle"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/salve_loop_v01.mp3", id:"salve_loop"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/gips_v02.mp3", id:"gips"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/four_scanner_noise_sounds/scanner_loop_v13.mp3", id:"scanner_loop"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/four_scanner_noise_sounds/scanner_noise_v05.mp3", id:"scanner_noise"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/poison_v02.mp3", id:"poison"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/pop_v02.mp3", id:"pop"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/drink_water_v03.mp3", id:"drink_water"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/toj_swipe_swoosh.mp3", id:"toj_swipe_swoosh"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/train_flute_01.mp3", id:"train_flute"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/picture_v01.mp3", id:"picture"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/clik_on_v01.mp3", id:"clik_on"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/clik_off_v01.mp3", id:"clik_off"});


        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/velkomst/mille_hej_og_velkommen_til_ramasjang_hospitalet_tryk_pa_start.mp3", id:"mille_hej_og_velkommen"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/barn/tryk_paa_patient/barn_det_rumler_i_min_mave_mon_det_er_noget_jeg_har_spist.mp3", id:"barn_det_rumler_i_min_mave_mon_det_er_noget_jeg_har_spist"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/barn/tryk_paa_patient/barn_jeg_er_blevet_stukket_af_en_bi_kan_du_hjaelpe_mig.mp3", id:"barn_jeg_er_blevet_stukket_af_en_bi_kan_du_hjaelpe_mig"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/barn/tryk_paa_patient/barn_jeg_har_braendt_mig_pa_en_gryde.mp3", id:"barn_jeg_har_braendt_mig_pa_en_gryde_skal_vi_komme_is_pa"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/barn/tryk_paa_patient/barn_jeg_har_slaet_min_hand.mp3", id:"barn_jeg_har_slaet_min_hand"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/barn/tryk_paa_patient/barn_jeg_hoster_rigtig_meget_mon_jeg_er_forkolet.mp3", id:"barn_jeg_hoster_rigtig_meget_mon_jeg_er_forkolet"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/barn/tryk_paa_patient/barn_min_arm_er_forstuvet_kan_du_reparere_den.mp3", id:"barn_min_arm_er_forstuvet_kan_du_reparere_den"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/barn/tryk_paa_patient/barn_min_arm_er_vist_braekket_fordi_jeg_vaeltede_pa_min_cykel.mp3", id:"barn_min_arm_er_vist_braekket_fordi_jeg_vaeltede_pa_min_cykel"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/barn/tryk_paa_patient/barn_jubii.mp3", id:"barn_jubii"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/barn/tryk_paa_patient/barn_arh_nej_hvornar_er_det_min_tur.mp3", id:"barn_arh_nej_hvornar_er_det_min_tur"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/barn/nyt_toej/barn_jubii_01.mp3", id:"barn_nyt_toj_1"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/barn/nyt_toej/barn_wow_02.mp3", id:"barn_nyt_toj_2"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/barn/nyt_toej/barn_wow_04.mp3", id:"barn_nyt_toj_3"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/mille/00_hjaelpe_speak_ventevaerelset/mille_der_er_nogle_born_der_er_blevet_syge.mp3", id:"mille_der_er_nogle_born_der_er_blevet_syge"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/mille/00_hjaelpe_speak_ventevaerelset/mille_kan_du_hjaelpe_en_af_bornene_ind_gennem_den_bla_dor.mp3", id:"mille_kan_du_hjaelpe_en_af_bornene_ind_gennem_den_bla_dor"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/mille/00_hjaelpe_speak_ventevaerelset/mille_er_du_klar_til_at_hjaelpe_en_til.mp3", id:"mille_er_du_klar_til_at_hjaelpe_en_til"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/mille/paaklaedning/mille_hvad_mon_der_er_i_kufferten.mp3", id:"mille_kufferten_1"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/mille/paaklaedning/mille_sikke_en_fin_kuffert_er_den_last.mp3", id:"mille_kufferten_2"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/mille/paaklaedning/mille_orh_sikke_noget_flot_toj.mp3", id:"mille_orh_sikke_noget_flot_toj"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/mille/paaklaedning/mille_prov_at_give_bonene_noget_nyt_toj_pa.mp3", id:"mille_prov_at_give_bonene_noget_nyt_toj_pa"});


        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_av_for_en_hundestejle.mp3", id:"mille_av_for_en_hundestejle"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_det_er_altsa_mega_uheldigt.mp3", id:"mille_det_er_altsa_mega_uheldigt"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_host_host_vi_kan_alle_blive_syge.mp3", id:"mille_host_host_vi_kan_alle_blive_syge"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_na_da_her_er_en_der_har_brandt_sig.mp3", id:"mille_na_da_her_er_en_der_har_brandt_sig"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_nu_skal_du_bahandle_en_brakket_hand.mp3", id:"mille_nu_skal_du_bahandle_en_brakket_hand"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_prov_lige_at_leg_ninja.mp3", id:"mille_prov_lige_at_leg_ninja"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_puha_nogen_der_har_slaet_en_fis.mp3", id:"mille_puha_nogen_der_har_slaet_en_fis"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/mille_kan_du_se_maskinen_der_blinker.mp3", id:"mille_kan_du_se_maskinen_der_blinker"});


        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_prov_om_du_kan_hive_bistikkene_ud_med_pincetten.mp3", id:"mille_prov_om_du_kan_hive_bistikkene_ud_med_pincetten"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_pincetten_skal_have_fat_om_bistikket.mp3", id:"mille_pincetten_skal_have_fat_om_bistikket"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_godt_klaret_kan_du_fjerne_en_mere.mp3", id:"mille_godt_klaret_kan_du_fjerne_en_mere"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_perfekt_alle_bistikkene_er_vaek.mp3", id:"mille_perfekt_alle_bistikkene_er_vaek"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_uhh_hvot_sar_bare_klor_helt_vildt_meget_skynd_dig_at_smore_creme_pa.mp3", id:"mille_uhh_hvot_sar_bare_klor_helt_vildt_meget_skynd_dig_at_smore_creme_pa"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_perfekt_alle_bakterierne_er_vaek.mp3", id:"mille_perfekt_alle_bakterierne_er_vaek"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_pincetten_skal_have_fat_om_bakterien.mp3", id:"mille_pincetten_skal_have_fat_om_bakterien"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_prov_at_traekke_bakterierne_ud_med_pincetten.mp3", id:"mille_prov_at_traekke_bakterierne_ud_med_pincetten"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_flyt_glasset_hen_til_munden.mp3", id:"mille_flyt_glasset_hen_til_munden"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_brug_det_sorte_stykke_kul_til_at_samle_alle_de_gronne_bakterier.mp3", id:"mille_brug_det_sorte_stykke_kul_til_at_samle_alle_de_gronne_bakterier"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_hey_kan_du_ikke_lige_hjaelpe_med_at_samle_den_knogle_der_er_braekket.mp3", id:"mille_hey_kan_du_ikke_lige_hjaelpe_med_at_samle_den_knogle_der_er_braekket"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_knoglen_i_armen_er_braekket_prov_om_du_kan_samle_den_igen.mp3", id:"mille_knoglen_i_armen_er_braekket_prov_om_du_kan_samle_den_igen"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_knoglerne_er_helt_rodet_rundt.mp3", id:"mille_knoglerne_er_helt_rodet_rundt"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_tag_kluden_og_vask_rent_for_snavs.mp3", id:"mille_tag_kluden_og_vask_rent_for_snavs"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_hov_der_er_vist_lidt_snavs_tilbage.mp3", id:"mille_hov_der_er_vist_lidt_snavs_tilbage"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_tag_den_nederste_brik_prov_om_du_kan.mp3", id:"mille_tag_den_nederste_brik_prov_om_du_kan"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_tryk_pa_skalen.mp3", id:"mille_tryk_pa_skalen"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_sadan_det_var_du_rigtig_god_til.mp3", id:"mille_sadan_det_var_du_rigtig_god_til"});

        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_super_flot.mp3", id:"mille_super_flot"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_wow_du_er_god.mp3", id:"mille_wow_du_er_god"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_mega_sejt.mp3", id:"mille_mega_sejt"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/hjaelp/mille_yey_det_er_flot.mp3", id:"mille_yey_det_er_flot"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/mille_arh_hvor_er_du_bare_dygtig.mp3", id:"done_1"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/mille_fantastisk_ej_hvor_er_du_bare_vildt_sej.mp3", id:"done_2"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/mille_godt_klaret.mp3", id:"done_3"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/mille_rigtig_flot.mp3", id:"done_4"});

        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/mille_skynd_dig_ud_i_ventevaerelset_der_er_helt_sikkert_flere_born.mp3", id:"mille_skynd_dig_ud_i_ventevaerelset_der_er_helt_sikkert_flere_born"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/ekstra/mille_aargh_et_skelet.mp3", id:"mille_aargh_et_skelet"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/ekstra/mille_sikke_et_muskel_bundt.mp3", id:"mille_sikke_et_muskel_bundt"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/ekstra/mille_vildt_er_det_tarmene.mp3", id:"mille_vildt_er_det_tarmene"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/ekstra/mille_wow_der_er_hjernen.mp3", id:"mille_wow_der_er_hjernen"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/scanner/mille_der_er_tis_inde_i_de_to_lange_ror.mp3", id:"mille_der_er_tis_inde_i_de_to_lange_ror"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/scanner/mille_noj_der_er_blodbaner_blodet_lober_frem.mp3", id:"mille_noj_der_er_blodbaner_blodet_lober_frem"});

        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/new/scanner/mille_den_kan_du_ikke_se_endnu_gor_flere_born_raske.mp3", id:"mille_hov_den_er_last"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/ekstra/mille_sadan_du_er_super.mp3", id:"mille_sadan_du_er_super"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/ekstra/mille_wow_godt_klaret.mp3", id:"mille_wow_godt_klaret"});

        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/barn/new/barn_eyy_fik_du_nye_forbindinger_sadan_en_vil_jeg_ogsa_gerne_have_pa.mp3", id:"barn_unlock_bandage_1"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/barn/new/barn_sikke_en_flot_forbinding.mp3", id:"barn_unlock_bandage_2"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/barn/new/barn_sikke_noget_flot_gips_ma_jeg_prove.mp3", id:"barn_unlock_bandage_3"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/barn/new/barn_hov_var_det_saftevand_du_fik_ma_jeg_smage.mp3", id:"barn_unlock_saftevand"});
        //	AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/barn/new/barn_jubii_et_flot_plaster_ma_jeg_fa_det_pa.mp3", id:"barn_unlock_band_aid_1"});
        //       AssetLoader.soundsManifest.push({ src: AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/barn/new/barn_jubii_fine_plastre_gir_du_mig_et_pa.mp3", id: "barn_unlock_band_aid_2" });

        //       //-------------------------------------------------------------------------------------



        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/klik_v09.mp3", id:"klik_v09"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/negative_v03.mp3", id:"negative_v03"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/scanner_loop_v02.mp3", id:"scanner_loop_v02"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/general_sfx/scanner_loop_v05.mp3", id:"scanner_loop_v05"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/lung_sfx/die_bacteria/lung_die_v02.mp3", id:"lung_die_v02"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/lung_sfx/die_bacteria/lung_die_v03.mp3", id:"lung_die_v03"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/lung_sfx/split_bacteria/lung_split_v04.mp3", id:"lung_split_v04"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/sfx/lung_sfx/split_bacteria/lung_split_v05.mp3", id:"lung_split_v05"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/bonus/mille_hvis_du_gor_flere_patienter_raske.mp3", id:"mille_hvis_du_gor_flere_patienter_raske"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_patienten_er_blevet_stukket_i_armen.mp3", id:"mille_patienten_er_blevet_stukket_i_armen"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_patienten_har_brakket_armen.mp3", id:"mille_patienten_har_brakket_armen"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_patienten_har_brakket_handen.mp3", id:"mille_patienten_har_brakket_handen"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_patienten_har_brandt_sig.mp3", id:"mille_patienten_har_brandt_sig"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_patienten_har_faaet_maveforgiftning.mp3", id:"mille_patienten_har_faaet_maveforgiftning"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_patienten_har_faet_lungebetaendelse.mp3", id:"mille_patienten_har_faet_lungebetaendelse"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_patienten_har_forstuvet_handen.mp3", id:"mille_patienten_har_forstuvet_handen"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/hjaelpe_speak/mille_brug_to_fingre_bistik.mp3", id:"mille_brug_to_fingre_bistik"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/hjaelpe_speak/mille_brug_to_fingre_og_treak_sa_lige_alle_bakterier_ud.mp3", id:"mille_brug_to_fingre_og_treak_sa_lige_alle_bakterier_ud"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/hjaelpe_speak/mille_brug_to_fingre_spinter.mp3", id:"mille_brug_to_fingre_spinter"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/hjaelpe_speak/mille_du_skal_bruge_det_sorte_stykke_kul.mp3", id:"mille_du_skal_bruge_det_sorte_stykke_kul"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/hjaelpe_speak/mille_du_skal_fjerne_alle_brikkerne_pa_armen.mp3", id:"mille_du_skal_fjerne_alle_brikkerne_pa_armen"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/hjaelpe_speak/mille_hey_kan_du_i_lige_hjaelpe.mp3", id:"mille_hey_kan_du_i_lige_hjaelpe"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/hjaelpe_speak/mille_knoglerne_i_handen_er_helt_rodet_rundt.mp3", id:"mille_knoglerne_i_handen_er_helt_rodet_rundt"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/hjaelpe_speak/mille_tag_kluden_og_vask_saret_rent.mp3", id:"mille_tag_kluden_og_vask_saret_rent"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/hjaelpe_speak/mille_tjek_lige_en_vild_maskine.mp3", id:"mille_tjek_lige_en_vild_maskine"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/hjaelpe_speak/mille_traek_glasset_hen_til_patientens_mund.mp3", id:"mille_traek_glasset_hen_til_patientens_mund"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/hjaelpe_speak/mille_trake_gazebindet_hen_til_patientens_arm.mp3", id:"mille_trake_gazebindet_hen_til_patientens_arm"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/hjaelpe_speak/mille_trake_gipsen_hen_til_patientens_arm.mp3", id:"mille_trake_gipsen_hen_til_patientens_arm"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/hjaelpe_speak/mille_tryk_pa_kanpperne_kroppen.mp3", id:"mille_tryk_pa_kanpperne_kroppen"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/hjaelpe_speak/mille_tryk_pa_kanpperne_tarmene_eller_hjernen.mp3", id:"mille_tryk_pa_kanpperne_tarmene_eller_hjernen"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/behandlingsrum/mille/hjaelpe_speak/mille_uhh_det_sar_det_klor.mp3", id:"mille_uhh_det_sar_det_klor"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/barn/nyt_toej/barn_mere_mere_mere.mp3", id:"barn_mere_mere_mere"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/barn/nyt_toej/barn_wow_fedt_nyt_toj.mp3", id:"barn_wow_fedt_nyt_toj"});
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/speak/ventevaelse/barn/nyt_toej/barn_wuhuu_tak_for_det.mp3", id:"barn_wuhuu_tak_for_det"});
        //       //
        //	// AssetLoader.soundsManifest.push({src:AssetLoader.MEDIA_PATH + "audio/ui/ui_klik.mp3", id:"ui_klik"});


        //	this._assetLoadQueue.loadManifest(AssetLoader.soundsManifest, true);

        //	// let soundLink:string = "http://img.speakaboos.com/www-gui/product/sounds/";
        //	// AssetLoader.soundsManifest.push({
        //	// 	src: soundLink + "story-skew.mp3",
        //	// 	id: AudioPlayer.SOUND_POPUP_ANIMATION_AUDIO
        //	// });
        //	// PreloadImages.serviceItemsManifest.push({
        //	// 	src: soundLink + "vo-button-nextPage.mp3",
        //	// 	id: AudioPlayer.SOUND_VO_NEXT_PAGE
        //	// });

        //}

        //private loadSoundError = (event:createjs.Event):void => {
        //	try{
        //		Logger.log(this, "AssetLoader loadSoundError event == "+event);
        //	} catch (error) {
        //		Logger.log(this, "AssetLoader loadSoundError");
        //	}
        //}

        //private onSoundLoadComplete = (e:createjs.Event):void => {
        //	Logger.log(this, "AssetLoader onSoundLoadComplete");

        //	Logger.log(this, "AssetLoader onSoundLoadComplete   this._onCompleteCallback ===== "+this._onCompleteCallback);
        //	this._assetLoadQueue.off(AssetLoader.QUEUE_COMPLETE, (e: createjs.Event) => { this.onSoundLoadComplete(e) });
        //	// this._assetLoadQueue.off(AssetLoader.QUEUE_FILE_LOAD, (e: createjs.Event) => { this.handleFileLoad(e) });
        //	this._assetLoadQueue.off(AssetLoader.QUEUE_PROGRESS, (e: createjs.Event) => { this.handleSoundProgress(e) });
        //	this._assetLoadQueue.off(AssetLoader.QUEUE_ERROR, (e: createjs.Event) => { this.loadSoundError(e) });

        //	if(this._onCompleteCallback != null) {
        //		this._onCompleteCallback();
        //		this._onCompleteCallback = null;
        //	}
        //}

        //private handleSoundProgress = (event:createjs.Event):void => {
        //	if(this._assetLoadQueue.progress < 1) {
        //		var val:number = this._assetLoadQueue.progress;
        //		// this.loaderProgressGx.scaleX = Number(val * 1);
        //		// Logger.log(this, "handleSoundProgress loading: val ======= " + val);
        //		this.progressBar.ratio = val;
        //	}
        //}

        //// private handleFileLoad = (event:createjs.Event):void => {
        //// 	var item:any = event.item; // A reference to the item that was passed in to the LoadQueue
        //// 	var type:string = item.type;
        //// 	var id:string = item.id;
        //// 	var src:string = item.src;
        //// 	var image:Object;
        //// 	image = images;
        //// 	if (type == createjs.LoadQueue.IMAGE) {
        //// 		if (image) {
        //// 			image[id] = event.result;
        //// 			this._imageAssetsResult[id] = event.result;
        //// 		}
        //// 	}
        //// }


        //private loadAssetsProgressHandler = (loader, resource) :void => {
        //	//Display the file `url` currently being loaded  console.log("loading: " + resource.url);
        //	// Display the precentage of files currently loaded  console.log("progress: " + loader.progress + "%");


        //	// If you gave your files names with the `add` method, you can access
        //	// them like this
        //	Logger.log(this, "loadProgressHandler loading: " + resource.name+" : loader.progress == "+loader.progress);

        //	// Logger.log(this, "* load: " + resource.url);
        //	// Logger.log(this, "* load: " + resource.json);
        //	// Logger.log(this, "* load: " + loader.progress);
        //	//let key = resource.url;
        //	//let json = resource.json;
        //	//
        //	//this.loadedData[key] = json;

        //	// function setup() {  console.log("All files loaded");}
        //}

        //public removeTexture(name:string, dispose:boolean):void {
        //	// AssetLoader.assets.removeTexture(name, dispose);
        //	Logger.log(this, "removeTexture TODO  name == "+name);
        //}

        //public removeTextureAtlas(name:string, dispose:boolean):void {
        //	// let ass:AssetManager = AssetLoader.assets;
        //	// AssetLoader.assets.removeTextureAtlas(name, dispose);
        //	Logger.log(this, "removeTextureAtlas TODO  name == "+name);
        //}

        //destroy() :void {
        //	//TODO add cleanup
        //	Logger.log(this, "destroy  this.destroying == "+this.destroying);


        //	this.assetCanvas.off(TouchEvent.TOUCH, this.onTouch);
        //	this.assetCanvas.off(TouchEvent.TOUCH_END, this.onTouch);
        //	// this.assetCanvas.off(TouchEvent.TOUCH_OUT, this.onTouch);
        //	this.assetCanvas.off(TouchEvent.TOUCH_MOVE, this.onTouch);

        //	this._assetLoader.off("progress", this.loadAssetsProgressHandler);
        //	this._assetLoader.off('complete', this.onAssetsLoaded);

        //	this._assetLoadQueue.off(AssetLoader.QUEUE_COMPLETE, (e: createjs.Event) => { this.onSoundLoadComplete(e) });
        //	// this._assetLoadQueue.off(AssetLoader.QUEUE_FILE_LOAD, (e: createjs.Event) => { this.handleFileLoad(e) });
        //	this._assetLoadQueue.off(AssetLoader.QUEUE_PROGRESS, (e: createjs.Event) => { this.handleSoundProgress(e) });
        //	this._assetLoadQueue.off(AssetLoader.QUEUE_ERROR, (e: createjs.Event) => { this.loadSoundError(e) });

        //	if(this.progressBar != null) {
        //		this.stage.removeChild(this.progressBar);
        //		this.progressBar.destroy();
        //		this.progressBar = null;
        //	}

        //	if(this.assetCanvas != null) {
        //		this.stage.removeChild(this.assetCanvas);
        //		this.assetCanvas = null;
        //	}

        //	setTimeout(this.destroyTimeout, .1);

        //}

        //private destroyTimeout = ():void => {
        //	this.destroying = true;
        //}

        ///////////////////////////////////////////////////////////////////////////////////////
    }


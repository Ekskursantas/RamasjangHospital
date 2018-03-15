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
var Logger_1 = require("../../../../loudmotion/utils/debug/Logger");
var ScannerButton_1 = require("./ScannerButton");
var Level_1 = require("../../../vo/Level");
var Config_1 = require("../../../Config");
var TouchLoudEvent_1 = require("../../../../loudmotion/events/TouchLoudEvent");
var AssetLoader_1 = require("../../../utils/AssetLoader");
var pixi_js_1 = require("pixi.js");
var AudioPlayer_1 = require("../../../../loudmotion/utils/AudioPlayer");
var HospitalGameView_1 = require("../../HospitalGameView");
var Scanner = /** @class */ (function (_super) {
    __extends(Scanner, _super);
    function Scanner() {
        var _this = _super.call(this) || this;
        _this.inactiveTouchListener = function (event) {
            Logger_1.Logger.log(_this, "Scanner inactiveTouchListener");
            // this.touch = event.getTouch(this);
            // if(!this.touch) return;
            // if(this.touch.phase == TouchPhase.BEGAN){
            _this.clickedOnce = true;
            _this.inactiveImage.off(TouchLoudEvent_1.TouchEvent.TOUCH, _this.inactiveTouchListener);
            _this.rectCover.off(TouchLoudEvent_1.TouchEvent.TOUCH, _this.inactiveTouchListener);
            _this.inactiveImage.visible = false;
            _this.rectCover.visible = false;
            _this.stopHighlightInactive();
            _this.background.visible = true;
            _this.btnSkeletal.visible = true;
            _this.btnMuscular.visible = true;
            _this.btnDigestive.visible = true;
            _this.btnRespiratoryAndUrinary.visible = true;
            _this.btnCardioVascular.visible = true;
            _this.btnNervous.visible = true;
            // this.on(TouchEvent.TOUCH, this.touchListener);
            _this.on(TouchLoudEvent_1.TouchEvent.TOUCH, _this.touchDown);
            _this.on(TouchLoudEvent_1.TouchEvent.TOUCH_END, _this.touchDone);
            _this.on(TouchLoudEvent_1.TouchEvent.TOUCH_OUT, _this.touchDone);
            _this.on(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, _this.touchMove);
            _this._layerToMask.visible = true;
            _this.addMaskRect();
            // }
        };
        _this.touchDown = function (event) {
            Logger_1.Logger.log(_this, "Scanner touchDown  this.x == " + _this.x + " : this.y == " + _this.y);
            _this.mouseDown = true;
            _this.parent.setChildIndex(_this, _this.parent.children.length - 1);
            // (this.parent as ItemsSelector).setState(ItemsSelector.CLOSED); //TODO add signal to close selector
            _this.visible = true;
            var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
            Logger_1.Logger.log(_this, "Scanner touchDown  mousePositionCanvas.x == " + mousePositionCanvas.x + " : mousePositionCanvas.y == " + mousePositionCanvas.y);
            _this.offsetPoint = new pixi_js_1.Point((mousePositionCanvas.x - _this.x), (mousePositionCanvas.y - _this.y));
            _this.x = mousePositionCanvas.x - _this.offsetPoint.x;
            _this.y = mousePositionCanvas.y - _this.offsetPoint.y;
            _this.addMaskRect();
            // this.layerToMask.clipRect = this.maskRect; //TODO PIXI clipRect? ORIG
            _this.layerToMask.mask = _this.maskRect; //TODO PIXI clipRect?
            // sndMan.playSound("scanner_loop", 1, 999); //TODO sound
            _this.scannerSound = AudioPlayer_1.AudioPlayer.getInstance().playSound("scanner_loop", 999, Config_1.Config.EFFECTS_VOLUME_LEVEL);
        };
        _this.touchMove = function (event) {
            if (_this.mouseDown) {
                var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
                _this.x = mousePositionCanvas.x - _this.offsetPoint.x;
                _this.y = mousePositionCanvas.y - _this.offsetPoint.y;
                _this.addMaskRect();
                // this.layerToMask.clipRect = this.maskRect; //TODO PIXI clipRect? ORIG
                _this.layerToMask.mask = _this.maskRect; //TODO PIXI clipRect?
            }
        };
        _this.touchDone = function (event) {
            Logger_1.Logger.log(_this, "Scanner touchDone  event.type == " + event.type);
            _this.mouseDown = false;
            // sndMan.stopSound("scanner_loop"); //TODO sound
            if (_this.scannerSound != null) {
                _this.scannerSound.stop();
            }
            // this.layerToMask.clipRect = this.maskRect; //TODO PIXI clipRect? ORIG
            _this.layerToMask.mask = _this.maskRect; //TODO PIXI clipRect?
            // let hit:boolean = SpriteHelper.hitTest(this.background.getBounds(), this._hotspot.getBounds()); //TODO do we need this? not working in original
            // if(hit){
            // // if(this.bounds.intersects(this._hotspot.bounds)){ //TODO orig
            //
            // 	this._hotspot.enable();
            // 	// Logger.log(this, "Scanner over hotspot enable this._hotspot.touchable == "+this._hotspot.touchable);
            // }else{
            //
            // 	this._hotspot.disable();
            // 	// Logger.log(this, "---- Scanner outside hotspot disable this._hotspot.touchable == "+this._hotspot.touchable);
            // }
        };
        // private btnPressedListener = (event:ButtonEvent):void => {
        _this.btnPressedListener = function (data) {
            var btnPressed = data;
            // let btnPressed:Button = event.button as Button; //TODO
            Logger_1.Logger.log(_this, "Scanner btnPressedListener      btnPressed ==== " + btnPressed);
            Logger_1.Logger.log(_this, "Scanner btnPressedListener      btnPressed.name ==== " + btnPressed.name);
            // if disabled
            if (btnPressed.alpha < 1) {
                // 			if(!sndMan.soundIsPlaying(Config.currentSpeakSound)){ //TODO sound
                // //					sndMan.tweenVolume("operation_room_music_loop", 0.3, 0.5);
                // 				Config.currentSpeakSound = "mille_hov_den_er_last";
                // 				sndMan.playSound(Config.currentSpeakSound, Config.SPEAK_VOLUME_LEVEL);
                // 			}
                if (Config_1.Config.currentSpeakSound != "mille_hov_den_er_last") {
                    if (Config_1.Config.currentSpeakSound != null) {
                        AudioPlayer_1.AudioPlayer.getInstance().stopSound(Config_1.Config.currentSpeakSound);
                    }
                    Config_1.Config.currentSpeakSound = "mille_hov_den_er_last";
                    _this.sndSpeak = AudioPlayer_1.AudioPlayer.getInstance().playSound(Config_1.Config.currentSpeakSound, 0, Config_1.Config.SPEAK_VOLUME_LEVEL);
                }
                return;
            }
            _this.playNoiseClip();
            switch (btnPressed.name) {
                case "btnSkeletal":
                    _this.state = Scanner.SKELETAL;
                    setTimeout(function () {
                        if (Config_1.Config.currentSpeakSound != null) {
                            AudioPlayer_1.AudioPlayer.getInstance().stopSound(Config_1.Config.currentSpeakSound);
                        }
                        Config_1.Config.currentSpeakSound = "mille_aargh_et_skelet";
                        _this.sndSpeak = AudioPlayer_1.AudioPlayer.getInstance().playSound(Config_1.Config.currentSpeakSound, 0, Config_1.Config.SPEAK_VOLUME_LEVEL);
                    }, 1000);
                    break;
                case "btnMuscular":
                    _this.state = Scanner.MUSCULAR;
                    setTimeout(function () {
                        if (Config_1.Config.currentSpeakSound != null) {
                            AudioPlayer_1.AudioPlayer.getInstance().stopSound(Config_1.Config.currentSpeakSound);
                        }
                        Config_1.Config.currentSpeakSound = "mille_sikke_et_muskel_bundt";
                        _this.sndSpeak = AudioPlayer_1.AudioPlayer.getInstance().playSound(Config_1.Config.currentSpeakSound, 0, Config_1.Config.SPEAK_VOLUME_LEVEL);
                    }, 1000);
                    break;
                case "btnCardioVascular":
                    _this.state = Scanner.CARDIOVASCULAR;
                    setTimeout(function () {
                        if (Config_1.Config.currentSpeakSound != null) {
                            AudioPlayer_1.AudioPlayer.getInstance().stopSound(Config_1.Config.currentSpeakSound);
                        }
                        Config_1.Config.currentSpeakSound = "mille_noj_der_er_blodbaner_blodet_lober_frem";
                        _this.sndSpeak = AudioPlayer_1.AudioPlayer.getInstance().playSound(Config_1.Config.currentSpeakSound, 0, Config_1.Config.SPEAK_VOLUME_LEVEL);
                    }, 1000);
                    break;
                case "btnDigestive":
                    _this.state = Scanner.DIGESTIVE;
                    setTimeout(function () {
                        if (Config_1.Config.currentSpeakSound != null) {
                            AudioPlayer_1.AudioPlayer.getInstance().stopSound(Config_1.Config.currentSpeakSound);
                        }
                        Config_1.Config.currentSpeakSound = "mille_vildt_er_det_tarmene";
                        _this.sndSpeak = AudioPlayer_1.AudioPlayer.getInstance().playSound(Config_1.Config.currentSpeakSound, 0, Config_1.Config.SPEAK_VOLUME_LEVEL);
                    }, 1000);
                    break;
                case "btnRespiratoryAndUrinary":
                    _this.state = Scanner.RESPIRATORY_AND_UNINARY;
                    setTimeout(function () {
                        if (Config_1.Config.currentSpeakSound != null) {
                            AudioPlayer_1.AudioPlayer.getInstance().stopSound(Config_1.Config.currentSpeakSound);
                        }
                        Config_1.Config.currentSpeakSound = "mille_der_er_tis_inde_i_de_to_lange_ror";
                        _this.sndSpeak = AudioPlayer_1.AudioPlayer.getInstance().playSound(Config_1.Config.currentSpeakSound, 0, Config_1.Config.SPEAK_VOLUME_LEVEL);
                    }, 1000);
                    break;
                case "btnNervous":
                    _this.state = Scanner.NERVOUS;
                    setTimeout(function () {
                        if (Config_1.Config.currentSpeakSound != null) {
                            AudioPlayer_1.AudioPlayer.getInstance().stopSound(Config_1.Config.currentSpeakSound);
                        }
                        Config_1.Config.currentSpeakSound = "mille_wow_der_er_hjernen";
                        _this.sndSpeak = AudioPlayer_1.AudioPlayer.getInstance().playSound(Config_1.Config.currentSpeakSound, 0, Config_1.Config.SPEAK_VOLUME_LEVEL);
                    }, 1000);
                    break;
                default:
                    break;
            }
            _this.emit("change"); //TODO check this in starling
        };
        _this.audioNoiseComplete = function (event) {
            _this.noiseScreen.visible = false;
            _this.noiseClip.off(AudioPlayer_1.AudioPlayer.AUDIO_COMPLETE, _this.audioNoiseComplete);
        };
        // sndMan = SoundManager.getInstance(); //TODO sound
        _this.onAddedToStage();
        return _this;
    }
    Scanner.prototype.onAddedToStage = function () {
        Logger_1.Logger.log(this, "Scanner onAddedToStage");
        this.interactive = true;
        this.buttonMode = true;
        this.createScannerArt();
        this.inactiveImage.on(TouchLoudEvent_1.TouchEvent.TOUCH, this.inactiveTouchListener);
        this.rectCover.on(TouchLoudEvent_1.TouchEvent.TOUCH, this.inactiveTouchListener);
    };
    Object.defineProperty(Scanner.prototype, "hotspot", {
        set: function (value) {
            Logger_1.Logger.log(this, "Scanner set hotspot   value == " + value);
            this._hotspot = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scanner.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (value) {
            this._state = value;
        },
        enumerable: true,
        configurable: true
    });
    Scanner.prototype.createPatientLayerToDiseaseMap = function () {
        this.patientLayerToDiseaseMap = {}; //new Dictionary();
        this.patientLayerToDiseaseMap[Level_1.Level.FRACTURE_HAND] = Scanner.SKELETAL;
        this.patientLayerToDiseaseMap[Level_1.Level.FRACTURE_RADIUS] = Scanner.SKELETAL;
        this.patientLayerToDiseaseMap[Level_1.Level.SPRAIN] = Scanner.MUSCULAR;
        this.patientLayerToDiseaseMap[Level_1.Level.PNEUMONIA] = Scanner.RESPIRATORY_AND_UNINARY;
        this.patientLayerToDiseaseMap[Level_1.Level.POISONING] = Scanner.DIGESTIVE;
    };
    Scanner.prototype.update = function () {
        Logger_1.Logger.log(this, "Scanner update");
        Logger_1.Logger.log(this, "Scanner update this.btnSkeletal == " + this.btnSkeletal);
        Logger_1.Logger.log(this, "Scanner update this.btnMuscular == " + this.btnMuscular);
        Logger_1.Logger.log(this, "Scanner update this.btnCardioVascular == " + this.btnCardioVascular);
        Logger_1.Logger.log(this, "Scanner update this.btnDigestive == " + this.btnDigestive);
        Logger_1.Logger.log(this, "Scanner update this.btnRespiratoryAndUrinary == " + this.btnRespiratoryAndUrinary);
        Logger_1.Logger.log(this, "Scanner update this.btnNervous == " + this.btnNervous);
        Logger_1.Logger.log(this, "Scanner update Config.patientsCured == " + Config_1.Config.patientsCured);
        if (this.btnSkeletal != null) {
            this.disableButton(this.btnSkeletal);
        }
        if (this.btnMuscular != null) {
            this.disableButton(this.btnMuscular);
        }
        if (this.btnCardioVascular != null) {
            this.disableButton(this.btnCardioVascular);
        }
        if (this.btnDigestive != null) {
            this.disableButton(this.btnDigestive);
        }
        if (this.btnRespiratoryAndUrinary != null) {
            this.disableButton(this.btnRespiratoryAndUrinary);
        }
        if (this.btnNervous != null) {
            this.disableButton(this.btnNervous);
        }
        for (var i = 0; i <= Config_1.Config.patientsCured; i++) {
            if (i >= Config_1.Config.levels.length) {
                continue;
            }
            if (Config_1.Config.levels[i].unlockedTools[0]) {
                this.enableMode(Config_1.Config.levels[i].unlockedTools[0]);
            }
        }
    };
    Scanner.prototype.enableMode = function (mode) {
        switch (mode) {
            case Scanner.SKELETAL:
                this.enableButton(this.btnSkeletal);
                break;
            case Scanner.MUSCULAR:
                this.enableButton(this.btnMuscular);
                break;
            case Scanner.DIGESTIVE:
                this.enableButton(this.btnDigestive);
                break;
            case Scanner.RESPIRATORY_AND_UNINARY:
                this.enableButton(this.btnRespiratoryAndUrinary);
                break;
            case Scanner.CARDIOVASCULAR:
                this.enableButton(this.btnCardioVascular);
                break;
            case Scanner.NERVOUS:
                this.enableButton(this.btnNervous);
                break;
            default:
                break;
        }
    };
    Scanner.prototype.highlightButton = function (mode, unlockedMode) {
        if (mode === void 0) { mode = ""; }
        if (unlockedMode === void 0) { unlockedMode = false; }
        Logger_1.Logger.log(this, "Scanner highlightButton mode == " + mode + " : unlockedMode == " + unlockedMode);
        switch (mode) {
            case Scanner.SKELETAL:
                this.btnSkeletal.highlight();
                //					btnSkeletalBig.visible = unlockedMode; //TODO not used in orig
                break;
            case Scanner.MUSCULAR:
                this.btnMuscular.highlight();
                //					btnMuscularBig.visible = unlockedMode; //TODO not used in orig
                break;
            case Scanner.DIGESTIVE:
                this.btnDigestive.highlight();
                //					btnDigestiveBig.visible = unlockedMode; //TODO not used in orig
                break;
            case Scanner.RESPIRATORY_AND_UNINARY:
                this.btnRespiratoryAndUrinary.highlight();
                //					btnRespiratoryAndUrinaryBig.visible = unlockedMode; //TODO not used in orig
                break;
            case Scanner.CARDIOVASCULAR:
                this.btnCardioVascular.highlight();
                //					btnCardioVascularBig.visible = unlockedMode; //TODO not used in orig
                break;
            case Scanner.NERVOUS:
                this.btnNervous.highlight();
                //					btnNervousBig.visible = unlockedMode; //TODO not used in orig
                break;
            default:
                break;
        }
    };
    Scanner.prototype.setUnlockedMode = function () {
        this.inactiveImage.visible = false; //TODO add back?
        this.stopHighlightInactive();
        this.background.visible = true;
        this.btnSkeletal.visible = true;
        this.btnMuscular.visible = true;
        this.btnDigestive.visible = true;
        this.btnRespiratoryAndUrinary.visible = true;
        this.btnCardioVascular.visible = true;
        this.btnNervous.visible = true;
        // this.update();
        //
        // this.btnSkeletal.touchable = false;
        // this.btnMuscular.touchable = false;
        // this.btnDigestive.touchable = false;
        // this.btnRespiratoryAndUrinary.touchable = false;
        // this.btnCardioVascular.touchable = false;
        // this.btnNervous.touchable = false;
        this._layerToMask.visible = true;
    };
    Scanner.prototype.disableButton = function (btn) {
        btn.alpha = 0.3;
    };
    Scanner.prototype.enableButton = function (btn) {
        btn.alpha = 1;
        btn.touchable = true;
    };
    Object.defineProperty(Scanner.prototype, "layerToMask", {
        // public get layerToMask():ClippedSprite { //TODO?
        get: function () {
            return this._layerToMask;
        },
        set: function (value) {
            this._layerToMask = value;
            // this.maskRect = new Graphics();
            // this.maskRect.beginFill(0xFF0000);
            // // this.maskRect.drawRect(this.x + 60, this.y + 30, 387, 266); //TODO ORIG
            // this.maskRect.drawRect(this.background.x + 60, this.background.y + 30, 387, 266);
            // this.maskRect.endFill();
            // this.addChild(this.maskRect);
            // the magic line!
            this._layerToMask.mask = this.maskRect;
            // this._layerToMask.clipRect = this.maskRect; //TODO ORIG PIXI clipRect?
            this._layerToMask.visible = false; //TODO add back?
        },
        enumerable: true,
        configurable: true
    });
    Scanner.prototype.highlightInactive = function () {
        this.inactiveOutline.visible = true;
        TweenMax.to(this.inactiveOutline, 0.5, { alpha: "-1", repeat: -1, yoyo: true, ease: Linear.easeNone });
    };
    Scanner.prototype.stopHighlightInactive = function () {
        this.inactiveOutline.visible = false; //TODO add back?
        TweenMax.killTweensOf(this.inactiveOutline);
    };
    Scanner.prototype.addMaskRect = function () {
        this.maskRect = new pixi_js_1.Graphics();
        this.maskRect.beginFill(0xFF4444);
        // this.maskRect.alpha = 0.2;
        this.maskRect.drawRect(this.x + 60, this.y + 8, 387, 266);
    };
    // 	private touchListener = (event:TouchEvent):void => {
    //
    // 		// this.touch = event.getTouch(this); //TODO
    // 		// if(!this.touch) return;
    //         //
    // 		// if(this.touch.phase == TouchPhase.BEGAN){
    //         //
    // 		// 	this.touchOffset = this.touch.getLocation(this);
    //         //
    // 		// 	this.x = this.touch.globalX - this.touchOffset.x;
    // 		// 	this.y = this.touch.globalY - this.touchOffset.y;
    // 		// 	this.maskRect = new Rectangle(this.x + 60, this.y + 8, 387, 266);
    //         //
    // 		// 	// sndMan.playSound("scanner_loop", 1, 999); //TODO sound
    // 		// }
    //         //
    // 		// if(this.touch.phase == TouchPhase.MOVED){
    //         //
    // 		// 	//TODO
    // 		// 	// if(this.touch.globalX - this.touchOffset.x > StarlingHelper.leftXOffsetVirtual - this.width/2 && this.touch.globalX - this.touchOffset.x < StarlingHelper.rightXOffsetVirtual - this.width/2){
    // 		// 	// 	this.x = this.touch.globalX - this.touchOffset.x;
    // 		// 	// }
    //         //
    // 		// 	//TODO
    // 		// 	// if(this.touch.globalY - this.touchOffset.y >  -this.height/2 + 100 && this.touch.globalY - this.touchOffset.y < AssetLoader.STAGE_HEIGHT - this.height/2 + 100){
    // 		// 	// 	this.y = this.touch.globalY - this.touchOffset.y;
    // 		// 	// }
    // 		// 	this.maskRect = new Rectangle(this.x + 60, this.y + 8, 387, 266);
    // 		// }
    //         //
    // 		// if(this.touch.phase == TouchPhase.ENDED){
    // 		// 	// sndMan.stopSound("scanner_loop"); //TODO sound
    // 		// }
    //
    // 		// this.layerToMask.clipRect = this.maskRect; //TODO PIXI clipRect?
    //
    // // 		if(this.bounds.intersects(this._hotspot.bounds)){ //TODO
    // // //			Logger.log(this, "Scanner over hotspot");
    // // 			this._hotspot.enable();
    // // 		}else{
    // // //			Logger.log(this, "---- Scanner outside hotspot");
    // // 			this._hotspot.disable();
    // // 		}
    // 	}
    Scanner.prototype.createScannerArt = function () {
        Logger_1.Logger.log(this, "Scanner createScannerArt");
        this.inactiveImage = pixi_js_1.Sprite.fromFrame("operationRoom_scannerInactive");
        this.addChild(this.inactiveImage);
        this.inactiveImage.scale.x = this.inactiveImage.scale.y = 2;
        this.inactiveImage.interactive = true;
        this.inactiveImage.buttonMode = true;
        this.inactiveOutline = pixi_js_1.Sprite.fromFrame("operationRoom_scannerInactive_outline");
        this.addChild(this.inactiveOutline);
        this.inactiveOutline.scale.x = this.inactiveOutline.scale.y = 2;
        // this.inactiveOutline.touchable = false; //TODO
        this.inactiveOutline.interactive = false;
        this.inactiveOutline.visible = false; //TODO was in
        this.rectCover = new pixi_js_1.Graphics(); //TODO temp to check area
        this.rectCover.beginFill(0xFFFFFF);
        this.rectCover.alpha = HospitalGameView_1.HospitalGameView.RECT_COVER_ALPHA;
        this.addChild(this.rectCover);
        this.rectCover.interactive = true;
        this.rectCover.buttonMode = true;
        this.rectCover.drawRect(this.inactiveImage.x, this.inactiveImage.y, this.inactiveImage.width, this.inactiveImage.height);
        this.inactiveOutline.x = 8;
        var frames = [];
        for (var i = 1; i < 3; i++) {
            var val = i < 10 ? '0' + i : i;
            // magically works since the spritesheet was loaded with the pixi loader
            frames.push(pixi_js_1.Texture.fromFrame('operationRoom_scannerFlicker_ani_00' + val));
        }
        // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
        this.noiseScreen = new pixi_js_1.extras.AnimatedSprite(frames);
        this.addChild(this.noiseScreen);
        this.noiseScreen.x = 81;
        this.noiseScreen.y = 10;
        this.noiseScreen.visible = false;
        this.noiseScreen.scale.x = this.noiseScreen.scale.y = 2;
        // noiseScreen = new MovieClip(Config.assetManager.getTextures("operationRoom_scannerFlicker_ani_"), 10); //TODO orig code
        // Starling.juggler.add(noiseScreen);
        // this.addChild(noiseScreen);
        // noiseScreen.x = 81;
        // noiseScreen.y = 10;
        // noiseScreen.visible = false;
        // noiseScreen.scaleX = noiseScreen.scaleY = 2;
        this.background = pixi_js_1.Sprite.fromFrame("operationRoom_scannerActive");
        this.addChild(this.background);
        this.background.visible = false; //TODO was in
        this.btnSkeletal = this.createAndAddButton("btnSkeletal", "operationRoom_scannerButton_skeletal", 0, 0);
        this.btnMuscular = this.createAndAddButton("btnMuscular", "operationRoom_scannerButton_muscular", 0, 130);
        this.btnDigestive = this.createAndAddButton("btnDigestive", "operationRoom_scannerButton_digestive", 0, 230);
        this.btnRespiratoryAndUrinary = this.createAndAddButton("btnRespiratoryAndUrinary", "operationRoom_scannerButton_respiratoryUrinary", this.background.width - this.btnSkeletal.width + 3, 30);
        this.btnCardioVascular = this.createAndAddButton("btnCardioVascular", "operationRoom_scannerButton_cardiovascular", this.background.width - this.btnSkeletal.width + 3, 130);
        this.btnNervous = this.createAndAddButton("btnNervous", "operationRoom_scannerButton_nervous", this.background.width - this.btnSkeletal.width + 3, 230);
    };
    Scanner.prototype.createAndAddButton = function (name, texture, positionX, positionY) {
        Logger_1.Logger.log(this, "Scanner createAndAddButton     name ==== " + name);
        var btn = new ScannerButton_1.ScannerButton();
        btn.name = name;
        btn.addTexture(pixi_js_1.Texture.fromFrame(texture));
        this.addChild(btn);
        btn.signalScannerButton.add(this.btnPressedListener);
        // btn.x = positionX; //TODO ORIG
        // btn.y = positionY;
        btn.x += btn.getTextureBounds().width * .5;
        btn.y += btn.getTextureBounds().height;
        // btn.on(ButtonEvent.CLICKED, this.btnPressedListener);
        btn.visible = false; //TODO was in
        return btn;
    };
    Scanner.prototype.playNoiseClip = function () {
        this.noiseScreen.visible = true;
        this.noiseClip = AudioPlayer_1.AudioPlayer.getInstance().playSound("scanner_noise", 0, Config_1.Config.EFFECTS_VOLUME_LEVEL);
        this.noiseClip.on(AudioPlayer_1.AudioPlayer.AUDIO_COMPLETE, this.audioNoiseComplete);
    };
    Scanner.prototype.destroy = function () {
        Logger_1.Logger.log(this, "Scanner destroy");
        if (this.inactiveImage != null) {
            this.inactiveImage.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.inactiveTouchListener);
            this.inactiveImage = null;
        }
        if (this.rectCover != null) {
            this.rectCover.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.inactiveTouchListener);
            this.rectCover = null;
        }
        if (this.noiseScreen != null) {
            this.removeChild(this.noiseScreen);
            this.noiseScreen = null;
        }
        this.removeChildren(0, this.children.length - 1);
        // this.removeChild(this.noiseScreen); //TODO does above work
        // this.removeChild(this.maskRect);
        // this.removeChild(this.inactiveImage);
        // this.removeChild(this.inactiveOutline);
        // this.removeChild(this.background);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.touchDown);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.touchDone);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH_OUT, this.touchDone);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.touchMove);
    };
    Scanner.SKELETAL = "appdrhospital.view.operatingroom.objects.scanner.skeletal";
    Scanner.MUSCULAR = "appdrhospital.view.operatingroom.objects.scanner.muscular";
    Scanner.CARDIOVASCULAR = "appdrhospital.view.operatingroom.objects.scanner.cardiovascular";
    Scanner.DIGESTIVE = "appdrhospital.view.operatingroom.objects.scanner.digestive";
    Scanner.RESPIRATORY_AND_UNINARY = "appdrhospital.view.operatingroom.objects.scanner.respiratoryandurinary";
    Scanner.NERVOUS = "appdrhospital.view.operatingroom.objects.scanner.nervous";
    return Scanner;
}(pixi_js_1.Sprite));
exports.Scanner = Scanner;
//# sourceMappingURL=Scanner.js.map
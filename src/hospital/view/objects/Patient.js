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
var Level_1 = require("../../vo/Level");
var TouchLoudEvent_1 = require("../../../loudmotion/events/TouchLoudEvent");
var Logger_1 = require("../../../loudmotion/utils/debug/Logger");
var HospitalEvent_1 = require("../../event/HospitalEvent");
var PairOfEyes_1 = require("./PairOfEyes");
var ClothesItem_1 = require("../waitingroom/objects/ClothesItem");
var pixi_js_1 = require("pixi.js");
var AssetLoader_1 = require("../../utils/AssetLoader");
var SpriteHelper_1 = require("../../../loudmotion/utils/SpriteHelper");
var AudioPlayer_1 = require("../../../loudmotion/utils/AudioPlayer");
var Config_1 = require("../../Config");
var Patient = /** @class */ (function (_super) {
    __extends(Patient, _super);
    function Patient(type, startingPoint) {
        var _this = _super.call(this) || this;
        _this.blink = function () {
            if (_this.currentFacialExpression == Patient.EXPRESSION_NEUTRAL) {
                _this.setFace(Patient.FACE_NEUTRAL_BLINK);
                setTimeout(_this.setFaceNoBlink, 200);
            }
            else if (_this.currentFacialExpression == Patient.EXPRESSION_LITTLE_SMILE) {
                _this.setFace(Patient.FACE_LITTLE_SMILE_BLINK);
                setTimeout(_this.setFaceNoBlink, 200);
            }
            else if (_this.currentFacialExpression == Patient.EXPRESSION_BIG_SMILE) {
                _this.setFace(Patient.FACE_BIG_SMILE_BLINK);
                setTimeout(_this.setFaceNoBlink, 200);
            }
        };
        _this.setFaceNoBlink = function () {
            switch (_this.currentFacialExpression) {
                case Patient.EXPRESSION_NEUTRAL:
                    _this.setFace(Patient.FACE_NEUTRAL);
                    break;
                case Patient.EXPRESSION_LITTLE_SMILE:
                    _this.setFace(Patient.FACE_LITTLE_SMILE);
                    break;
                case Patient.EXPRESSION_BIG_SMILE:
                    _this.setFace(Patient.FACE_BIG_SMILE);
                    break;
                default:
                    break;
            }
        };
        _this.touchDown = function (event) {
            _this.mouseDown = true;
            _this._target.showOpened();
            _this.playExpressionSpeak();
            var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
            _this.touchOffset = mousePositionCanvas;
            _this.touchOffset.x = _this.touchOffset.x * _this.scale.x;
            _this.touchOffset.y = _this.touchOffset.y * _this.scale.y;
            console.log(_this.touchOffset);
            console.log(_this.touchOffset.x);
            console.log(_this.touchOffset.y);
            _this.parent.setChildIndex(_this, _this.parent.children.length - 1);
            _this.x = _this.startingPoint.x;
            _this.y = _this.startingPoint.y;
        };
        _this.touchMove = function (event) {
            if (_this.mouseDown) {
                var mousePositionCanvas = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
                var mousePosition = event.data.getLocalPosition(_this);
                _this.x = Math.abs(mousePositionCanvas.x);
                // stop patient from getting behind foreground elements
                if (mousePositionCanvas.y - _this.touchOffset.y < 280) {
                    _this.y = Math.abs(mousePositionCanvas.y);
                }
                var hit = SpriteHelper_1.SpriteHelper.hitTest(_this.getBounds(), _this._target.getBounds());
                if (hit) {
                    _this._target.highlight();
                }
                else {
                    _this._target.removeHighlight();
                }
                _this.updateEyesMask();
            }
        };
        _this.touchDone = function (event) {
            _this.mouseDown = false;
            var hit = SpriteHelper_1.SpriteHelper.hitTest(_this.getBounds(), _this._target.getBounds());
            if (Patient.WAITING) {
                if (hit) {
                    _this.off(TouchLoudEvent_1.TouchEvent.TOUCH, _this.touchDown);
                    _this.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, _this.touchDone);
                    _this.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, _this.touchMove);
                    _this.x = _this.startingPoint.x;
                    _this.y = _this.startingPoint.y;
                    _this.emit(HospitalEvent_1.HospitalEvent.PATIENT_DROPPED, "selected patient", _this, "selected patient");
                }
                else {
                    TweenLite.to(_this, .2, {
                        x: _this._startingPoint.x,
                        y: _this._startingPoint.y,
                        onComplete: _this.updateEyesMask
                    });
                    // also tween eyes mask
                    _this.blink();
                }
                _this._target.showClosed();
            }
        };
        _this.audioExpressionSpeakComplete = function (event) {
            _this.sndSpeak.off(AudioPlayer_1.AudioPlayer.AUDIO_COMPLETE, _this.audioExpressionSpeakComplete);
            Config_1.Config.currentSpeakOverlappingViewsSound = null;
        };
        _this._type = type;
        _this.interactive = true;
        _this.buttonMode = true;
        _this._startingPoint = startingPoint;
        _this.startBlinking();
        _this.onAddedToStage();
        return _this;
    }
    Object.defineProperty(Patient.prototype, "startingPoint", {
        get: function () {
            return this._startingPoint;
        },
        set: function (value) {
            this._startingPoint = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Patient.prototype, "width", {
        get: function () {
            return this.skinImage.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Patient.prototype, "height", {
        get: function () {
            return this.skinImage.height;
        },
        enumerable: true,
        configurable: true
    });
    Patient.prototype.onAddedToStage = function () {
        this.setSkinAndEyeColorType();
        this.createShadow();
        this.createEyes();
        this.updateEyesMask();
        this.createSkinLayer();
        this.createFaces();
        this.setFace(Patient.FACE_NEUTRAL);
        this.setFacialExpression(Patient.EXPRESSION_NEUTRAL);
        this.createClothes();
        this.startBreathing();
    };
    Patient.prototype.setPivotXY = function (amt) {
        if (amt === void 0) { amt = .5; }
        this.pivot.set(this.skinImage.width * amt, this.skinImage.height * amt);
    };
    Object.defineProperty(Patient.prototype, "skinType", {
        get: function () {
            return this._skinType;
        },
        enumerable: true,
        configurable: true
    });
    Patient.prototype.startBlinking = function () {
        setInterval(this.blink, Math.round(Math.random() * 3000) + 3000);
    };
    Patient.prototype.startBreathing = function () {
        TweenMax.to(this.currentTopClothes, 1, { width: "+=12", x: "-=6", repeat: -1, yoyo: true, ease: Linear.easeNone });
    };
    Patient.clone = function (originalPatient) {
        var clone = new Patient(originalPatient.type, originalPatient._startingPoint);
        clone.state = originalPatient.state;
        clone.disease = originalPatient.disease;
        clone.target = originalPatient.target;
        clone.currentBottomClothesTexture = originalPatient.currentBottomClothesTexture;
        clone.currentTopClothesTexture = originalPatient.currentTopClothesTexture;
        return clone;
    };
    Object.defineProperty(Patient.prototype, "disease", {
        get: function () {
            return this._disease;
        },
        set: function (value) {
            this._disease = value;
        },
        enumerable: true,
        configurable: true
    });
    Patient.prototype.toString = function () {
        return "Patient - type: " + this._type;
    };
    Object.defineProperty(Patient.prototype, "target", {
        get: function () {
            return this._target;
        },
        set: function (value) {
            this._target = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Patient.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (value) {
            this._type = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Patient.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (value) {
            this._state = value;
            switch (this._state) {
                case Patient.WAITING:
                    this.makeDraggable();
                    break;
                case Patient.BEING_EXAMINED:
                    break;
                default:
                    break;
            }
        },
        enumerable: true,
        configurable: true
    });
    Patient.prototype.scalePatient = function (size) {
        if (size == Patient.SIZE_BIG) {
            this.scale.x = this.scale.y = 1;
        }
        else if (size == Patient.SIZE_SMALL) {
            this.scale.x = this.scale.y = 0.5;
        }
        this.updateEyesMask();
    };
    Patient.prototype.setFacialExpression = function (facialExpression) {
        this.currentFacialExpression = facialExpression;
        switch (this.currentFacialExpression) {
            case Patient.EXPRESSION_NEUTRAL:
                this.setFace(Patient.FACE_NEUTRAL);
                break;
            case Patient.EXPRESSION_LITTLE_SMILE:
                this.setFace(Patient.FACE_LITTLE_SMILE);
                break;
            case Patient.EXPRESSION_BIG_SMILE:
                this.setFace(Patient.FACE_BIG_SMILE);
                break;
            default:
                break;
        }
    };
    Patient.prototype.setFace = function (face) {
        this.faceNeutral.visible = false;
        this.faceNeutralBlink.visible = false;
        this.faceLittleSmile.visible = false;
        this.faceLittleSmileBlink.visible = false;
        this.faceBigSmile.visible = false;
        this.faceBigSmileBlink.visible = false;
        switch (face) {
            case Patient.FACE_NEUTRAL:
                this.faceNeutral.visible = true;
                break;
            case Patient.FACE_NEUTRAL_BLINK:
                this.faceNeutralBlink.visible = true;
                break;
            case Patient.FACE_LITTLE_SMILE:
                this.faceLittleSmile.visible = true;
                break;
            case Patient.FACE_LITTLE_SMILE_BLINK:
                this.faceLittleSmileBlink.visible = true;
                break;
            case Patient.FACE_BIG_SMILE:
                this.faceBigSmile.visible = true;
                break;
            case Patient.FACE_BIG_SMILE_BLINK:
                this.faceBigSmileBlink.visible = true;
                break;
            default:
                break;
        }
        this.currentFace = face;
    };
    Patient.prototype.setClothes = function (texture, type) {
        if (type == ClothesItem_1.ClothesItem.TOP) {
            this.removeChild(this.currentTopClothes);
            this.currentTopClothesTexture = texture;
            this.currentTopClothes = pixi_js_1.Sprite.fromFrame(texture);
            this.addChild(this.currentTopClothes);
            this.currentTopClothes.x = 182;
            this.currentTopClothes.y = 400;
        }
        else if (type == ClothesItem_1.ClothesItem.BOTTOM) {
            this.removeChild(this.currentBottomClothes);
            this.currentBottomClothesTexture = texture;
            this.currentBottomClothes = pixi_js_1.Sprite.fromFrame(texture);
            this.addChild(this.currentBottomClothes);
            this.currentBottomClothes.x = 182;
            this.currentBottomClothes.y = 500;
            // make sure top is over bottom
            this.addChild(this.currentTopClothes);
        }
        if (Config_1.Config.currentSpeakSound != null) {
            AudioPlayer_1.AudioPlayer.getInstance().stopSound(Config_1.Config.currentSpeakSound);
        }
        Config_1.Config.currentSpeakSound = "barn_nyt_toj_" + Math.ceil(Math.random() * 3);
        this.sndSpeak = AudioPlayer_1.AudioPlayer.getInstance().playSound(Config_1.Config.currentSpeakSound, 0, Config_1.Config.SPEAK_VOLUME_LEVEL);
        this.sndSpeak.on(AudioPlayer_1.AudioPlayer.AUDIO_COMPLETE, this.audioExpressionSpeakComplete);
        this.clothesAdded = true;
    };
    Patient.prototype.makeDraggable = function () {
        this.on(TouchLoudEvent_1.TouchEvent.TOUCH, this.touchDown);
        this.on(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.touchDone);
        this.on(TouchLoudEvent_1.TouchEvent.TOUCH_OUT, this.touchDone);
        this.on(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.touchMove);
    };
    Patient.prototype.createEyes = function () {
        this.pairOfEyes = new PairOfEyes_1.PairOfEyes(this._eyeColorType);
        this.addChild(this.pairOfEyes);
        this.pairOfEyes.x = 274;
        this.pairOfEyes.y = 264;
    };
    Patient.prototype.createClothes = function () {
        if (this.currentBottomClothes != null) {
            this.removeChild(this.currentBottomClothes);
        }
        if (this.currentTopClothes != null) {
            this.removeChild(this.currentTopClothes);
        }
        this.currentBottomClothesTexture = this.currentBottomClothesTexture || "clothesLower_0" + Math.ceil(Math.random() * ClothesItem_1.ClothesItem.NUM_OF_BOTTOM_CLOTHES_ITEMS);
        this.currentBottomClothes = pixi_js_1.Sprite.fromFrame(this.currentBottomClothesTexture);
        this.addChild(this.currentBottomClothes);
        this.currentBottomClothes.x = 182;
        this.currentBottomClothes.y = 500;
        this.currentTopClothesTexture = this.currentTopClothesTexture || "clothesUpper_0" + Math.ceil(Math.random() * ClothesItem_1.ClothesItem.NUM_OF_TOP_CLOTHES_ITEMS);
        this.currentTopClothes = pixi_js_1.Sprite.fromFrame(this.currentTopClothesTexture);
        this.addChild(this.currentTopClothes);
        this.currentTopClothes.x = 182;
        this.currentTopClothes.y = 400;
    };
    Patient.prototype.createShadow = function () {
        this.shadow = pixi_js_1.Sprite.fromFrame("shadow_01");
        this.addChild(this.shadow);
        this.shadow.x = 45;
        this.shadow.y = 720;
    };
    Patient.prototype.createSkinLayer = function () {
        if (this._type > Patient.NUM_OF_TYPES) {
            Logger_1.Logger.log(this, "type out of range - texture does not exist");
            return;
        }
        var texture;
        texture = "kid" + this._type;
        this.skinImage = pixi_js_1.Sprite.fromFrame(texture);
        this.addChild(this.skinImage);
    };
    Patient.prototype.setSkinAndEyeColorType = function () {
        switch (this._type) {
            case 1:
                this._skinType = 1;
                this._eyeColorType = 5;
                break;
            case 2:
                this._skinType = 4;
                this._eyeColorType = 3;
                break;
            case 3:
                this._skinType = 3;
                this._eyeColorType = 2;
                break;
            case 4:
                this._skinType = 2;
                this._eyeColorType = 4;
                break;
            case 5:
                this._skinType = 1;
                this._eyeColorType = 1;
                break;
            case 6:
                this._skinType = 3;
                this._eyeColorType = 4;
                break;
            default:
                break;
        }
    };
    Patient.prototype.createFaces = function () {
        this.faceNeutral = this.createFace("facialExpression_kid" + this._type + "_neutral");
        this.faceNeutralBlink = this.createFace("facialExpression_kid" + this._type + "_neutralBlink");
        this.faceLittleSmile = this.createFace("facialExpression_kid" + this._type + "_littleSmile");
        this.faceLittleSmileBlink = this.createFace("facialExpression_kid" + this._type + "_littleSmileBlink");
        this.faceBigSmile = this.createFace("facialExpression_kid" + this._type + "_bigSmile");
        this.faceBigSmileBlink = this.createFace("facialExpression_kid" + this._type + "_bigSmileBlink");
    };
    Patient.prototype.createFace = function (texture) {
        var faceImage = pixi_js_1.Sprite.fromFrame(texture);
        this.addChild(faceImage);
        faceImage.x = 188;
        faceImage.y = 168;
        return faceImage;
    };
    Patient.prototype.updateEyesMask = function () {
    };
    Patient.prototype.playExpressionSpeak = function () {
        if (Config_1.Config.currentSpeakSound != null) {
            AudioPlayer_1.AudioPlayer.getInstance().stopSound(Config_1.Config.currentSpeakSound);
        }
        if (Config_1.Config.currentSpeakOverlappingViewsSound != null) {
            AudioPlayer_1.AudioPlayer.getInstance().stopSound(Config_1.Config.currentSpeakOverlappingViewsSound);
        }
        Config_1.Config.currentSpeakOverlappingViewsSound = this.getExpressionSpeakSound();
        this.sndSpeak = AudioPlayer_1.AudioPlayer.getInstance().playSound(Config_1.Config.currentSpeakOverlappingViewsSound, 0, Config_1.Config.SPEAK_VOLUME_LEVEL);
        this.sndSpeak.on(AudioPlayer_1.AudioPlayer.AUDIO_COMPLETE, this.audioExpressionSpeakComplete);
    };
    Patient.prototype.getExpressionSpeakSound = function () {
        var speak;
        switch (this.disease) {
            case Level_1.Level.FRACTURE_HAND:
                speak = "barn_jeg_har_slaet_min_hand";
                break;
            case Level_1.Level.FRACTURE_RADIUS:
                speak = "barn_min_arm_er_vist_braekket_fordi_jeg_vaeltede_pa_min_cykel";
                break;
            case Level_1.Level.INSECT_BITE:
                speak = "barn_jeg_er_blevet_stukket_af_en_bi_kan_du_hjaelpe_mig";
                break;
            case Level_1.Level.PNEUMONIA:
                speak = "barn_jeg_hoster_rigtig_meget_mon_jeg_er_forkolet";
                break;
            case Level_1.Level.POISONING:
                speak = "barn_det_rumler_i_min_mave_mon_det_er_noget_jeg_har_spist";
                break;
            case Level_1.Level.SPRAIN:
                speak = "barn_min_arm_er_forstuvet_kan_du_reparere_den";
                break;
            case Level_1.Level.BURN:
                speak = "barn_jeg_har_braendt_mig_pa_en_gryde_skal_vi_komme_is_pa";
                break;
            default:
                break;
        }
        return speak;
    };
    Patient.prototype.startIdleEyeMOvement = function () {
        this.pairOfEyes.initIdleMovement();
    };
    Patient.prototype.destroy = function () {
        if (this.sndSpeak != null) {
            this.sndSpeak.off(AudioPlayer_1.AudioPlayer.AUDIO_COMPLETE, this.audioExpressionSpeakComplete);
        }
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH, this.touchDown);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.touchDone);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH_OUT, this.touchDone);
        this.off(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.touchMove);
        if (this.pairOfEyes != null) {
            this.removeChild(this.pairOfEyes);
            this.pairOfEyes = null;
        }
        if (this.currentTopClothes != null) {
            this.removeChild(this.currentTopClothes);
            this.currentTopClothes = null;
        }
        if (this.currentBottomClothes != null) {
            this.removeChild(this.currentBottomClothes);
            this.currentBottomClothes = null;
        }
    };
    Patient.WAITING = "appdrhospital.view.objects.Patient.waiting";
    Patient.BEING_EXAMINED = "appdrhospital.view.objects.Patient.beingExamined";
    Patient.NUM_OF_TYPES = 6;
    Patient.SIZE_SMALL = "appdrhospital.view.objects.Patient.SIZE_SMALL";
    Patient.SIZE_BIG = "appdrhospital.view.objects.Patient.SIZE_BIG";
    Patient.FACE_NEUTRAL = "appdrhospital.view.objects.Patient.FACE_NEUTRAL";
    Patient.FACE_NEUTRAL_BLINK = "appdrhospital.view.objects.Patient.FACE_NEUTRAL_BLINK";
    Patient.FACE_LITTLE_SMILE = "appdrhospital.view.objects.Patient.FACE_LITTLE_SMILE";
    Patient.FACE_LITTLE_SMILE_BLINK = "appdrhospital.view.objects.Patient.FACE_LITTLE_SMILE_BLINK";
    Patient.FACE_BIG_SMILE = "appdrhospital.view.objects.Patient.FACE_BIG_SMILE";
    Patient.FACE_BIG_SMILE_BLINK = "appdrhospital.view.objects.Patient.FACE_BIG_SMILE_BLINK";
    Patient.EXPRESSION_NEUTRAL = "appdrhospital.view.objects.Patient.EXPRESSION_NEUTRAL";
    Patient.EXPRESSION_LITTLE_SMILE = "appdrhospital.view.objects.Patient.EXPRESSION_LITTLE_SMILE";
    Patient.EXPRESSION_BIG_SMILE = "appdrhospital.view.objects.Patient.EXPRESSION_BIG_SMILE";
    return Patient;
}(pixi_js_1.Sprite));
exports.Patient = Patient;
//# sourceMappingURL=Patient.js.map
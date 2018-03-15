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
var Logger_1 = require("../loudmotion/utils/debug/Logger");
var Initializer_1 = require("./Initializer");
var MainView_1 = require("./view/MainView");
var HospitalEvent_1 = require("./event/HospitalEvent");
var pixi_js_1 = require("pixi.js");
var DataSaver_1 = require("./utils/DataSaver");
var Config_1 = require("./Config");
var _callback;
var GameHospital = /** @class */ (function (_super) {
    __extends(GameHospital, _super);
    function GameHospital(debug, callback, assetPrefix) {
        if (debug === void 0) { debug = false; }
        if (assetPrefix === void 0) { assetPrefix = "media/hospital/assets/"; }
        var _this = _super.call(this) || this;
        // KILL THE GAME - PURGE ASSETMANAGER
        //-------------------------------------------------------------------------------------------------------------------------------------
        // private onkillGame = (e:Event):void => {
        _this.onkillGame = function () {
            Logger_1.Logger.log(_this, "GameHospital.onkillGame");
            _this.mainView.off(HospitalEvent_1.HospitalEvent.KILL_GAME, _this.onkillGame); //TODO add back?
            if (_this.mainView != null) {
                _this.removeChild(_this.mainView);
            }
            // assets.purge(); //TODO can we do this with PIXI?
            _this.endGame();
        };
        Logger_1.Logger.log(_this, " Hospital(assetPrefix == " + _this.assetPrefix);
        _callback = callback;
        _this.assetPrefix = assetPrefix;
        // this.addEventListener( Event.ADDED_TO_STAGE, onAddedToStage );
        _this.init();
        return _this;
    }
    //ENQUEUE ASSETS AND LOAD THEM
    //-------------------------------------------------------------------------------------------------------------------------------------
    GameHospital.prototype.init = function (event) {
        if (event === void 0) { event = null; }
        Logger_1.Logger.log(this, " Hospital init");
        // this.setupAssetManager();
        // this.starLoading();
        this.validateData();
        _callback();
        this.startApp();
        if (Initializer_1.Initializer.showLoaderCallbackFunction != null) {
            Initializer_1.Initializer.showLoaderCallbackFunction();
        }
    };
    //-------------------------------------------------------------------------------------------------------------------------------------
    /**
     * 	Validate if users has saved data before otherwise save default data
     */
    GameHospital.prototype.validateData = function () {
        // Config.dataSaver = new DataSaver (Config.STORAGE_FILE_NAME_PATIENTS_CURED, Config.STORAGE_FILE_NAME_DISEASES_CURED); //TODO add back?
        Config_1.Config.dataSaver = new DataSaver_1.DataSaver();
    };
    //-------------------------------------------------------------------------------------------------------------------------------------
    /**
     * Start app and hide loader listen for when the game is killed
     */
    GameHospital.prototype.startApp = function () {
        Logger_1.Logger.log(this, "GameHospital.startApp()");
        // System.pauseForGCIfCollectionImminent(0);
        // System.gc();
        // Game is inited and ready to be shown
        if (Initializer_1.Initializer.initDoneCallbackFunction != null) {
            Initializer_1.Initializer.initDoneCallbackFunction();
        }
        this.mainView = new MainView_1.MainView();
        this.mainView.on(HospitalEvent_1.HospitalEvent.KILL_GAME, this.onkillGame);
        this.addChild((this.mainView));
        this.mainView.init();
        // Hide load. Game is ready
        if (Initializer_1.Initializer.hideLoaderCallbackFunction != null) {
            Initializer_1.Initializer.hideLoaderCallbackFunction();
        }
        // progressBar.removeFromParent(true); //TODO
        // progressBar.dispose();
    };
    GameHospital.prototype.endGame = function () {
        Logger_1.Logger.log(this, "GameHospital endGame if Initializer.exitCallbackFunction) " + Initializer_1.Initializer.exitCallbackFunction);
        if (Initializer_1.Initializer.exitCallbackFunction != null) {
            Initializer_1.Initializer.exitCallbackFunction();
        }
    };
    // Set up a Initializer
    //-------------------------------------------------------------------------------------------------------------------------------------
    GameHospital.prototype.getInitializer = function () {
        if (!this.initializer) {
            this.initializer = new Initializer_1.Initializer();
        }
        Logger_1.Logger.log(this, "GameHospital getInitializer : return this.initializer == " + this.initializer);
        return this.initializer;
    };
    return GameHospital;
}(pixi_js_1.Sprite));
exports.GameHospital = GameHospital;
//# sourceMappingURL=GameHospital.js.map
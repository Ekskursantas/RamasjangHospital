"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("../loudmotion/utils/debug/Logger");
;
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.setCurrentPatientCured = function () {
        Logger_1.Logger.log(this, "Config.setCurrentPatientCured()");
        Logger_1.Logger.log(this, "Config currentPatient.disease: " + Config.currentPatient.disease);
        if (Config.currentPatient == Config.patientWaitingInSlot_1) {
            Config.patientWaitingInSlot_1 = null;
        }
        if (Config.currentPatient == Config.patientWaitingInSlot_2) {
            Config.patientWaitingInSlot_2 = null;
        }
        if (Config.currentPatient == Config.patientWaitingInSlot_3) {
            Config.patientWaitingInSlot_3 = null;
        }
        Logger_1.Logger.log(this, "Config.setCurrentPatientCured() patientWaitingInSlot_1: " + Config.patientWaitingInSlot_1);
        Logger_1.Logger.log(this, "Config.setCurrentPatientCured() patientWaitingInSlot_2: " + Config.patientWaitingInSlot_2);
        Logger_1.Logger.log(this, "Config.setCurrentPatientCured() patientWaitingInSlot_3: " + Config.patientWaitingInSlot_3);
    };
    Config.getUnlockedDiseases = function () {
        Logger_1.Logger.log(this, "Config getUnlockedDiseases  Config.patientsCured == " + Config.patientsCured);
        var unlockedDiseases = [];
        for (var i = 0; i <= Config.patientsCured; i++) {
            Logger_1.Logger.log(this, "Config getUnlockedDiseases  i == " + i);
            Logger_1.Logger.log(this, "Config getUnlockedDiseases  levels.length == " + Config.levels.length);
            if (i >= Config.levels.length)
                continue;
            var level = Config.levels[i];
            unlockedDiseases = unlockedDiseases.concat(level.unlockedDiseases);
        }
        Logger_1.Logger.log(this, "Config getUnlockedDiseases   unlockedDiseases.length == " + unlockedDiseases.length);
        return unlockedDiseases;
    };
    Config.getUnlockedClothes = function () {
        var unlockedClothes = [];
        for (var i = 0; i <= Config.patientsCured; i++) {
            if (i >= Config.levels.length)
                continue;
            var level = Config.levels[i];
            unlockedClothes = unlockedClothes.concat(level.unlockedClothes);
        }
        Logger_1.Logger.log(this, "Config getUnlockedClothes unlockedClothes.length == " + unlockedClothes.length);
        return unlockedClothes;
    };
    Config.getUnlockedBandages = function () {
        var unlockedBandages = [];
        for (var i = 0; i <= Config.patientsCured; i++) {
            if (i >= Config.levels.length) {
                continue;
            }
            var level = Config.levels[i];
            unlockedBandages = unlockedBandages.concat(level.unlockedBandage);
        }
        Logger_1.Logger.log(this, "Config getUnlockedBandages unlockedBandages.length == " + unlockedBandages.length);
        return unlockedBandages;
    };
    Config.getUnlockedLemonades = function () {
        var unlockedLemonades = [];
        for (var i = 0; i <= Config.patientsCured; i++) {
            if (i >= Config.levels.length) {
                continue;
            }
            var level = Config.levels[i];
            unlockedLemonades = unlockedLemonades.concat(level.unlockedLemonade);
        }
        Logger_1.Logger.log(this, "Config getUnlockedLemonades unlockedLemonades.length == " + unlockedLemonades.length);
        return unlockedLemonades;
    };
    Config.getUnlockedbandAids = function () {
        var unlockedBandAids = [];
        for (var i = 0; i <= Config.patientsCured; i++) {
            if (i >= Config.levels.length) {
                continue;
            }
            var level = Config.levels[i];
            unlockedBandAids = unlockedBandAids.concat(level.unlockedBandAid);
        }
        Logger_1.Logger.log(this, "Config getUnlockedbandAids unlockedBandAids.length == " + unlockedBandAids.length);
        return unlockedBandAids;
    };
    Config.updateCuredPatients = function () {
        Logger_1.Logger.log(this, "Config updateCuredPatients Config.curedDiseases.length == " + Config.curedDiseases.length);
        for (var i = 0; i < Config.curedDiseases.length; i++) {
            if (Config.curedDiseases[i] == Config.currentPatient.disease) {
                return;
            }
        }
        Config.curedDiseases.push(Config.currentPatient.disease);
        Logger_1.Logger.log(this, "Config updateCuredPatients AFTER push : Config.curedDiseases.length == " + Config.curedDiseases.length + " : Config.currentPatient.disease == " + Config.currentPatient.disease);
    };
    Config.SPEAK_VOLUME_LEVEL = 1;
    Config.EFFECTS_VOLUME_LEVEL = .7;
    Config.MUSIC_VOLUME_LEVEL = .2;
    // gamestate constants
    Config.INTRO = "intro";
    Config.IDLE = "idle";
    Config.EXAMINING = "examining";
    Config.POST_TREATMENT = "postTreatment";
    Config.BETWEEN_TREATMENTS = "betweenTreatments";
    Config.patientsCured = 0;
    Config.patientSlot_1_y = 215;
    Config.patientSlot_2_y = 205;
    Config.patientSlot_3_y = 220;
    Config.curedDiseases = [];
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=Config.js.map
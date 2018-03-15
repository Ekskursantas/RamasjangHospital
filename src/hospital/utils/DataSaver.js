"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("../Config");
var Logger_1 = require("../../loudmotion/utils/debug/Logger");
/**
     * ...
     * @author ddennis.dk - aka fantastisk.dk/works aka meresukker.dk
     */
var DataSaver = /** @class */ (function () {
    function DataSaver() {
        Logger_1.Logger.log(this, "DataSaver");
        if (Modernizr.localstorage) {
            // window.localStorage is available!
            Logger_1.Logger.log(this, "DataSaver init  : Modernizr says : window.localStorage is available!");
            this.setupData();
        }
        else {
            // no native support for local storage :(
            // try a fallback or another third-party solution
            Logger_1.Logger.log(this, "DataSaver Modernizr says : NO GOOD no native support for local storage");
        }
    }
    DataSaver.prototype.setupData = function () {
        if (Modernizr.localstorage) {
            try {
                var sPatients = this.read();
                Logger_1.Logger.log(this, "DataSaver Existing data (patients cured): sPatients == " + sPatients);
                if (sPatients == "") {
                    Config_1.Config.patientsCured = 0;
                }
                else {
                    Config_1.Config.patientsCured = Number(sPatients);
                }
            }
            catch (e) {
                Config_1.Config.patientsCured = 0;
                Logger_1.Logger.log(this, "DataSaver ERROR No existing Patients data:");
            }
            try {
                var sDiseases = this.readDiseases();
                Logger_1.Logger.log(this, "DataSaver Existing data (diseases cured): sDiseases == " + sDiseases);
                Config_1.Config.curedDiseases = [];
                if (sDiseases.length > 0) {
                    Config_1.Config.curedDiseases = sDiseases.split(",");
                }
            }
            catch (e) {
                Config_1.Config.curedDiseases = [];
                // this.saveDiseases(String (Config.curedDiseases));
                Logger_1.Logger.log(this, "DataSaver ERROR No existing Diseases data:");
            }
        }
        Logger_1.Logger.log(this, "DataSaver AFTER Config.patientsCured " + Config_1.Config.patientsCured);
        Logger_1.Logger.log(this, "DataSaver AFTER Config.curedDiseases " + Config_1.Config.curedDiseases + " : Config.curedDiseases.length ===" + Config_1.Config.curedDiseases.length);
    };
    DataSaver.prototype.setLocalStorage = function (key, data) {
        if (Modernizr.localstorage) {
            // window.localStorage is available!
            if (!DataSaver.LOCAL_STORAGE_EXCEEDED) {
                try {
                    localStorage.setItem(key, data);
                    Logger_1.Logger.log(this, "Modernizr says : GOOD : native support for SET local storage : SAVED key, data == " + key + " : " + data);
                }
                catch (e) {
                    if (this.isQuotaExceeded(e)) {
                        DataSaver.LOCAL_STORAGE_EXCEEDED = true;
                        // Storage full, maybe notify user or do some clean-up
                        Logger_1.Logger.log(this, "ERROR DataSaver::::::::::::::: localStorage : Storage full");
                    }
                    else {
                        Logger_1.Logger.log(this, "ERROR DataSaver: no native support for SET local storage");
                    }
                }
            }
            else {
                Logger_1.Logger.log(this, "DataSaver setLocalStorage CAN'T SAVE ::::::::::::::: LOCAL_STORAGE_EXCEEDED");
            }
        }
        else {
            // no native support for local storage :(
            // try a fallback or another third-party solution
            Logger_1.Logger.log(this, "Modernizr says : NO GOOD : no native support for SET local storage");
        }
    };
    DataSaver.prototype.isQuotaExceeded = function (e) {
        var quotaExceeded = false;
        if (e) {
            if (e.code) {
                Logger_1.Logger.log(this, "DataSaver localStorage isQuotaExceeded : e.code === " + e.code);
                switch (e.code) {
                    case 22:
                        quotaExceeded = true;
                        break;
                    case 1014:
                        // Firefox
                        if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                            quotaExceeded = true;
                        }
                        break;
                }
            }
            else if (e.number === -2147024882) {
                // Internet Explorer 8
                quotaExceeded = true;
            }
        }
        Logger_1.Logger.log(this, "DataSaver localStorage isQuotaExceeded : RETURNING quotaExceeded === " + quotaExceeded);
        return quotaExceeded;
    };
    DataSaver.prototype.getLocalStorage = function (key) {
        var data;
        if (Modernizr.localstorage) {
            // window.localStorage is available!
            try {
                data = localStorage.getItem(key);
            }
            catch (e) {
                Logger_1.Logger.log(this, "DataSaver CATCH : no native support for GET local storage");
            }
        }
        else {
            // no native support for local storage :(
            // try a fallback or another third-party solution
            Logger_1.Logger.log(this, "Modernizr says : NO GOOD : no native support for GET local storage");
        }
        return data;
    };
    DataSaver.prototype.removeLocalStorage = function (key) {
        if (Modernizr.localstorage) {
            // window.localStorage is available!
            try {
                localStorage.removeItem(key);
            }
            catch (e) {
                Logger_1.Logger.log(this, "CATCH : no native support for REMOVE local storage");
            }
        }
        else {
            // no native support for local storage :(
            // try a fallback or another third-party solution
            Logger_1.Logger.log(this, "Modernizr says : NO GOOD : no native support for REMOVE local storage");
        }
    };
    DataSaver.prototype.read = function () {
        // return savecontent.read(fileName, location);
        var patients_cured;
        if (Modernizr.localstorage) {
            patients_cured = this.getLocalStorage(DataSaver.PATIENTS_CURED);
            Logger_1.Logger.log(this, "read  patients_cured === " + patients_cured);
        }
        return patients_cured;
    };
    ;
    DataSaver.prototype.save = function (data) {
        // savecontent.save(fileName, data, location );
        console.log("save()" + data);
        Logger_1.Logger.log(this, "DataSaver save  DataSaver.PATIENTS_CURED, data === " + data);
        if (Modernizr.localstorage) {
            this.setLocalStorage(DataSaver.PATIENTS_CURED, data);
        }
    };
    ;
    DataSaver.prototype.readDiseases = function () {
        // return savecontent.read(fileNameDiseases, locationDiseases);
        var diseases_cured = "";
        if (Modernizr.localstorage) {
            try {
                diseases_cured = this.getLocalStorage(DataSaver.DISEASES_CURED);
                Logger_1.Logger.log(this, "diseases_cured == " + diseases_cured);
            }
            catch (e) {
                Logger_1.Logger.log(this, "ERROR readDiseases");
            }
        }
        return diseases_cured;
    };
    ;
    DataSaver.prototype.saveDiseases = function (data) {
        // savecontent.save(fileNameDiseases, data, locationDiseases);
        Logger_1.Logger.log(this, "DataSaver saveDiseases  DataSaver.DISEASES_CURED, data === " + data);
        if (Modernizr.localstorage) {
            this.setLocalStorage(DataSaver.DISEASES_CURED, data);
        }
    };
    DataSaver.PATIENTS_CURED = "patients_cured";
    DataSaver.DISEASES_CURED = "diseases_cured";
    return DataSaver;
}());
exports.DataSaver = DataSaver;
//# sourceMappingURL=DataSaver.js.map
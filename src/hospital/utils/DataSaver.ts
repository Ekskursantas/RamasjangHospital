
	import {Config} from "../Config";
	import {Logger} from "../../loudmotion/utils/debug/Logger";
/**
	 * ...
	 * @author ddennis.dk - aka fantastisk.dk/works aka meresukker.dk
	 */
export class DataSaver {

	public static LOCAL_STORAGE_EXCEEDED:boolean;
	private static PATIENTS_CURED:string = "patients_cured";
	private static DISEASES_CURED:string = "diseases_cured";

	// private savecontent:SaveFileTo;
	public dataExist:boolean;
	private location:File;
	private fileName:string;

	public dataDiseasesExist:boolean;
	private locationDiseases:File;
	private fileNameDiseases:string;

	constructor() {
		Logger.log(this, "DataSaver");

		if (Modernizr.localstorage) {
			// window.localStorage is available!
			Logger.log(this, "DataSaver init  : Modernizr says : window.localStorage is available!");
			this.setupData();
		} else {
			// no native support for local storage :(
			// try a fallback or another third-party solution
			Logger.log(this, "DataSaver Modernizr says : NO GOOD no native support for local storage");
		}
	}

	private setupData():void{
		if (Modernizr.localstorage) {
			try {
				let sPatients:string = this.read();
				Logger.log(this, "DataSaver Existing data (patients cured): sPatients == " + sPatients);

				if (sPatients == "") {
					Config.patientsCured = 0;
				} else {
					Config.patientsCured = Number(sPatients);
				}
			} catch (e) {
				Config.patientsCured = 0;

				Logger.log(this, "DataSaver ERROR No existing Patients data:");
			}

			try {
				let sDiseases:string = this.readDiseases();
				Logger.log(this, "DataSaver Existing data (diseases cured): sDiseases == " + sDiseases);
				Config.curedDiseases = [];
				if (sDiseases.length > 0) {
					Config.curedDiseases = sDiseases.split(",");
				}
			} catch (e) {
				Config.curedDiseases = [];
				// this.saveDiseases(String (Config.curedDiseases));
				Logger.log(this, "DataSaver ERROR No existing Diseases data:");
			}

		}
		Logger.log(this, "DataSaver AFTER Config.patientsCured " + Config.patientsCured);
		Logger.log(this, "DataSaver AFTER Config.curedDiseases " + Config.curedDiseases +" : Config.curedDiseases.length ==="+Config.curedDiseases.length);
	}

	public setLocalStorage(key:string, data:string):void{
		if (Modernizr.localstorage) {
			// window.localStorage is available!
			if(!DataSaver.LOCAL_STORAGE_EXCEEDED){
				try {
					localStorage.setItem(key, data);
					Logger.log(this, "Modernizr says : GOOD : native support for SET local storage : SAVED key, data == "+key+" : "+data);
				} catch(e) {
					if (this.isQuotaExceeded(e)) {
						DataSaver.LOCAL_STORAGE_EXCEEDED = true;
						// Storage full, maybe notify user or do some clean-up
						Logger.log(this, "ERROR DataSaver::::::::::::::: localStorage : Storage full");
					}else{
						Logger.log(this, "ERROR DataSaver: no native support for SET local storage");
					}
				}
			}else{
				Logger.log(this, "DataSaver setLocalStorage CAN'T SAVE ::::::::::::::: LOCAL_STORAGE_EXCEEDED");
			}

		} else {
			// no native support for local storage :(
			// try a fallback or another third-party solution
			Logger.log(this, "Modernizr says : NO GOOD : no native support for SET local storage");
		}
	}

	private isQuotaExceeded(e:any):boolean{
		let quotaExceeded:boolean = false;
		if (e) {
			if (e.code) {
				Logger.log(this, "DataSaver localStorage isQuotaExceeded : e.code === "+e.code);
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
			} else if (e.number === -2147024882) {
				// Internet Explorer 8
				quotaExceeded = true;
			}
		}
		Logger.log(this, "DataSaver localStorage isQuotaExceeded : RETURNING quotaExceeded === "+quotaExceeded);
		return quotaExceeded;
	}

	public getLocalStorage(key:string):any{
		let data:any;
		if (Modernizr.localstorage) {
			// window.localStorage is available!
			try {
				data = localStorage.getItem(key);
			} catch(e) {
				Logger.log(this, "DataSaver CATCH : no native support for GET local storage");
			}
		} else {
			// no native support for local storage :(
			// try a fallback or another third-party solution
			Logger.log(this, "Modernizr says : NO GOOD : no native support for GET local storage");
		}
		return data;
	}

	public removeLocalStorage(key:string):void{
		if (Modernizr.localstorage) {
			// window.localStorage is available!
			try {
				localStorage.removeItem(key);
			} catch(e) {
				Logger.log(this, "CATCH : no native support for REMOVE local storage");
			}
		} else {
			// no native support for local storage :(
			// try a fallback or another third-party solution
			Logger.log(this, "Modernizr says : NO GOOD : no native support for REMOVE local storage");
		}
	}


	public read():string {
		// return savecontent.read(fileName, location);
		let patients_cured: string;
		if (Modernizr.localstorage) {
			patients_cured = this.getLocalStorage(DataSaver.PATIENTS_CURED);
			Logger.log(this, "read  patients_cured === " + patients_cured);
		}
		return patients_cured;
	};

	public save(data:string ):void {
		// savecontent.save(fileName, data, location );
        console.log("save()" + data);
		Logger.log(this, "DataSaver save  DataSaver.PATIENTS_CURED, data === " + data);
		if (Modernizr.localstorage) {
			this.setLocalStorage(DataSaver.PATIENTS_CURED, data);
		}
	};

	public readDiseases():string {
		// return savecontent.read(fileNameDiseases, locationDiseases);
		let diseases_cured:string = "";
		if (Modernizr.localstorage) {
			try {
				diseases_cured = this.getLocalStorage(DataSaver.DISEASES_CURED);
				Logger.log(this, "diseases_cured == "+diseases_cured);
			} catch(e) {
				Logger.log(this, "ERROR readDiseases");
			}
		}
		return diseases_cured;
	};

	public saveDiseases(data:string ):void {
		// savecontent.save(fileNameDiseases, data, locationDiseases);
		Logger.log(this, "DataSaver saveDiseases  DataSaver.DISEASES_CURED, data === " + data);
		if (Modernizr.localstorage) {
			this.setLocalStorage(DataSaver.DISEASES_CURED, data);
		}
	}

}
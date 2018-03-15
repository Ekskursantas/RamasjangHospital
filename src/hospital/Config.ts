
import {DataSaver} from "./utils/DataSaver";
import {Logger} from "../loudmotion/utils/debug/Logger";
import {Level} from "./vo/Level";
import {Patient} from "./view/objects/Patient";
import Rectangle = PIXI.Rectangle;;

export class Config {

	static SPEAK_VOLUME_LEVEL:number = 1;
	static EFFECTS_VOLUME_LEVEL:number = .7;
	static MUSIC_VOLUME_LEVEL:number = .2;

	// gamestate constants
	static INTRO:string = "intro";
	static IDLE:string = "idle";
	static EXAMINING:string = "examining";
	static POST_TREATMENT:string = "postTreatment";
	static BETWEEN_TREATMENTS:string = "betweenTreatments";

    static dataSaver: DataSaver;
	// static assetManager:AssetManager;
	static gameState:string;
	static safeFrame:Rectangle;

	static levels:Level[];

	static patientsCured:number = 0;

	static currentPatient:Patient;

	static patientSlot_1_x:number;
	static patientSlot_1_y:number = 215;
	static patientSlot_2_x:number;
	static patientSlot_2_y:number = 205;
	static patientSlot_3_x:number;
	static patientSlot_3_y:number = 220;

	static patientWaitingInSlot_1:Patient;
	static patientWaitingInSlot_2:Patient;
	static patientWaitingInSlot_3:Patient;

	static currentSpeakSound:string;
	static currentSpeakOverlappingViewsSound:string;
	static currentTimeout:number;
	static curedDiseases:any[] = [];


	constructor(){
	}

	static setCurrentPatientCured():void{
		Logger.log(this, "Config.setCurrentPatientCured()");
		Logger.log(this, "Config currentPatient.disease: " + Config.currentPatient.disease);
        
        
		if(Config.currentPatient == Config.patientWaitingInSlot_1) {
			Config.patientWaitingInSlot_1 = null;
		}
		if(Config.currentPatient == Config.patientWaitingInSlot_2) {
			Config.patientWaitingInSlot_2 = null;
		}
		if(Config.currentPatient == Config.patientWaitingInSlot_3) {
			Config.patientWaitingInSlot_3 = null;
		}

		Logger.log(this, "Config.setCurrentPatientCured() patientWaitingInSlot_1: " + Config.patientWaitingInSlot_1);
		Logger.log(this, "Config.setCurrentPatientCured() patientWaitingInSlot_2: " + Config.patientWaitingInSlot_2);
		Logger.log(this, "Config.setCurrentPatientCured() patientWaitingInSlot_3: " + Config.patientWaitingInSlot_3);

	}
    
	static getUnlockedDiseases():any{
		Logger.log(this, "Config getUnlockedDiseases  Config.patientsCured == "+Config.patientsCured);
		let unlockedDiseases:any[] = [];

		for (let i:number = 0; i <= Config.patientsCured; i++) {
			Logger.log(this, "Config getUnlockedDiseases  i == "+i);
			Logger.log(this, "Config getUnlockedDiseases  levels.length == " + Config.levels.length);
		
			if(i >= Config.levels.length) continue;
			let level:Level = Config.levels[i];
			unlockedDiseases = unlockedDiseases.concat(level.unlockedDiseases);
		}

		Logger.log(this, "Config getUnlockedDiseases   unlockedDiseases.length == "+unlockedDiseases.length);
		return unlockedDiseases;

	}

	static getUnlockedClothes():any{
		let unlockedClothes:any[] = [];

		for (let i:number = 0; i <= Config.patientsCured; i++) {
			if(i >= Config.levels.length) continue;
			let level:Level = Config.levels[i];
			unlockedClothes = unlockedClothes.concat( level.unlockedClothes);
		}
		Logger.log(this, "Config getUnlockedClothes unlockedClothes.length == "+unlockedClothes.length);
		return unlockedClothes;
	}

	static getUnlockedBandages ():any{
		let unlockedBandages:any[] = [];

		for (let i:number = 0; i <= Config.patientsCured; i++) {
			if(i >= Config.levels.length) {
				continue;
			}
			let level:Level = Config.levels[i];
			unlockedBandages = unlockedBandages.concat(level.unlockedBandage);
		}
		Logger.log(this, "Config getUnlockedBandages unlockedBandages.length == "+unlockedBandages.length);
		return unlockedBandages;
	}

	static getUnlockedLemonades():any{
		let unlockedLemonades:any[] = [];

		for (let i:number = 0; i <= Config.patientsCured; i++) {
			if(i >= Config.levels.length) {
				continue;
			}
			let level:Level = Config.levels[i];
			unlockedLemonades = unlockedLemonades.concat(level.unlockedLemonade);
		}
		Logger.log(this, "Config getUnlockedLemonades unlockedLemonades.length == "+unlockedLemonades.length);
		return unlockedLemonades;
	}

	static getUnlockedbandAids():any{

		let unlockedBandAids:any[] = [];

		for (let i:number = 0; i <= Config.patientsCured; i++) {
			if(i >= Config.levels.length) {
				continue;
			}
			let level:Level = Config.levels[i];
			unlockedBandAids = unlockedBandAids.concat(level.unlockedBandAid);
		}
		Logger.log(this, "Config getUnlockedbandAids unlockedBandAids.length == "+unlockedBandAids.length);
		return unlockedBandAids;
	}

	static updateCuredPatients():void {
		Logger.log(this, "Config updateCuredPatients Config.curedDiseases.length == "+Config.curedDiseases.length);
		for (let i:number = 0; i < Config.curedDiseases.length; i++) {
			if(Config.curedDiseases[i] == Config.currentPatient.disease){
				return;
			}
		}
		Config.curedDiseases.push(Config.currentPatient.disease);

		Logger.log(this, "Config updateCuredPatients AFTER push : Config.curedDiseases.length == "+Config.curedDiseases.length+" : Config.currentPatient.disease == "+Config.currentPatient.disease);
	}
}
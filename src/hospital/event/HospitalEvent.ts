
export class HospitalEvent extends Event {
		
		static KILL_GAME:string = "killGame";
		static QUIT_APP:string = "quitApp";
		
		static MINIGAME_COMPLETED:string = "minigameCompleted";

//		static PUZZLE_GAME_COMPLETED:string = "appCompleted";
		static SHOOT_BACTERIA_GAME_COMPLETED:string = "shootBacteriaGameCompleted";

		static CONTAMINANT_REMOVED:string = "contaminantRemoved";

		static PATIENT_DROPPED:string = "patientDropped";
		static PATIENT_SELECTED:string = "patientSelected";
		static PATIENT_CURED:string = "patientCured";

		static DISEASE_HOTSPOT_PRESSED:string = "diseaseHotSpotPressed";
		static BACK_FROM_OPERATING_ROOM:string = "backFromOperatingRoom";
		static BACK_FROM_MINIGAME:string = "backFromMiniGame";

		static FRONTPAGE_EXITED:string = "frontpageExited";
		static BANDAGE_PLACED:string = "bandagePlaced";
		
		
		public result:boolean;

		constructor(type:string){
			super(type);
		}

}
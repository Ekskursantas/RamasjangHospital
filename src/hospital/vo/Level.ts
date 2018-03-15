


export class Level {
		
		// Disease constants
	public static FRACTURE_RADIUS:string = "fractureRadius";
	public static FRACTURE_HAND:string = "fractureHand";
	public static INSECT_BITE:string = "insectBite";
	public static SPRAIN	:string = "sprain";
	public static POISONING:string = "poisoning";
	public static PNEUMONIA:string = "pneumonia";
	public static BURN:string = "burn";


	// Bandage constants
	public static BANDAGE_1:string = "forbinding_gui_01";
	public static BANDAGE_2:string = "forbinding_gui_02";
	public static BANDAGE_3:string = "forbinding_gui_03";
	public static BANDAGE_4:string = "forbinding_gui_04";
	public static BANDAGE_5:string = "forbinding_gui_05";
	public static BANDAGE_6:string = "forbinding_gui_06";
	public static BANDAGE_7:string = "forbinding_gui_07";
	public static BANDAGE_8:string = "forbinding_gui_08";
	public static BANDAGE_9:string = "forbinding_gui_09";
	public static BANDAGE_10:string = "forbinding_gui_10";

	// Band aid constants
	public static BAND_AID_1:string = "plaster_01";
	public static BAND_AID_2:string = "plaster_02";
	public static BAND_AID_3:string = "plaster_03";
	public static BAND_AID_4:string = "plaster_04";
	public static BAND_AID_5:string = "plaster_05";
	public static BAND_AID_6:string = "plaster_06";
	public static BAND_AID_7:string = "plaster_07";
	public static BAND_AID_8:string = "plaster_08";
	public static BAND_AID_9:string = "plaster_09";

	// Lemonade constants
	public static LEMONADE_1:string = "saftevand_01";
	public static LEMONADE_2:string = "saftevand_02";
	public static LEMONADE_3:string = "saftevand_03";
	public static LEMONADE_4:string = "saftevand_04";
	public static LEMONADE_5:string = "saftevand_05";


	// Clothes constants
	public static CLOTHES_LOWER_1:string = "clothesLower_01";
	public static CLOTHES_LOWER_2:string = "clothesLower_02";
	public static CLOTHES_LOWER_3:string = "clothesLower_03";
	public static CLOTHES_LOWER_4:string = "clothesLower_04";
	public static CLOTHES_LOWER_5:string = "clothesLower_05";
	public static CLOTHES_LOWER_6:string = "clothesLower_06";
	public static CLOTHES_LOWER_7:string = "clothesLower_07";
	public static CLOTHES_LOWER_8:string = "clothesLower_08";
	public static CLOTHES_LOWER_9:string = "clothesLower_09";
	public static CLOTHES_LOWER_10:string = "clothesLower_10";
	public static CLOTHES_LOWER_11:string = "clothesLower_11";
	public static CLOTHES_LOWER_12:string = "clothesLower_12";

	public static CLOTHES_UPPER_1:string = "clothesUpper_01";
	public static CLOTHES_UPPER_2:string = "clothesUpper_02";
	public static CLOTHES_UPPER_3:string = "clothesUpper_03";
	public static CLOTHES_UPPER_4:string = "clothesUpper_04";
	public static CLOTHES_UPPER_5:string = "clothesUpper_05";
	public static CLOTHES_UPPER_6:string = "clothesUpper_06";
	public static CLOTHES_UPPER_7:string = "clothesUpper_07";
	public static CLOTHES_UPPER_8:string = "clothesUpper_08";
	public static CLOTHES_UPPER_9:string = "clothesUpper_09";
	public static CLOTHES_UPPER_10:string = "clothesUpper_10";
	public static CLOTHES_UPPER_11:string = "clothesUpper_11";
	public static CLOTHES_UPPER_12:string = "clothesUpper_12";

	public unlockedTools:any;
	public unlockedDiseases:any;
	public unlockedClothes:any;
	public unlockedBandage:any;
	public unlockedBandAid:any;
	public unlockedLemonade:any;

	constructor (unlockedTools:any, unlockedDiseases:any, unlockedClothes:any, unlockedBandage:any, unlockedBandAid:any, unlockedLemonade:any) {
		this.unlockedTools = unlockedTools;
		this.unlockedDiseases = unlockedDiseases;
		this.unlockedClothes = unlockedClothes;
		this.unlockedBandage = unlockedBandage;
		this.unlockedBandAid = unlockedBandAid;
		this.unlockedLemonade= unlockedLemonade;
	}
}
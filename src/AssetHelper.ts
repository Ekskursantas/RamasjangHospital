/**
 * Created by jakobnielsen on 20/09/2017.
 */
import { ProgressBar } from "src/hospital/utils/ProgressBar";
import { Main } from "src/Main";
import { Logger } from "src/loudmotion/utils/debug/Logger";
import { AssetLoader } from "src/hospital/utils/AssetLoader";
import { HospitalGameView } from "src/hospital/view/HospitalGameView";
import { Sprite, Container, Graphics} from "pixi.js";


export class AssetHelper extends HospitalGameView{

    private stage: Container;
    public static SOUNDS;
    private assets;
    private callback;
    private spriteSheetParsedCounter: number;
    private progressBar: ProgressBar;
    

    public parseSpriteSheets(_assets: any, callback: Function) {
        this.progressBar = new ProgressBar(AssetLoader.STAGE_WIDTH * .5, ProgressBar.PROGRESS_BAR_HEIGHT);
        this.addChild(this.progressBar);
        Logger.log(this, "loadAssets this.progressBar == " + this.progressBar);
        console.log("AssetLoader.loadSpriteSheets() - assets: " + _assets);
        this.assets = _assets;
        this.callback = callback;

        this.spriteSheetParsedCounter = 0;

        this.parseSpriteSheet("media/hospital/assets/textures/1x/ramasjangHospitalet_spriteAtlas_1");
        this.parseSpriteSheet("media/hospital/assets/textures/1x/ramasjangHospitalet_spriteAtlas_2");
        this.parseSpriteSheet("media/hospital/assets/textures/1x/ramasjangHospitalet_spriteAtlas_3");
        this.parseSpriteSheet("media/hospital/assets/textures/1x/ramasjangHospitalet_spriteAtlas_4");
        this.parseSpriteSheet("media/hospital/assets/textures/1x/ramasjangHospitalet_spriteAtlas_5");
        var sprite1 = PIXI.Texture.fromImage(Main.ASSETS["media/hospital/assets/textures/1x/forgiftning_tarm.png"]);
        var sprite2 = PIXI.Texture.fromImage(Main.ASSETS["media/hospital/assets/textures/1x/lungebetaendelse_lunger.png"]);
        var sprite3 = PIXI.Texture.fromImage(Main.ASSETS["media/hospital/assets/textures/1x/BackArrow.png"]);
        PIXI.Texture.addTextureToCache(sprite1, "forgiftning_tarm");
        PIXI.Texture.addTextureToCache(sprite1, "lungebetaendelse_lunger");
        PIXI.Texture.addTextureToCache(sprite1, "BackArrow");
    }

 
    private parseSpriteSheet(spriteSheetName: string) {
        console.log("AssetLoader.parseSpriteSheet() - spriteSheetName: " + spriteSheetName);


        // var atlasData = JSON.parse(_assets['textures/start/or_atlas_menu_0.json']);
        try {
            var atlasData = JSON.parse(this.assets[spriteSheetName + ".json"]);
        }
        catch (e) {
            console.log(e);
        }
        // console.log("atlasData.frames: " + atlasData.frames.game_interactable1.frame.y);


        var image = new Image();

        image.onload = () => {
            console.log("Image loaded");
            var baseTexture = new PIXI.BaseTexture(image);

            for (var nextFrame in atlasData.frames) {
                // console.log("nextFrame: " + nextFrame);
                // console.log("atlasData.frames[nextFrame]: " + atlasData.frames[nextFrame]);
                // console.log("atlasData.frames[nextFrame].frame: " + atlasData.frames[nextFrame].frame);
                // console.log("atlasData.frames[nextFrame].frame.w: " + atlasData.frames[nextFrame].frame.w);

                // var spriteTexture1 = new PIXI.Texture(baseTexture, new PIXI.Rectangle(atlasData.frames[nextFrame].frame.x, atlasData.frames[nextFrame].frame.y, atlasData.frames[nextFrame].frame.w, atlasData.frames[nextFrame].frame.h));
				var spriteTexture1 = new PIXI.Texture(baseTexture, new PIXI.Rectangle(atlasData.frames[nextFrame].frame.x, atlasData.frames[nextFrame].frame.y, atlasData.frames[nextFrame].frame.w, atlasData.frames[nextFrame].frame.h),
					new PIXI.Rectangle(atlasData.frames[nextFrame].spriteSourceSize.x, atlasData.frames[nextFrame].spriteSourceSize.y, atlasData.frames[nextFrame].spriteSourceSize.w, atlasData.frames[nextFrame].spriteSourceSize.h),
					new PIXI.Rectangle(0, 0, atlasData.frames[nextFrame].sourceSize.w, atlasData.frames[nextFrame].sourceSize.h));

				PIXI.Texture.addTextureToCache(spriteTexture1, nextFrame);
            }

            this.spriteSheetParsedCounter++

            if (this.spriteSheetParsedCounter > 4) {
                this.callback();
            }
        };
        image.src = this.assets[spriteSheetName + ".png"];

    }


    public mapSounds() {
        AssetHelper.SOUNDS = {};

        this.mapSound({path: "media/hospital/assets/audio/music/intro_music/intro_02.mp3", id: "intro" });
		this.mapSound({path: "media/hospital/assets/audio/music/waiting_room_music/fastguitar_loop_04.mp3", id:"waiting_room_loop"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/lung_sfx/lung_breath/lung_breath_sfx_loop_v02.mp3", id:"lung_breath_sfx_loop"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/done_v08.mp3", id:"done"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/done_patient_v01.mp3", id:"done_patient"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/negative_v05.mp3", id:"negative"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/positive_v03.mp3", id:"positive"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/klapsalve_03.mp3", id:"klapsalve"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/lung_sfx/die_bacteria/lung_die_v01.mp3", id:"lung_die"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/lung_sfx/hit_bacteria/lung_hit_v01.mp3", id:"lung_hit"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/lung_sfx/pinicillin/lung_pincillin_v01.mp3", id:"lung_pincillin"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/lung_sfx/split_bacteria/lung_split_v01.mp3", id:"lung_split"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/lung_sfx/lung_cough/lung_cough_v01.mp3", id:"lung_cough_v01"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/lung_sfx/lung_cough/lung_cough_v02.mp3", id:"lung_cough_v02"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/lung_sfx/lung_cough/lung_cough_v03.mp3", id:"lung_cough_v03"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/1_bruise_sfx/pincet_v04.mp3", id:"pincet_v04"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/knogle_v04.mp3", id:"knogle"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/salve_loop_v01.mp3", id:"salve_loop"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/gips_v02.mp3", id:"gips"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/four_scanner_noise_sounds/scanner_loop_v13.mp3", id:"scanner_loop"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/four_scanner_noise_sounds/scanner_noise_v05.mp3", id:"scanner_noise"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/poison_v02.mp3", id:"poison"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/pop_v02.mp3", id:"pop"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/drink_water_v03.mp3", id:"drink_water"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/toj_swipe_swoosh.mp3", id:"toj_swipe_swoosh"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/train_flute_01.mp3", id:"train_flute"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/picture_v01.mp3", id:"picture"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/clik_on_v01.mp3", id:"clik_on"});
		this.mapSound({path: "media/hospital/assets/audio/sfx/general_sfx/clik_off_v01.mp3", id:"clik_off"});


		this.mapSound({path: "media/hospital/assets/audio/speak/velkomst/mille_hej_og_velkommen_til_ramasjang_hospitalet_tryk_pa_start.mp3", id:"mille_hej_og_velkommen"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_det_rumler_i_min_mave_mon_det_er_noget_jeg_har_spist.mp3", id:"barn_det_rumler_i_min_mave_mon_det_er_noget_jeg_har_spist"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_jeg_er_blevet_stukket_af_en_bi_kan_du_hjaelpe_mig.mp3", id:"barn_jeg_er_blevet_stukket_af_en_bi_kan_du_hjaelpe_mig"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_jeg_har_braendt_mig_pa_en_gryde.mp3", id:"barn_jeg_har_braendt_mig_pa_en_gryde_skal_vi_komme_is_pa"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_jeg_har_slaet_min_hand.mp3", id:"barn_jeg_har_slaet_min_hand"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_jeg_hoster_rigtig_meget_mon_jeg_er_forkolet.mp3", id:"barn_jeg_hoster_rigtig_meget_mon_jeg_er_forkolet"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_min_arm_er_forstuvet_kan_du_reparere_den.mp3", id:"barn_min_arm_er_forstuvet_kan_du_reparere_den"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_min_arm_er_vist_braekket_fordi_jeg_vaeltede_pa_min_cykel.mp3", id:"barn_min_arm_er_vist_braekket_fordi_jeg_vaeltede_pa_min_cykel"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_jubii.mp3", id:"barn_jubii"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_arh_nej_hvornar_er_det_min_tur.mp3", id:"barn_arh_nej_hvornar_er_det_min_tur"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/barn/nyt_toej/barn_jubii_01.mp3", id:"barn_nyt_toj_1"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/barn/nyt_toej/barn_wow_02.mp3", id:"barn_nyt_toj_2"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/barn/nyt_toej/barn_wow_04.mp3", id:"barn_nyt_toj_3"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/mille/00_hjaelpe_speak_ventevaerelset/mille_der_er_nogle_born_der_er_blevet_syge.mp3", id:"mille_der_er_nogle_born_der_er_blevet_syge"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/mille/00_hjaelpe_speak_ventevaerelset/mille_kan_du_hjaelpe_en_af_bornene_ind_gennem_den_bla_dor.mp3", id:"mille_kan_du_hjaelpe_en_af_bornene_ind_gennem_den_bla_dor"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/mille/00_hjaelpe_speak_ventevaerelset/mille_er_du_klar_til_at_hjaelpe_en_til.mp3", id:"mille_er_du_klar_til_at_hjaelpe_en_til"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/mille/paaklaedning/mille_hvad_mon_der_er_i_kufferten.mp3", id:"mille_kufferten_1"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/mille/paaklaedning/mille_sikke_en_fin_kuffert_er_den_last.mp3", id:"mille_kufferten_2"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/mille/paaklaedning/mille_orh_sikke_noget_flot_toj.mp3", id:"mille_orh_sikke_noget_flot_toj"});
		this.mapSound({path: "media/hospital/assets/audio/speak/ventevaelse/mille/paaklaedning/mille_prov_at_give_bonene_noget_nyt_toj_pa.mp3", id:"mille_prov_at_give_bonene_noget_nyt_toj_pa"});


		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_av_for_en_hundestejle.mp3", id:"mille_av_for_en_hundestejle"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_det_er_altsa_mega_uheldigt.mp3", id:"mille_det_er_altsa_mega_uheldigt"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_host_host_vi_kan_alle_blive_syge.mp3", id:"mille_host_host_vi_kan_alle_blive_syge"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_na_da_her_er_en_der_har_brandt_sig.mp3", id:"mille_na_da_her_er_en_der_har_brandt_sig"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_nu_skal_du_bahandle_en_brakket_hand.mp3", id:"mille_nu_skal_du_bahandle_en_brakket_hand"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_prov_lige_at_leg_ninja.mp3", id:"mille_prov_lige_at_leg_ninja"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_puha_nogen_der_har_slaet_en_fis.mp3", id:"mille_puha_nogen_der_har_slaet_en_fis"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/mille_kan_du_se_maskinen_der_blinker.mp3", id:"mille_kan_du_se_maskinen_der_blinker"});


		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_prov_om_du_kan_hive_bistikkene_ud_med_pincetten.mp3", id:"mille_prov_om_du_kan_hive_bistikkene_ud_med_pincetten"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_pincetten_skal_have_fat_om_bistikket.mp3", id:"mille_pincetten_skal_have_fat_om_bistikket"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_godt_klaret_kan_du_fjerne_en_mere.mp3", id:"mille_godt_klaret_kan_du_fjerne_en_mere"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_perfekt_alle_bistikkene_er_vaek.mp3", id:"mille_perfekt_alle_bistikkene_er_vaek"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_uhh_hvot_sar_bare_klor_helt_vildt_meget_skynd_dig_at_smore_creme_pa.mp3", id:"mille_uhh_hvot_sar_bare_klor_helt_vildt_meget_skynd_dig_at_smore_creme_pa"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_perfekt_alle_bakterierne_er_vaek.mp3", id:"mille_perfekt_alle_bakterierne_er_vaek"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_pincetten_skal_have_fat_om_bakterien.mp3", id:"mille_pincetten_skal_have_fat_om_bakterien"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_prov_at_traekke_bakterierne_ud_med_pincetten.mp3", id:"mille_prov_at_traekke_bakterierne_ud_med_pincetten"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_flyt_glasset_hen_til_munden.mp3", id:"mille_flyt_glasset_hen_til_munden"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_brug_det_sorte_stykke_kul_til_at_samle_alle_de_gronne_bakterier.mp3", id:"mille_brug_det_sorte_stykke_kul_til_at_samle_alle_de_gronne_bakterier"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_hey_kan_du_ikke_lige_hjaelpe_med_at_samle_den_knogle_der_er_braekket.mp3", id:"mille_hey_kan_du_ikke_lige_hjaelpe_med_at_samle_den_knogle_der_er_braekket"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_knoglen_i_armen_er_braekket_prov_om_du_kan_samle_den_igen.mp3", id:"mille_knoglen_i_armen_er_braekket_prov_om_du_kan_samle_den_igen"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_knoglerne_er_helt_rodet_rundt.mp3", id:"mille_knoglerne_er_helt_rodet_rundt"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_tag_kluden_og_vask_rent_for_snavs.mp3", id:"mille_tag_kluden_og_vask_rent_for_snavs"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_hov_der_er_vist_lidt_snavs_tilbage.mp3", id:"mille_hov_der_er_vist_lidt_snavs_tilbage"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_tag_den_nederste_brik_prov_om_du_kan.mp3", id:"mille_tag_den_nederste_brik_prov_om_du_kan"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_tryk_pa_skalen.mp3", id:"mille_tryk_pa_skalen"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_sadan_det_var_du_rigtig_god_til.mp3", id:"mille_sadan_det_var_du_rigtig_god_til"});

		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_super_flot.mp3", id:"mille_super_flot"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_wow_du_er_god.mp3", id:"mille_wow_du_er_god"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_mega_sejt.mp3", id:"mille_mega_sejt"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_yey_det_er_flot.mp3", id:"mille_yey_det_er_flot"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/mille_arh_hvor_er_du_bare_dygtig.mp3", id:"done_1"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/mille_fantastisk_ej_hvor_er_du_bare_vildt_sej.mp3", id:"done_2"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/mille_godt_klaret.mp3", id:"done_3"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/mille_rigtig_flot.mp3", id:"done_4"});

		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/mille_skynd_dig_ud_i_ventevaerelset_der_er_helt_sikkert_flere_born.mp3", id:"mille_skynd_dig_ud_i_ventevaerelset_der_er_helt_sikkert_flere_born"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/ekstra/mille_aargh_et_skelet.mp3", id:"mille_aargh_et_skelet"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/ekstra/mille_sikke_et_muskel_bundt.mp3", id:"mille_sikke_et_muskel_bundt"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/ekstra/mille_vildt_er_det_tarmene.mp3", id:"mille_vildt_er_det_tarmene"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/ekstra/mille_wow_der_er_hjernen.mp3", id:"mille_wow_der_er_hjernen"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/scanner/mille_der_er_tis_inde_i_de_to_lange_ror.mp3", id:"mille_der_er_tis_inde_i_de_to_lange_ror"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/scanner/mille_noj_der_er_blodbaner_blodet_lober_frem.mp3", id:"mille_noj_der_er_blodbaner_blodet_lober_frem"});

		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/new/scanner/mille_den_kan_du_ikke_se_endnu_gor_flere_born_raske.mp3", id:"mille_hov_den_er_last"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/ekstra/mille_sadan_du_er_super.mp3", id:"mille_sadan_du_er_super"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/mille/ekstra/mille_wow_godt_klaret.mp3", id:"mille_wow_godt_klaret"});

		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/barn/new/barn_eyy_fik_du_nye_forbindinger_sadan_en_vil_jeg_ogsa_gerne_have_pa.mp3", id:"barn_unlock_bandage_1"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/barn/new/barn_sikke_en_flot_forbinding.mp3", id:"barn_unlock_bandage_2"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/barn/new/barn_sikke_noget_flot_gips_ma_jeg_prove.mp3", id:"barn_unlock_bandage_3"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/barn/new/barn_hov_var_det_saftevand_du_fik_ma_jeg_smage.mp3", id:"barn_unlock_saftevand"});
		this.mapSound({path: "media/hospital/assets/audio/speak/behandlingsrum/barn/new/barn_jubii_et_flot_plaster_ma_jeg_fa_det_pa.mp3", id:"barn_unlock_band_aid_1"});
       this.mapSound({ path: "media/hospital/assets/audio/speak/behandlingsrum/barn/new/barn_jubii_fine_plastre_gir_du_mig_et_pa.mp3", id: "barn_unlock_band_aid_2" });

       console.log(AssetHelper.SOUNDS);
    }

    private mapSound(soundObject) {
        AssetHelper.SOUNDS[soundObject.id] = soundObject.path;
    }


}
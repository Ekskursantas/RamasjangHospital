(function() {

    var api = null;
    var mainView;
    var cb;
    var allAssets = {};

        allAssets["media/hospital/assets/textures/1x/ramasjangHospitalet_spriteAtlas_1.json"] = "text";
        allAssets["media/hospital/assets/textures/1x/ramasjangHospitalet_spriteAtlas_2.json"] = "text";
        allAssets["media/hospital/assets/textures/1x/ramasjangHospitalet_spriteAtlas_3.json"] = "text";
        allAssets["media/hospital/assets/textures/1x/ramasjangHospitalet_spriteAtlas_4.json"] = "text";
        allAssets["media/hospital/assets/textures/1x/ramasjangHospitalet_spriteAtlas_5.json"] = "text";


        allAssets["media/hospital/assets/textures/1x/ramasjangHospitalet_spriteAtlas_1.png"] = "uri";
        allAssets["media/hospital/assets/textures/1x/ramasjangHospitalet_spriteAtlas_2.png"] = "uri";
        allAssets["media/hospital/assets/textures/1x/ramasjangHospitalet_spriteAtlas_3.png"] = "uri";
        allAssets["media/hospital/assets/textures/1x/ramasjangHospitalet_spriteAtlas_4.png"] = "uri";
        allAssets["media/hospital/assets/textures/1x/ramasjangHospitalet_spriteAtlas_5.png"] = "uri";

        allAssets["media/hospital/assets/textures/1x/BackArrow.png"] = "uri";
        allAssets["media/hospital/assets/textures/1x/forgiftning_tarm.png"] = "uri";
        allAssets["media/hospital/assets/textures/1x/lungebetaendelse_lunger.png"] = "uri";

        allAssets[  "media/hospital/assets/audio/music/intro_music/intro_02.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/music/waiting_room_music/fastguitar_loop_04.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/lung_sfx/lung_breath/lung_breath_sfx_loop_v02.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/done_v08.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/done_patient_v01.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/negative_v05.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/positive_v03.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/klapsalve_03.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/lung_sfx/die_bacteria/lung_die_v01.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/lung_sfx/hit_bacteria/lung_hit_v01.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/lung_sfx/pinicillin/lung_pincillin_v01.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/lung_sfx/split_bacteria/lung_split_v01.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/lung_sfx/lung_cough/lung_cough_v01.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/lung_sfx/lung_cough/lung_cough_v02.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/lung_sfx/lung_cough/lung_cough_v03.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/1_bruise_sfx/pincet_v04.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/knogle_v04.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/salve_loop_v01.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/gips_v02.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/four_scanner_noise_sounds/scanner_loop_v13.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/four_scanner_noise_sounds/scanner_noise_v05.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/poison_v02.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/pop_v02.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/drink_water_v03.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/toj_swipe_swoosh.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/train_flute_01.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/picture_v01.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/clik_on_v01.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/sfx/general_sfx/clik_off_v01.mp3"] = "uri";


        allAssets[ "media/hospital/assets/audio/speak/velkomst/mille_hej_og_velkommen_til_ramasjang_hospitalet_tryk_pa_start.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_det_rumler_i_min_mave_mon_det_er_noget_jeg_har_spist.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_jeg_er_blevet_stukket_af_en_bi_kan_du_hjaelpe_mig.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_jeg_har_braendt_mig_pa_en_gryde.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_jeg_har_slaet_min_hand.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_jeg_hoster_rigtig_meget_mon_jeg_er_forkolet.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_min_arm_er_forstuvet_kan_du_reparere_den.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_min_arm_er_vist_braekket_fordi_jeg_vaeltede_pa_min_cykel.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_jubii.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/barn/tryk_paa_patient/barn_arh_nej_hvornar_er_det_min_tur.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/barn/nyt_toej/barn_jubii_01.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/barn/nyt_toej/barn_wow_02.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/barn/nyt_toej/barn_wow_04.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/mille/00_hjaelpe_speak_ventevaerelset/mille_der_er_nogle_born_der_er_blevet_syge.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/mille/00_hjaelpe_speak_ventevaerelset/mille_kan_du_hjaelpe_en_af_bornene_ind_gennem_den_bla_dor.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/mille/00_hjaelpe_speak_ventevaerelset/mille_er_du_klar_til_at_hjaelpe_en_til.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/mille/paaklaedning/mille_hvad_mon_der_er_i_kufferten.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/mille/paaklaedning/mille_sikke_en_fin_kuffert_er_den_last.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/mille/paaklaedning/mille_orh_sikke_noget_flot_toj.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/ventevaelse/mille/paaklaedning/mille_prov_at_give_bonene_noget_nyt_toj_pa.mp3"] = "uri";


        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_av_for_en_hundestejle.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_det_er_altsa_mega_uheldigt.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_host_host_vi_kan_alle_blive_syge.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_na_da_her_er_en_der_har_brandt_sig.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_nu_skal_du_bahandle_en_brakket_hand.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_prov_lige_at_leg_ninja.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/forklaring_paa_sygdom/mille_puha_nogen_der_har_slaet_en_fis.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/mille_kan_du_se_maskinen_der_blinker.mp3"] = "uri";


        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_prov_om_du_kan_hive_bistikkene_ud_med_pincetten.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_pincetten_skal_have_fat_om_bistikket.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_godt_klaret_kan_du_fjerne_en_mere.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_perfekt_alle_bistikkene_er_vaek.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_uhh_hvot_sar_bare_klor_helt_vildt_meget_skynd_dig_at_smore_creme_pa.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_perfekt_alle_bakterierne_er_vaek.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_pincetten_skal_have_fat_om_bakterien.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_prov_at_traekke_bakterierne_ud_med_pincetten.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_flyt_glasset_hen_til_munden.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_brug_det_sorte_stykke_kul_til_at_samle_alle_de_gronne_bakterier.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_hey_kan_du_ikke_lige_hjaelpe_med_at_samle_den_knogle_der_er_braekket.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_knoglen_i_armen_er_braekket_prov_om_du_kan_samle_den_igen.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_knoglerne_er_helt_rodet_rundt.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_tag_kluden_og_vask_rent_for_snavs.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_hov_der_er_vist_lidt_snavs_tilbage.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_tag_den_nederste_brik_prov_om_du_kan.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_tryk_pa_skalen.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_sadan_det_var_du_rigtig_god_til.mp3"] = "uri";

        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_super_flot.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_wow_du_er_god.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_mega_sejt.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/hjaelp/mille_yey_det_er_flot.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/mille_arh_hvor_er_du_bare_dygtig.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/mille_fantastisk_ej_hvor_er_du_bare_vildt_sej.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/mille_godt_klaret.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/mille_rigtig_flot.mp3"] = "uri";

        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/mille_skynd_dig_ud_i_ventevaerelset_der_er_helt_sikkert_flere_born.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/ekstra/mille_aargh_et_skelet.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/ekstra/mille_sikke_et_muskel_bundt.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/ekstra/mille_vildt_er_det_tarmene.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/ekstra/mille_wow_der_er_hjernen.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/scanner/mille_der_er_tis_inde_i_de_to_lange_ror.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/scanner/mille_noj_der_er_blodbaner_blodet_lober_frem.mp3"] = "uri";

        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/new/scanner/mille_den_kan_du_ikke_se_endnu_gor_flere_born_raske.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/ekstra/mille_sadan_du_er_super.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/mille/ekstra/mille_wow_godt_klaret.mp3"] = "uri";

        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/barn/new/barn_eyy_fik_du_nye_forbindinger_sadan_en_vil_jeg_ogsa_gerne_have_pa.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/barn/new/barn_sikke_en_flot_forbinding.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/barn/new/barn_sikke_noget_flot_gips_ma_jeg_prove.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/barn/new/barn_hov_var_det_saftevand_du_fik_ma_jeg_smage.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/barn/new/barn_jubii_et_flot_plaster_ma_jeg_fa_det_pa.mp3"] = "uri";
        allAssets[ "media/hospital/assets/audio/speak/behandlingsrum/barn/new/barn_jubii_fine_plastre_gir_du_mig_et_pa.mp3"] = "uri";
        

        var assetLoaderTest;


        function main(platform, element, callback) {
            cb = callback;
            api = platform;
            console.log("In StartGame - main");
            initGame(element);
        }


        function initGame(element) {

            api.assets.getBundle(allAssets).then(function (assets) {

                console.log("in initGAme() - bundle loaded");
                
                var main = new EntryPoint.Main();
                main.start(assets, api, element, cb);
            });
        }

        return main;

})(); //END FUNCTION
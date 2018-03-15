import {Logger} from "src/loudmotion/utils/debug/Logger";
import AbstractSoundInstance = createjs.AbstractSoundInstance;
import {Main} from "../../Main";
import { AssetHelper } from "../../AssetHelper";
import { Helper } from "./Helper";

export class AudioPlayer {
    public static EVENT_SOUND_STARTED: string = "EVENT_SOUND_STARTED";
    public static EVENT_SOUND_FINISHED: string = "EVENT_SOUND_FINISHED";
    public static SOUND_COMPLETE: string = "end";
    public static SOUND_ERROR: string = "error";
    public static AUDIO_COMPLETE: string = "end";
    public static SOUND_GENERIC_BUTTON_PRESS: string = "GenericButtonPress";
    public static SOUND_SINGLE_PAGE_TURN: string = "SinglePageTurnSound";
    public static SOUND_MULTI_PAGE_TURN: string = "MultiPageTurnSound";
    public static SOUND_VO_HOME: string = "VOHomeSound";
    public static SOUND_VO_READ_AGAIN: string = "VOReadAgainSound";
    public static SOUND_VO_PREVIOUS_PAGE: string = "VOPreviousPage";
    public static SOUND_VO_NEXT_PAGE: string = "VONextPage";
    public static SOUND_POPUP_ANIMATION_AUDIO: string = "popup_animation_audio";
    public static SOUND_INTRO_MUSIC: string = "introMusic";
    public static NAV_BAR_BUTTON_SOUND: string = "NavBarButtonSound";

    public static STORY_BUTTON_READ_AND_PLAY: string = "button_readAndPlay";
    public static STORY_BUTTON_READ_IT_MYSELF: string = "button_readItMyself";
    public static STORY_BUTTON_READ_TO_ME: string = "button_readToMe";
    public static STORY_BUTTON_SING_TO_ME: string = "button_singToMe";
    public static STORY_BUTTON_SING_WITH_ME: string = "button_singWithMe";

    public static END_SCREEN_THE: string = "end_screen_the";
    public static END_SCREEN_END: string = "end_screen_end";
    public static END_SCREEN_THE_END: string = "end_screen_the_end";


    private static _instance: AudioPlayer;

    private _musicNames: any[];
    private _soundNames: any[];
    private _sounds: any[];
    private _music: any[];
    private _volume: number;


    constructor() {
        if (AudioPlayer._instance) {
            throw new Error("Error: Instantiation failed: Use AudioPlayer.getInstance() instead of new.");
        }
    }

    static getInstance(): AudioPlayer {
        if (AudioPlayer._instance == null) {
            AudioPlayer._instance = new AudioPlayer();
            AudioPlayer._instance.init();
        }

        return AudioPlayer._instance;
    }

    public static get instantiated(): boolean {
        return Boolean(AudioPlayer._instance);
    }

    private init(): void {
        // createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]); // createjs.WebAudioPlugin?

        this._soundNames = [];
        this._musicNames = [];
        this._sounds = [];
        this._music = [];
    }

    public playMusic(soundName: string, loops: number = 0, volume: number = this.volume, fadeTime: number = 0, starttime: number = 0): Howl {
        //Logger.log(this, "playSound()");
        var sound: Howl;
        var soundPath = AssetHelper.SOUNDS[soundName];
        // Logger.log(this, "soundPath: " + soundPath);
        sound = new Howl({
            src: this.clearAndSetMimeTypes(Main.ASSETS[soundPath], "mp3"),
            volume: volume,
            loop: loops && loops > 0,
            //onend: function () {
            //    AudioPlayer.getInstance().onSoundComplete(soundName, true);
            //}
        });
        sound.play();
        


        //} catch (error) {
        //    Logger.log(this, "playSound ERROR: " + error);
        //}
        
        this._musicNames.push(soundName)
        this._music.push(sound);

        return sound;
    }
    public playSound(soundName: string, loops: number = 0, volume: number = this.volume, fadeTime: number = 0, starttime: number = 0): Howl {
      //Logger.log(this, "playSound()");
        var sound: Howl;
        var soundPath = AssetHelper.SOUNDS[soundName];
       // Logger.log(this, "soundPath: " + soundPath);
        sound = new Howl({
                    src: this.clearAndSetMimeTypes(Main.ASSETS[soundPath], "mp3"),
                    volume: volume,
                    loop: loops && loops > 0,
                    //onend: function () {
                    //    AudioPlayer.getInstance().onSoundComplete(soundName, false);
                    //}
        });   
            sound.play();


        //} catch (error) {
        //    Logger.log(this, "playSound ERROR: " + error);
            //}
        this._soundNames.push(soundName);
        this._sounds.push(sound);

        return sound;
    }

    public NumberWrapper(value):number{
        return value;
    }
    //public playSound(soundName: string, loops: number = 0, volume: number = this.volume, fadeTime: number = 0, starttime: number = 0): AbstractSoundInstance {
    //    let sound: AbstractSoundInstance;
    //    //if (NetworkMonitor.getInstance().isOnline) {
    //    try {
    //        //sound = createjs.Sound.play(soundName, createjs.Sound.INTERRUPT_EARLY, 0, 0, loops);
    //        sound = createjs.Sound.play(soundName, createjs.Sound.INTERRUPT_EARLY, 0, 0, loops, volume);
    //        sound.uniqueId = soundName;
    //        // Logger.log(this, "playSound soundName == "+soundName+" :sound == "+sound);
    //        sound.on("complete", this.onSoundComplete);
    //    } catch (error) {
    //        Logger.log(this, "playSound ERROR");
    //    }
    //    //}

    //    this._soundNames.push(soundName);
    //    this._sounds.push(sound);
    //    return sound;
    //}
       public playRandomSound(sounds:string[]):Howl { //TODO
        let sound:Howl;
        let soundIndex:number = Helper.randomRange(0, sounds.length-1, true);
        sound = this.playSound(sounds[soundIndex]);
        // Logger.log(this, "playRandomSound  sound == "+sound+" : "+sound.uniqueId+" : soundIndex = "+soundIndex);
        return sound;
    }

    public changeMusicVolume = (newVolume:number):void => {
        let sound:Howl;
        for (let music of this._music) {
            sound = music as Howl;
            sound.volume(newVolume);
            // Logger.log(this, "changeMusicVolume  sound == "+sound+" : "+sound.uniqueId+" : sound.getVolume() = "+sound.getVolume());
        }
    }
    public fadeAllTo(volume: number, time: number): void {
        Logger.log(this, "fadeAllTo");
    }

    public tweenVolume(soundId: string, toVolume: number = 0, fadeTime: number = 1000) {
        let sound: Howl = this.getSoundByName(soundId);
        //Logger.log(this, "tweenVolume() - sound: " + sound);
        sound.fade(sound.volume(), toVolume, fadeTime);
        // sound.fade(1, 0, 1000);
    }

    public crossFade(fadeOutId: string, fadeInId: string, tweenDuration: number = 2000, fadeInVolume: number = 1, fadeInRepetitions: number = 1): void {
        Logger.log(this, "AudioPlayer.crossFade()")
        this.tweenVolume(fadeOutId, 0, tweenDuration);
        this.playSound(fadeInId, 999, 0);
        this.tweenVolume(fadeInId, fadeInVolume, tweenDuration);
    }


    public stopSound(soundName: string): void {
        let sound: Howl = this.getSoundByName(soundName);
        // Logger.log(this, "stopSound sound == "+sound);
        if (sound != null) {
            sound.stop();
        }
    }

    //public stopAllSounds(): void {
    //    Logger.log(this, "stopAllSounds AudioPlayer");
    //    // createjs.Sound.stop();
    //    Howler.unload();
    //}
    public stopAllSounds(stopMusic: boolean = false): void {
        // Logger.log(this, "stopAllSounds AudioPlayer");
        // createjs.Sound.stop();
        var sound: Howl;
        for (var soundToStop of this._sounds) {
            sound = soundToStop as Howl;
            sound.stop();
             //Logger.log(this, "stopAllSounds  sound == "+sound+" : sound.stopAllSounds");
        }
        if (stopMusic) {
            var music: Howl;
            for (var musicToStop of this._music) {
                music = musicToStop as Howl;
                music.stop();
                 //Logger.log(this, "stopAllSounds  music == "+music+" : music.stopAllSounds");
            }
        }
    }
    // public pauseSound(soundName: string): void {
    //     let sound: AbstractSoundInstance = this.getSoundByName(soundName);
    //     // Logger.log(this, "AudioPlayer pauseSound : getSoundByName sound == "+sound);
    //     if (!sound) {
    //         sound = this.playSound(soundName);
    //     } else {
    //         if (sound.playState == createjs.Sound.PLAY_FINISHED) {
    //             sound = this.playSound(soundName);
    //         } else {
    //             if (!sound.paused) {
    //                 sound.paused = true;
    //             } else {
    //                 sound.paused = false;
    //             }
    //         }
    //     }
    // }

    public getSoundByName(name: string): Howl {
        let sound: Howl = this._sounds[this._soundNames.lastIndexOf(name)];
        // Logger.log(this, "AudioPlayer getSoundByName sound == "+sound);
        return sound;
    }


    public removeSoundByName(name: string): void {
        let index: number = this._soundNames.lastIndexOf(name);
        if (index > -1) {
            this._soundNames.splice(index, 1);
            this._sounds.splice(index, 1);
        }
    }
    public removeMusicByName(name: string): void {
        let index: number = this._musicNames.lastIndexOf(name);
        if (index > -1) {
            this._musicNames.splice(index, 1);
            this._music.splice(index, 1);
        }
    }

    public get volume(): number {
        return this._volume;
    }


    public set volume(pVolume: number) {
        this._volume = pVolume;
    }


    /**
     *
     * Private functions
     *
     */


    private onSoundComplete(e: string, type: boolean): void {
        // Logger.log(this, "AudioPlayer onSOundComplete");
        // Logger.log(this, "AudioPlayer onSOundComplete e.uni "+e.target);
        if (type) {
            this.removeMusicByName(e);
        }
        else {
            this.removeSoundByName(e);
        }
    }

    public destroy(): void {
        Logger.log(this, "AudioPlayer destroy");
        try {
            this.stopAllSounds();
        } catch (error) {
            Logger.log(this, "ERROR AudioPlayer stopAllSounds");
        }
        try {
            createjs.Sound.removeAllSounds();
        } catch (error) {
            Logger.log(this, "ERROR AudioPlayer createjs.Sound.removeAllSounds();");
        }

        AudioPlayer._instance = null;
    }


    private clearAndSetMimeTypes(obj, extension) {

        var replacedText = "data:;base64,";
        var convertedText;

        switch (extension) {

            case "ogg":
                convertedText = obj.replace(replacedText, "data:audio/ogg;base64,");
                break;

            case "m4a":
                convertedText = obj.replace(replacedText, "data:audio/m4a;base64,");
                break;


            default:
                convertedText = obj.replace(replacedText, "data:audio/mp3;base64,");
                break;
        }


        return convertedText;


    }
}

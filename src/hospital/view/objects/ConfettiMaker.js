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
var ConfettiBit_1 = require("./ConfettiBit");
var AssetLoader_1 = require("../../utils/AssetLoader");
var pixi_js_1 = require("pixi.js");
var Logger_1 = require("../../../loudmotion/utils/debug/Logger");
var ConfettiMaker = /** @class */ (function (_super) {
    __extends(ConfettiMaker, _super);
    function ConfettiMaker() {
        var _this = _super.call(this) || this;
        _this.animateConfetti = function (deltaTime) {
            if (!_this.firstFrameElapsed) {
                _this.firstFrameElapsed = true;
                return;
            }
            var bitsToAnimateLength = _this.bitsToAnimate.length;
            for (var i = 0; i < bitsToAnimateLength; i++) {
                var bitToAnimate = _this.bitsToAnimate[i];
                bitToAnimate.y += bitToAnimate.speed * _this.elapsed;
                if (bitToAnimate.y > AssetLoader_1.AssetLoader.STAGE_HEIGHT) {
                    bitToAnimate.y = -10;
                }
            }
        };
        _this.onEnterFrame = function (deltaTime) {
            _this.checkElapsed();
        };
        _this.timeCurrent = 0;
        // addEventListener(Event.ENTER_FRAME, onEnterFrame); //TODO add tick / enterFrame
        _this.onAddedToStage();
        return _this;
    }
    ConfettiMaker.prototype.onAddedToStage = function () {
        this.createKonfetti();
        pixi_js_1.ticker.shared.add(this.onEnterFrame, this);
        pixi_js_1.ticker.shared.add(this.animateConfetti, this);
    };
    ConfettiMaker.prototype.createKonfetti = function () {
        // Bits
        this.bitsToAnimate = [];
        for (var i = 0; i < 100; i++) {
            var textureName = void 0;
            if (i < 10) {
                textureName = "konfetti_g";
            }
            else if (i < 20) {
                textureName = "konfetti_h";
            }
            else if (i < 30) {
                textureName = "konfetti_i";
            }
            else if (i < 40) {
                textureName = "konfetti_j";
            }
            else if (i < 50) {
                textureName = "konfetti_k";
            }
            else if (i < 60) {
                textureName = "konfetti_l";
            }
            else if (i < 70) {
                textureName = "konfetti_m";
            }
            else if (i < 80) {
                textureName = "konfetti_n";
            }
            else if (i < 100) {
                textureName = "konfetti_o";
            }
            var confettiBitImage = pixi_js_1.Sprite.fromFrame(textureName);
            var confettiBit = new ConfettiBit_1.ConfettiBit();
            confettiBit.addChild(confettiBitImage);
            confettiBit.speed = 2 + Math.random() * 2;
            this.addChild(confettiBit);
            confettiBit.x = Math.round(Math.random() * AssetLoader_1.AssetLoader.STAGE_WIDTH);
            confettiBit.y = -10 - Math.round(Math.random() * AssetLoader_1.AssetLoader.STAGE_HEIGHT);
            this.bitsToAnimate.push(confettiBit);
        }
        // Clips
        for (var j = 0; j < 60; j++) {
            if (j < 10) {
                var textureClip = "konfetti_a_ani_00";
                var clipsToAnimate = [];
                for (var i = 1; i < 5; i++) {
                    var val = i < 10 ? '0' + i : i;
                    // magically works since the spritesheet was loaded with the pixi loader
                    clipsToAnimate.push(pixi_js_1.Texture.fromFrame(textureClip + val));
                }
                this.addConfettiClip(clipsToAnimate);
            }
            else if (j < 20) {
                var textureClip = "konfetti_b_ani_00";
                var clipsToAnimate = [];
                for (var i = 1; i < 5; i++) {
                    var val = i < 10 ? '0' + i : i;
                    // magically works since the spritesheet was loaded with the pixi loader
                    clipsToAnimate.push(pixi_js_1.Texture.fromFrame(textureClip + val));
                }
                this.addConfettiClip(clipsToAnimate);
            }
            else if (j < 30) {
                var textureClip = "konfetti_c_ani_00";
                var clipsToAnimate = [];
                for (var i = 1; i < 5; i++) {
                    var val = i < 10 ? '0' + i : i;
                    // magically works since the spritesheet was loaded with the pixi loader
                    clipsToAnimate.push(pixi_js_1.Texture.fromFrame(textureClip + val));
                }
                this.addConfettiClip(clipsToAnimate);
            }
            else if (j < 40) {
                var textureClip = "konfetti_d_ani_00";
                var clipsToAnimate = [];
                for (var i = 1; i < 6; i++) {
                    var val = i < 10 ? '0' + i : i;
                    // magically works since the spritesheet was loaded with the pixi loader
                    clipsToAnimate.push(pixi_js_1.Texture.fromFrame(textureClip + val));
                }
                this.addConfettiClip(clipsToAnimate);
            }
            else if (j < 50) {
                var textureClip = "konfetti_e_ani_00";
                var clipsToAnimate = [];
                for (var i = 1; i < 5; i++) {
                    var val = i < 10 ? '0' + i : i;
                    // magically works since the spritesheet was loaded with the pixi loader
                    clipsToAnimate.push(pixi_js_1.Texture.fromFrame(textureClip + val));
                }
                this.addConfettiClip(clipsToAnimate);
            }
            else if (j < 60) {
                var textureClip = "konfetti_f_ani_00";
                var clipsToAnimate = [];
                for (var i = 1; i < 5; i++) {
                    var val = i < 10 ? '0' + i : i;
                    // magically works since the spritesheet was loaded with the pixi loader
                    clipsToAnimate.push(pixi_js_1.Texture.fromFrame(textureClip + val));
                }
                this.addConfettiClip(clipsToAnimate);
            }
        }
    };
    ConfettiMaker.prototype.addConfettiClip = function (clip) {
        var confettiClip = new pixi_js_1.extras.AnimatedSprite(clip);
        confettiClip.animationSpeed = .1;
        var confettiBitClip = new ConfettiBit_1.ConfettiBit();
        confettiBitClip.addChild(confettiClip);
        confettiBitClip.speed = 2 + Math.random() * 2;
        this.addChild(confettiBitClip);
        confettiClip.play();
        confettiBitClip.x = Math.round(Math.random() * AssetLoader_1.AssetLoader.STAGE_WIDTH);
        confettiBitClip.y = -10 - Math.round(Math.random() * AssetLoader_1.AssetLoader.STAGE_HEIGHT);
        this.bitsToAnimate.push(confettiBitClip);
    };
    ConfettiMaker.prototype.checkElapsed = function () {
        this.timePrevious = this.timeCurrent;
        // this.timeCurrent = getTimer();
        this.timeCurrent = new Date().getTime();
        this.elapsed = (this.timeCurrent - this.timePrevious) * 0.1;
    };
    ConfettiMaker.prototype.destroy = function () {
        if (pixi_js_1.ticker != null) {
            pixi_js_1.ticker.shared.remove(this.onEnterFrame, this);
            pixi_js_1.ticker.shared.remove(this.animateConfetti, this);
        }
        Logger_1.Logger.log(this, "ConfettiMaker destroy  this.children.length == " + this.children.length);
        this.removeChildren(0, this.children.length - 1);
        Logger_1.Logger.log(this, "ConfettiMaker destroy  AFTER this.children.length == " + this.children.length);
    };
    return ConfettiMaker;
}(pixi_js_1.Sprite));
exports.ConfettiMaker = ConfettiMaker;
//# sourceMappingURL=ConfettiMaker.js.map
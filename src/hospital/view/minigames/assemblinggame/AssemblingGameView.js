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
var HospitalGameView_1 = require("../../HospitalGameView");
var AssemblyPart_1 = require("./objects/AssemblyPart");
var Logger_1 = require("../../../../loudmotion/utils/debug/Logger");
var AssetLoader_1 = require("../../../utils/AssetLoader");
var pixi_js_1 = require("pixi.js");
var AssemblingGameView = /** @class */ (function (_super) {
    __extends(AssemblingGameView, _super);
    function AssemblingGameView() {
        var _this = _super.call(this) || this;
        _this.pieceTouched = function (data) {
            _this.touchedPart = data;
            Logger_1.Logger.log(_this, "AssemblingGameView pieceTouched " + _this.touchedPart);
            // this.parent.setChildIndex(this, this.parent.children.length-1);
        };
        _this.touchDone = function () {
            _this.mouseDown = false;
            Logger_1.Logger.log(_this, "AssemblingGameView touchDone");
            if (_this.assemblyPart_2.x - _this.assemblyPart_1.x > _this.assemblyPart_1.width && _this.assemblyPart_1.y < _this.assemblyPart_2.y + 10 && _this.assemblyPart_1.y > _this.assemblyPart_2.y - 10 && _this.bothPartsStraight()) {
                _this.snapPartsAndEndGame();
            }
            else {
                TweenLite.killTweensOf(_this.touchedPart);
                TweenLite.to(_this.touchedPart, .3, { x: _this.touchedPart.initialPosition.x });
                _this.touchedPart.stopMovingRandomly();
            }
        };
        return _this;
    }
    AssemblingGameView.prototype.init = function () {
        this.name = "AssemblingGameView";
        this.drawScene();
        this.startGame();
    };
    AssemblingGameView.prototype.drawScene = function () {
        this.assemblyPart_1 = new AssemblyPart_1.AssemblyPart("brokenBonesGame_boneRadius_complete", new pixi_js_1.Point(AssetLoader_1.AssetLoader.STAGE_WIDTH / 2 - 200, AssetLoader_1.AssetLoader.STAGE_WIDTH / 2), "assemblyPart_1");
        this.addChild(this.assemblyPart_1);
        this.assemblyPart_2 = new AssemblyPart_1.AssemblyPart("brokenBonesGame_boneRadius_complete", new pixi_js_1.Point(this.assemblyPart_1.x + 400, this.assemblyPart_1.y - 100), "assemblyPart_2");
        this.addChild(this.assemblyPart_2);
    };
    AssemblingGameView.prototype.startGame = function () {
        Logger_1.Logger.log(this, "AssemblingGameView");
        this.assemblyPart_1.signalPart.add(this.pieceTouched);
        this.assemblyPart_1.signalPartTouchDone.add(this.touchDone);
        this.assemblyPart_2.signalPart.add(this.pieceTouched);
        this.assemblyPart_2.signalPartTouchDone.add(this.touchDone);
    };
    AssemblingGameView.prototype.bothPartsStraight = function () {
        return this.assemblyPart_1.rotation < 0.05 && this.assemblyPart_2.rotation < 0.05;
    };
    AssemblingGameView.prototype.snapPartsAndEndGame = function () {
        this.assemblyPart_1.signalPart.remove(this.pieceTouched);
        this.assemblyPart_1.signalPartTouchDone.remove(this.touchDone);
        this.assemblyPart_2.signalPart.remove(this.pieceTouched);
        this.assemblyPart_2.signalPartTouchDone.remove(this.touchDone);
        TweenLite.killTweensOf(this.assemblyPart_1);
        TweenLite.killTweensOf(this.assemblyPart_2);
        this.assemblyPart_1.stopMovingRandomly();
        this.assemblyPart_2.stopMovingRandomly();
        TweenLite.to(this.assemblyPart_2, .3, { x: this.assemblyPart_1.x + this.assemblyPart_1.width, y: this.assemblyPart_1.y });
    };
    AssemblingGameView.prototype.destroy = function () {
        if (this.assemblyPart_1 != null) {
            this.assemblyPart_1.signalPart.remove(this.pieceTouched);
            this.assemblyPart_1.signalPartTouchDone.remove(this.touchDone);
            this.removeChild(this.assemblyPart_1);
            this.assemblyPart_1 = null;
        }
        if (this.assemblyPart_2 != null) {
            this.assemblyPart_2.signalPart.remove(this.pieceTouched);
            this.assemblyPart_2.signalPartTouchDone.remove(this.touchDone);
            this.removeChild(this.assemblyPart_2);
            this.assemblyPart_2 = null;
        }
        _super.prototype.destroy.call(this);
    };
    AssemblingGameView.PART_TOUCH_OFFSET = -60;
    return AssemblingGameView;
}(HospitalGameView_1.HospitalGameView));
exports.AssemblingGameView = AssemblingGameView;
//# sourceMappingURL=AssemblingGameView.js.map
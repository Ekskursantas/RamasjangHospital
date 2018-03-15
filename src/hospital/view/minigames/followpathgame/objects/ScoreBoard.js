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
var AssetLoader_1 = require("../../../../utils/AssetLoader");
var pixi_js_1 = require("pixi.js");
var Logger_1 = require("../../../../../loudmotion/utils/debug/Logger");
var ScoreBoard = /** @class */ (function (_super) {
    __extends(ScoreBoard, _super);
    function ScoreBoard(numOfSlots) {
        var _this = _super.call(this) || this;
        _this.numOfSlots = numOfSlots;
        _this.onAddedToStage();
        return _this;
    }
    ScoreBoard.prototype.onAddedToStage = function () {
        this.createScoreBoardArt();
    };
    ScoreBoard.prototype.createScoreBoardArt = function () {
        this.background = new pixi_js_1.Graphics();
        this.background.beginFill(0x06a484);
        // set the line style to have a width of 5 and set the color to red
        // this.background.lineStyle(5, 0xFF0000);
        // draw a rectangle
        this.background.drawRect(0, 0, AssetLoader_1.AssetLoader.STAGE_WIDTH, 76);
        this.addChild(this.background);
        // this.background = color == 0x06a484;
        this.background.alpha = 0.2;
        this.slots = [];
        for (var i = 0; i < this.numOfSlots; i++) {
            this.imageEmpty = pixi_js_1.Sprite.fromFrame("forgiftning_gift_01");
            var slot = new pixi_js_1.Sprite();
            slot.addChild(this.imageEmpty);
            // this.addChild(slot);
            this.addChild(slot);
            //				slot.x = i * slot.width + 20;
            //				slot.x = i * slot.width + 20 + (StarlingHelper.rightXOffsetVirtual - (numOfSlots * (slot.width + 20)));
            // 			slot.x = StarlingHelper.rightXOffsetVirtual - ((slot.width ) * numOfSlots + 30) +  i * slot.width + 20;
            // 			slot.x = ((imageEmpty.width) * this.numOfSlots + 10) + i * imageEmpty.width + 20;
            slot.x = i * this.imageEmpty.width + 20;
            slot.alpha = 0.2;
            this.slots.push(slot);
        }
    };
    ScoreBoard.prototype.getWidth = function () {
        return (this.imageEmpty.width * this.numOfSlots + (this.numOfSlots * 20));
    };
    ScoreBoard.prototype.update = function (collectablesCollected) {
        // let slot:Sprite = this.slots[collectablesCollected - 1] as Sprite;
        var editNum = collectablesCollected - 1;
        Logger_1.Logger.log(this, "ScoreBoard collectablesCollected == " + collectablesCollected + " : editNum == " + editNum);
        var slot = this.slots[editNum];
        slot.alpha = 1;
        //			slot.addChild(new Image(Config.assetManager.getTexture("gui_IconBunnyFull"))); //TODO?
    };
    ScoreBoard.prototype.destroy = function () {
        // TODO need to flesh out
    };
    return ScoreBoard;
}(pixi_js_1.Sprite));
exports.ScoreBoard = ScoreBoard;
//# sourceMappingURL=ScoreBoard.js.map
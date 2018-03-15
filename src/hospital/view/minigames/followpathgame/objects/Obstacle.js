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
var pixi_js_1 = require("pixi.js");
var Helper_1 = require("../../../../../loudmotion/utils/Helper");
var HospitalGameView_1 = require("../../../HospitalGameView");
var Obstacle = /** @class */ (function (_super) {
    __extends(Obstacle, _super);
    function Obstacle(texture) {
        var _this = _super.call(this) || this;
        _this.textureName = texture;
        _this._speed = Math.random() * 2 + 3;
        _this.changeDirection();
        _this.onAddedToStage();
        return _this;
    }
    Object.defineProperty(Obstacle.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        set: function (value) {
            this._direction = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Obstacle.prototype, "speed", {
        get: function () {
            return this._speed;
        },
        set: function (value) {
            this._speed = value;
        },
        enumerable: true,
        configurable: true
    });
    Obstacle.prototype.changeDirection = function () {
        this._direction = Helper_1.Helper.randomRange(160, 200) * (180 * (Math.PI / 180));
    };
    Obstacle.prototype.onAddedToStage = function () {
        this.createObstacleArt();
    };
    Obstacle.prototype.createObstacleArt = function () {
        this.obstacleImage = pixi_js_1.Sprite.fromFrame(this.textureName);
        this.rectCover = new pixi_js_1.Graphics(); //TODO temp to check area
        this.rectCover.beginFill(0xFFFFFF);
        this.rectCover.alpha = HospitalGameView_1.HospitalGameView.RECT_COVER_ALPHA;
        this.addChild(this.rectCover);
        this.rectCover.drawRect(this.obstacleImage.x, this.obstacleImage.y, this.obstacleImage.width, this.obstacleImage.height);
        this.addChild(this.obstacleImage);
        this.pivot.x = this.obstacleImage.width * .5;
        this.pivot.y = this.obstacleImage.height * .5;
    };
    Object.defineProperty(Obstacle.prototype, "bounds", {
        get: function () {
            return this.obstacleImage.getBounds();
        },
        enumerable: true,
        configurable: true
    });
    Obstacle.prototype.destroy = function () {
        if (this.obstacleImage != null) {
            this.removeChild(this.obstacleImage);
            this.obstacleImage = null;
        }
        if (this.rectCover != null) {
            this.removeChild(this.rectCover);
            this.rectCover = null;
        }
    };
    return Obstacle;
}(pixi_js_1.Sprite));
exports.Obstacle = Obstacle;
//# sourceMappingURL=Obstacle.js.map
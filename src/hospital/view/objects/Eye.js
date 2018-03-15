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
var AssetLoader_1 = require("../../utils/AssetLoader");
var TouchLoudEvent_1 = require("../../../loudmotion/events/TouchLoudEvent");
var pixi_js_1 = require("pixi.js");
var Logger_1 = require("../../../loudmotion/utils/debug/Logger");
var Helper_1 = require("../../../loudmotion/utils/Helper");
var Eye = /** @class */ (function (_super) {
    __extends(Eye, _super);
    function Eye(eyeColorType) {
        var _this = _super.call(this) || this;
        _this.stageTouchListener = function (event) {
            var mousePosition = event.data.getLocalPosition(AssetLoader_1.AssetLoader.getInstance().assetCanvas);
            _this.lookAtPoint(mousePosition);
        };
        _this.eyeColorType = eyeColorType;
        _this.onAddedToStage();
        return _this;
    }
    Eye.prototype.onAddedToStage = function () {
        this.createEyeArt();
        this.initStageTouchListener();
    };
    Eye.prototype.createEyeArt = function () {
        this.apple = new pixi_js_1.Sprite();
        var appleImage = pixi_js_1.Sprite.fromFrame("kid_eyes");
        this.apple.addChild(appleImage);
        appleImage.x = -(appleImage.width * .5);
        appleImage.y = -(appleImage.height * .5);
        this.addChild(this.apple);
        this.irisTarget = new pixi_js_1.Sprite();
        this.addChild(this.irisTarget);
        this.iris = new pixi_js_1.Sprite();
        var irisImage = pixi_js_1.Sprite.fromFrame("kid_iris_0" + this.eyeColorType);
        this.iris.addChild(irisImage);
        irisImage.x = -(irisImage.width * .5);
        irisImage.y = -(irisImage.height * .5);
        this.irisTarget.addChild(this.iris);
    };
    Eye.prototype.initStageTouchListener = function () {
        Logger_1.Logger.log(this, "Eye initStageTouchListener");
        AssetLoader_1.AssetLoader.getInstance().assetCanvas.on(TouchLoudEvent_1.TouchEvent.TOUCH, this.stageTouchListener);
        AssetLoader_1.AssetLoader.getInstance().assetCanvas.on(TouchLoudEvent_1.TouchEvent.TOUCH_END, this.stageTouchListener);
        AssetLoader_1.AssetLoader.getInstance().assetCanvas.on(TouchLoudEvent_1.TouchEvent.TOUCH_MOVE, this.stageTouchListener);
    };
    Eye.prototype.lookAtPoint = function (pointToLookAt) {
        var pointThisGlobal = this.getGlobalPosition(new pixi_js_1.Point(0, 0));
        var distance = Helper_1.Helper.lineDistance(pointThisGlobal, pointToLookAt);
        var deltaX = pointToLookAt.x - pointThisGlobal.x;
        var deltaY = pointToLookAt.y - pointThisGlobal.y;
        var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        var angleRadians = Math.atan2(deltaY, deltaX); // In radians
        this.lookInDirection(distance, angleRadians);
    };
    Eye.prototype.lookInDirection = function (distance, angleRadians) {
        var irisDistance = distance / 40;
        if (irisDistance > 15) {
            irisDistance = 15;
        }
        var irisDestX = Math.cos(angleRadians) * irisDistance;
        var irisDestY = Math.sin(angleRadians) * irisDistance;
        TweenLite.to(this.iris, 0.5, { x: irisDestX, y: irisDestY });
    };
    return Eye;
}(pixi_js_1.Sprite));
exports.Eye = Eye;
//# sourceMappingURL=Eye.js.map
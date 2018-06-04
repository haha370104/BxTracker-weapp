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
var Tracker_1 = require("./Tracker");
var BxTracker = /** @class */ (function (_super) {
    __extends(BxTracker, _super);
    function BxTracker(serverURL, patchCount, maxNumberOfTrackInRequest, customRequest, distinctID) {
        var _this = _super.call(this, serverURL, patchCount, maxNumberOfTrackInRequest, customRequest, distinctID) || this;
        var systemInfo = wx.getSystemInfoSync();
        _this.extraInfo.$model = systemInfo['model'];
        _this.extraInfo.$screen_width = Number(systemInfo['windowWidth']);
        _this.extraInfo.$screen_height = Number(systemInfo['windowHeight']);
        _this.extraInfo.$os = systemInfo['system'].split(' ')[0];
        _this.extraInfo.$os_version = systemInfo['system'].split(' ')[1];
        _this.extraInfo.$env_version = systemInfo['version'];
        return _this;
    }
    return BxTracker;
}(Tracker_1.Tracker));
exports.BxTracker = BxTracker;
//# sourceMappingURL=BxTracker.js.map
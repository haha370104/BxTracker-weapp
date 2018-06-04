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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Tracker_1 = require("./Tracker");
var BxTracker = /** @class */ (function (_super) {
    __extends(BxTracker, _super);
    function BxTracker(serverURL, patchCount, maxNumberOfTrackInRequest, customRequest, distinctID) {
        var _this = _super.call(this, serverURL, patchCount, maxNumberOfTrackInRequest, customRequest, distinctID) || this;
        _this.getSystemInfoComplete = false;
        _this.systemInfo = {};
        _this.getSystemInfoQueue = [];
        _this.initSystemInfo();
        return _this;
    }
    BxTracker.prototype.initSystemInfo = function () {
        var _this = this;
        var systemInfo = wx.getSystemInfoSync();
        this.systemInfo.$model = systemInfo['model'];
        this.systemInfo.$screen_width = Number(systemInfo['windowWidth']);
        this.systemInfo.$screen_height = Number(systemInfo['windowHeight']);
        this.systemInfo.$os = systemInfo['system'].split(' ')[0];
        this.systemInfo.$os_version = systemInfo['system'].split(' ')[1];
        this.systemInfo.$env_version = systemInfo['version'];
        wx.getNetworkType({
            success: function (res) {
                _this.globalProperityes.$network_type = res.networkType;
            },
            complete: function () {
                _this.getSystemInfoComplete = true;
            }
        });
    };
    BxTracker.prototype.getSystemInfo = function (complete) {
        var _this = this;
        if (!this.getSystemInfoComplete) {
            this.getSystemInfoQueue.push(complete);
        }
        else {
            var consume = function () {
                _this.getSystemInfoQueue.forEach(function (value) {
                    value(_this.systemInfo);
                });
                _this.getSystemInfoQueue = [];
            };
            complete(this.systemInfo);
            consume();
        }
    };
    BxTracker.prototype.trackMessage = function (event, detail) {
        var _this = this;
        this.getSystemInfo(function (systemInfo) {
            _this.sender.addTrack({
                properties: __assign({}, systemInfo, _this.globalProperityes, detail),
                event: event,
                distinct_id: _this.distinctID,
            });
        });
    };
    return BxTracker;
}(Tracker_1.Tracker));
exports.BxTracker = BxTracker;
//# sourceMappingURL=BxTracker.js.map
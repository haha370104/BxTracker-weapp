"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TrackSender_1 = require("./TrackSender");
var Wrapper_1 = require("./Wrapper");
var Tracker = /** @class */ (function () {
    function Tracker(serverURL, patchCount, maxNumberOfTrackInRequest, customRequest) {
        this.extraInfo = {};
        this.serverURL = '';
        this.globalProperityes = {};
        this.serverURL = serverURL;
        this.sender = new TrackSender_1.TrackSender(serverURL, patchCount || 10, maxNumberOfTrackInRequest || 50, customRequest || wx.request);
    }
    Tracker.configure = function (config) {
        if (this.instance) {
            throw new Error('has been configured');
        }
        this.instance = new this(config.serverURL, config.patchCount, config.maxNumberOfTrackInRequest, config.customRequest);
    };
    Tracker.sharedInstance = function () {
        if (!this.instance) {
            throw new Error('has not been configured!');
        }
        return this.instance;
    };
    Tracker.prototype.enableAutoPageViewEvent = function (pageView) {
        var pageConstructor = Page;
        Page = function (page) {
            var _this = this;
            if (pageView) {
                var properties_1 = pageView(page);
                Wrapper_1.objectMethodWrapper(page, 'onLoad', function () {
                    _this.trackMessage(properties_1.message, properties_1.detail);
                });
            }
            return pageConstructor(page);
        };
    };
    Tracker.prototype.setGlobalProperties = function (globalProperties) {
        this.globalProperityes = globalProperties || {};
    };
    Tracker.prototype.trackMessage = function (event, detail) {
        this.sender.addTrack({
            properties: __assign({}, this.extraInfo, this.globalProperityes, detail),
            event: event,
        });
    };
    return Tracker;
}());
exports.Tracker = Tracker;
//# sourceMappingURL=Tracker.js.map
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
var Storage_1 = require("./Storage");
var TrackSender_1 = require("./TrackSender");
var Wrapper_1 = require("./Wrapper");
var TrackerStoragePrefixKey = 'TrackerStoragePrefixKey';
var TrackerDistinctIDKey = 'TrackerDistinctIDKey';
var Tracker = /** @class */ (function () {
    function Tracker(serverURL, patchCount, maxNumberOfTrackInRequest, customRequest, distinctID) {
        this.extraInfo = {};
        this.serverURL = '';
        this.distinctID = '';
        this.globalProperityes = {};
        this.serverURL = serverURL;
        this.storageManager = new Storage_1.Storage(TrackerStoragePrefixKey);
        if (distinctID) {
            this.setDistinctID(distinctID);
            this.distinctID = distinctID;
        }
        else {
            this.distinctID = this.getDistinctID();
        }
        this.sender = new TrackSender_1.TrackSender(serverURL, patchCount || 10, maxNumberOfTrackInRequest || 50, customRequest || wx.request);
    }
    Tracker.configure = function (config) {
        if (this.instance) {
            throw new Error('has been configured');
        }
        this.instance = new this(config.serverURL, config.patchCount, config.maxNumberOfTrackInRequest, config.customRequest, config.distinctID);
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
            properties: __assign({ distinct_id: this.distinctID }, this.extraInfo, this.globalProperityes, detail),
            event: event,
        });
    };
    Tracker.prototype.getDistinctID = function () {
        var distinctID = this.storageManager.getStorageSync(TrackerDistinctIDKey);
        if (!distinctID) {
            distinctID = this.generateDistinctID();
            this.storageManager.setStorageSync(TrackerDistinctIDKey, distinctID);
        }
        return distinctID;
    };
    Tracker.prototype.setDistinctID = function (distinctID) {
        this.storageManager.setStorageSync(TrackerDistinctIDKey, distinctID);
    };
    Tracker.prototype.generateDistinctID = function () {
        return '' + Date.now() + '-' + Math.floor(1e7 * Math.random()) + '-' + Math.random().toString(16).replace('.', '') + '-' + String(Math.random() * 31242).replace('.', '').slice(0, 8);
    };
    return Tracker;
}());
exports.Tracker = Tracker;
//# sourceMappingURL=Tracker.js.map
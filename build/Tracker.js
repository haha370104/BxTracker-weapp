"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TrackSender_1 = require("./TrackSender");
var Wrapper_1 = require("./Wrapper");
var Tracker = /** @class */ (function () {
    function Tracker(serverURL, patchCount, maxNumberOfTrackInRequest, customRequest) {
        this.serverURL = '';
        this.globalProperityes = {};
        this.serverURL = serverURL;
        this.sender = new TrackSender_1.TrackSender(serverURL, patchCount || 10, maxNumberOfTrackInRequest || 50, customRequest || wx.request);
    }
    Tracker.configure = function (config) {
        if (this.instance) {
            throw new Error('has been configured');
        }
        this.instance = new Tracker(config.serverURL, config.patchCount, config.maxNumberOfTrackInRequest, config.customRequest);
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
        this.globalProperityes = globalProperties;
    };
    Tracker.prototype.trackMessage = function (message, detail) {
        this.sender.addTrack({
            message: message,
            detail: Object.assign(detail, this.globalProperityes),
        });
    };
    return Tracker;
}());
exports.Tracker = Tracker;
//# sourceMappingURL=Tracker.js.map
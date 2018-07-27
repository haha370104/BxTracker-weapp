"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Storage_1 = require("./Storage");
var js_base64_1 = require("js-base64");
var Wrapper_1 = require("./Wrapper");
var TrackSenderStoragePrefixKey = 'TrackSenderStoragePrefixKey';
var TrackPatchKey = 'TrackPatchKey';
var TrackIncrementIdKey = 'TrackIncrementIdKey';
var TrackSender = /** @class */ (function () {
    function TrackSender(url, patchCount, maxNumberOfTrackInRequest, customRequest, requestInterval) {
        if (patchCount === void 0) { patchCount = 10; }
        if (maxNumberOfTrackInRequest === void 0) { maxNumberOfTrackInRequest = 50; }
        if (customRequest === void 0) { customRequest = wx.request; }
        if (requestInterval === void 0) { requestInterval = 1000; }
        var _this = this;
        this.patchCount = 10;
        this.maxNumberOfTrackInRequest = 50;
        this.processingFlag = false;
        this.forceToSend = false;
        this.url = url;
        this.storageManager = new Storage_1.Storage(TrackSenderStoragePrefixKey);
        this.patchCount = patchCount;
        this.maxNumberOfTrackInRequest = maxNumberOfTrackInRequest;
        this.customRequest = customRequest;
        this.requestInterval = requestInterval;
        var appConstructor = App;
        App = function (app) {
            Wrapper_1.objectMethodWrapper(app, 'onHide', function () {
                _this.forceToSend = true;
                _this.tryToSendPatchedTrack().then(function () {
                    _this.forceToSend = false;
                });
            });
            return appConstructor(app);
        };
    }
    TrackSender.prototype.delay = function (time) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, time);
        });
    };
    TrackSender.prototype.sendTrack = function (properties) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.processingFlag = true;
                        if (!(this.requestInterval > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.delay(this.requestInterval)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, new Promise(function (resolve, reject) {
                            _this.customRequest({
                                url: _this.url,
                                method: 'POST',
                                data: {
                                    data: js_base64_1.Base64.encode(JSON.stringify(properties)),
                                },
                                success: function (res) {
                                    if (res.statusCode === 200) {
                                        resolve(res);
                                        return;
                                    }
                                    reject(res);
                                },
                                fail: function (reason) {
                                    reject(reason);
                                },
                                complete: function () {
                                    _this.processingFlag = false;
                                },
                            });
                        })];
                }
            });
        });
    };
    TrackSender.prototype.tryToSendPatchedTrack = function () {
        return __awaiter(this, void 0, void 0, function () {
            var trackPatch, patch, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.processingFlag) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.storageManager.getValue(TrackPatchKey)];
                    case 1:
                        trackPatch = (_a.sent());
                        if (trackPatch.length < this.patchCount && !this.forceToSend) {
                            return [2 /*return*/];
                        }
                        patch = trackPatch.slice(0, Math.min(trackPatch.length, this.maxNumberOfTrackInRequest));
                        if (patch.length === 0) {
                            return [2 /*return*/];
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, this.sendTrack(patch)];
                    case 3:
                        _a.sent();
                        trackPatch.splice(0, patch.length);
                        return [4 /*yield*/, this.storageManager.setValue(TrackPatchKey, trackPatch)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6: return [4 /*yield*/, this.tryToSendPatchedTrack()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TrackSender.prototype.addTrack = function (properties) {
        return __awaiter(this, void 0, void 0, function () {
            var trackIncrementId, trackPatch, trackPatchSetterPromise, trackIdSetterPromise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storageManager.getValue(TrackIncrementIdKey, 0)];
                    case 1:
                        trackIncrementId = _a.sent();
                        trackIncrementId++;
                        properties['_id'] = trackIncrementId;
                        return [4 /*yield*/, this.storageManager.getValue(TrackPatchKey, [])];
                    case 2:
                        trackPatch = (_a.sent());
                        trackPatch.push(properties);
                        trackPatchSetterPromise = this.storageManager.setValue(TrackPatchKey, trackPatch);
                        trackIdSetterPromise = this.storageManager.setValue(TrackIncrementIdKey, trackIncrementId);
                        return [4 /*yield*/, Promise.all([trackIdSetterPromise, trackPatchSetterPromise])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.tryToSendPatchedTrack()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return TrackSender;
}());
exports.TrackSender = TrackSender;
//# sourceMappingURL=TrackSender.js.map
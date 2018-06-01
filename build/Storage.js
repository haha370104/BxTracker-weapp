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
var Storage = /** @class */ (function () {
    function Storage(prefix) {
        this.prefix = '';
        this.cache = {};
        this.prefix = prefix;
    }
    Storage.prototype.innerStorageKey = function (key) {
        return this.prefix + "." + key;
    };
    Storage.prototype.getValue = function (key, defaultValue) {
        return __awaiter(this, void 0, void 0, function () {
            var memoryCache, storageCache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        memoryCache = this.getMemoryCache(key);
                        if (memoryCache) {
                            return [2 /*return*/, memoryCache];
                        }
                        return [4 /*yield*/, this.getStorage(key)];
                    case 1:
                        storageCache = _a.sent();
                        if (storageCache) {
                            this.setMemoryCache(key, storageCache);
                            return [2 /*return*/, storageCache];
                        }
                        return [2 /*return*/, defaultValue];
                }
            });
        });
    };
    Storage.prototype.setValue = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setMemoryCache(key, value);
                        return [4 /*yield*/, this.setStorage(key, value)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Storage.prototype.getMemoryCache = function (key) {
        return this.cache[this.innerStorageKey(key)];
    };
    Storage.prototype.setMemoryCache = function (key, value) {
        this.cache[this.innerStorageKey(key)] = value;
    };
    Storage.prototype.getStorage = function (key) {
        var _this = this;
        return new Promise(function (resolve) {
            var innerKey = _this.innerStorageKey(key);
            wx.getStorage({
                key: innerKey,
                success: function (res) {
                    resolve(res.data);
                },
                fail: function (reason) {
                    resolve(null);
                },
            });
        });
    };
    Storage.prototype.getStorageSync = function (key) {
        return wx.getStorageSync(this.innerStorageKey(key));
    };
    Storage.prototype.setStorage = function (key, value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            wx.setStorage({
                key: _this.innerStorageKey(key),
                data: value,
                success: function () {
                    resolve();
                },
                fail: function (reason) {
                    reject(reason);
                },
            });
        });
    };
    Storage.prototype.setStorageSync = function (key, value) {
        var innerKey = this.innerStorageKey(key);
        wx.setStorageSync(innerKey, value);
    };
    return Storage;
}());
exports.Storage = Storage;
//# sourceMappingURL=Storage.js.map
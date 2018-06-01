"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectMethodWrapper = function (object, methodName, implement) {
    if (object[methodName]) {
        var originMethod_1 = object[methodName];
        object[methodName] = function (e) {
            implement.call(this, e, methodName);
            originMethod_1.call(this, e);
        };
    }
    else
        object[methodName] = function (e) {
            implement.call(this, e, methodName);
        };
};
//# sourceMappingURL=Wrapper.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingUtils = void 0;
var moment_1 = require("moment");
var BillingUtils = /** @class */ (function () {
    function BillingUtils() {
    }
    BillingUtils.billIsDue = function (billAt) {
        var today = (0, moment_1.default)().toDate();
        console.log({ today: today, billAt: billAt });
        var diff = (0, moment_1.default)(billAt).fromNow(false);
        console.log({ diff: diff });
        return true;
    };
    return BillingUtils;
}());
exports.BillingUtils = BillingUtils;

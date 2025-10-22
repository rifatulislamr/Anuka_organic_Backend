"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentStatus = exports.getPaymentsByUser = exports.createPayment = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../config/database");
const schemas_1 = require("../schemas");
const createPayment = (userId, orderId, method, amount, transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const validMethods = ["cash", "bkash"];
    if (!validMethods.includes(method)) {
        throw new Error("Invalid payment method");
    }
    // Check order exists
    const order = yield database_1.db.select().from(schemas_1.orders).where((0, drizzle_orm_1.eq)(schemas_1.orders.id, orderId)).limit(1);
    if (!order[0]) {
        throw new Error("Order not found");
    }
    // Insert payment
    const [payment] = yield database_1.db
        .insert(schemas_1.payments)
        .values({
        userId,
        orderId,
        method,
        amount,
        transactionId,
        status: "pending",
    })
        .$returningId();
    return { message: "Payment created", payment };
});
exports.createPayment = createPayment;
const getPaymentsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.db.select().from(schemas_1.payments).where((0, drizzle_orm_1.eq)(schemas_1.payments.userId, userId));
});
exports.getPaymentsByUser = getPaymentsByUser;
const updatePaymentStatus = (paymentId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const validStatuses = ["pending", "completed", "failed"];
    if (!validStatuses.includes(status)) {
        throw new Error("Invalid status");
    }
    yield database_1.db.update(schemas_1.payments).set({ status }).where((0, drizzle_orm_1.eq)(schemas_1.payments.id, paymentId));
    return { message: `Payment ${paymentId} updated to ${status}` };
});
exports.updatePaymentStatus = updatePaymentStatus;

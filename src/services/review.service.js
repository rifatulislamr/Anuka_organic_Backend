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
exports.deleteReview = exports.getReviewsByProduct = exports.addReview = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schemas_1 = require("../schemas");
const database_1 = require("../config/database");
const addReview = (userId, productId, rating, comment) => __awaiter(void 0, void 0, void 0, function* () {
    const [review] = yield database_1.db
        .insert(schemas_1.productReviews)
        .values({
        userId,
        productId,
        rating,
        comment,
    })
        .$returningId();
    return review;
});
exports.addReview = addReview;
const getReviewsByProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.db
        .select()
        .from(schemas_1.productReviews)
        .where((0, drizzle_orm_1.sql) `${schemas_1.productReviews.productId} = ${productId}`);
});
exports.getReviewsByProduct = getReviewsByProduct;
const deleteReview = (reviewId_1, userId_1, ...args_1) => __awaiter(void 0, [reviewId_1, userId_1, ...args_1], void 0, function* (reviewId, userId, isAdmin = false) {
    // Only delete if owner OR admin
    if (isAdmin) {
        return yield database_1.db.delete(schemas_1.productReviews).where((0, drizzle_orm_1.sql) `${schemas_1.productReviews.id} = ${reviewId}`);
    }
    return yield database_1.db
        .delete(schemas_1.productReviews)
        .where((0, drizzle_orm_1.sql) `${schemas_1.productReviews.id} = ${reviewId} AND ${schemas_1.productReviews.userId} = ${userId}`);
});
exports.deleteReview = deleteReview;

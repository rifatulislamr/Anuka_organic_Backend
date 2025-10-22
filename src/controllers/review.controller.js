"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.deleteReviewController = exports.getReviewsByProductController = exports.addReviewController = void 0;
const reviewService = __importStar(require("../services/review.service"));
const zod_1 = require("zod");
const ReviewSchema = zod_1.z.object({
    productId: zod_1.z.number(),
    rating: zod_1.z.number().min(1).max(5),
    comment: zod_1.z.string().max(500).optional(),
});
// ✅ POST /reviews
const addReviewController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, rating, comment } = ReviewSchema.parse(req.body);
        if (!req.user || !req.user.userId) {
            res
                .status(401)
                .json({ status: "error", message: "Unauthorized: user not found" });
            return; // 👈 stop execution
        }
        const userId = req.user.userId;
        const review = yield reviewService.addReview(userId, productId, rating, comment);
        res.json({ status: "success", data: review });
    }
    catch (err) {
        next(err);
    }
});
exports.addReviewController = addReviewController;
// ✅ GET /products/:id/reviews
const getReviewsByProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = Number(req.params.id);
        const reviews = yield reviewService.getReviewsByProduct(productId);
        res.json({ status: "success", data: reviews });
    }
    catch (err) {
        next(err);
    }
});
exports.getReviewsByProductController = getReviewsByProductController;
// ✅ DELETE /reviews/:id
const deleteReviewController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const reviewId = Number(req.params.id);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const isAdmin = req.user &&
            typeof req.user.role === "string" &&
            req.user.role === "admin";
        if (typeof userId !== "number") {
            res
                .status(401)
                .json({ status: "error", message: "Unauthorized: user not found" });
            return; // 👈 stop here instead of returning res
        }
        yield reviewService.deleteReview(reviewId, userId, isAdmin);
        res.json({ status: "success", message: "Review deleted" });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteReviewController = deleteReviewController;

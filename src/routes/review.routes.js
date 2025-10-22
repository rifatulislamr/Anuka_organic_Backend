"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// POST /reviews
router.post("/create-reviews", auth_middleware_1.authenticateUser, review_controller_1.addReviewController);
// GET /products/:id/reviews
router.get("/products/:id/reviews", review_controller_1.getReviewsByProductController);
// DELETE /reviews/:id
router.delete("/delete-reviews/:id", auth_middleware_1.authenticateUser, review_controller_1.deleteReviewController);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errors_utils_1 = require("../services/utils/errors.utils");
const errorHandler = (err, req, res, next) => {
    let error = err;
    // Log error for debugging
    console.error("Error:", {
        name: err.name,
        message: err.message,
        stack: err.stack,
    });
    // Handle Zod validation errors
    if (err instanceof zod_1.ZodError) {
        const validationErrors = {};
        err.errors.forEach((error) => {
            const path = error.path.join(".");
            if (!validationErrors[path]) {
                validationErrors[path] = [];
            }
            validationErrors[path].push(error.message);
        });
        error = new errors_utils_1.AppError("Validation failed", 422);
        error.errors = validationErrors;
    }
    // Prepare error response
    const errorResponse = {
        status: error.status || "error",
        message: error.message || "Something went wrong",
    };
    // Add validation errors if present
    if (error.errors) {
        errorResponse.errors = error.errors;
    }
    // Include stack trace in development
    if (process.env.NODE_ENV === "development") {
        errorResponse.stack = error.stack;
    }
    res.status(error.statusCode || 500).json(errorResponse);
};
exports.errorHandler = errorHandler;

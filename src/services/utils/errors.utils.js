"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodClosedError = exports.ValidationError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.createError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const createError = (message, statusCode) => {
    return new AppError(message, statusCode);
};
exports.createError = createError;
const BadRequestError = (message) => (0, exports.createError)(message, 400);
exports.BadRequestError = BadRequestError;
const UnauthorizedError = (message) => (0, exports.createError)(message, 401);
exports.UnauthorizedError = UnauthorizedError;
const ForbiddenError = (message) => (0, exports.createError)(message, 403);
exports.ForbiddenError = ForbiddenError;
const NotFoundError = (message) => (0, exports.createError)(message, 404);
exports.NotFoundError = NotFoundError;
const ConflictError = (message) => (0, exports.createError)(message, 409);
exports.ConflictError = ConflictError;
const ValidationError = (message, errors) => {
    const error = (0, exports.createError)(message, 422);
    error.errors = errors;
    return error;
};
exports.ValidationError = ValidationError;
class PeriodClosedError extends Error {
    constructor(message) {
        super(message);
        this.name = "PeriodClosedError";
    }
}
exports.PeriodClosedError = PeriodClosedError;

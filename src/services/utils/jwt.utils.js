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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = exports.getMillisecondsFromTimeString = exports.isTokenExpired = exports.decodeToken = exports.extractTokenFromHeader = exports.verifyAccessToken = exports.generateAccessToken = void 0;
exports.getUserPermissions = getUserPermissions;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_utils_1 = require("./errors.utils");
const database_1 = require("../../config/database");
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "24h";
const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET);
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not configured");
}
const generateAccessToken = (payload) => {
    try {
        const secret = JWT_SECRET;
        const expiresIn = ACCESS_TOKEN_EXPIRES_IN || "24h";
        console.log(secret);
        const options = {
            expiresIn: expiresIn,
        };
        const token = jsonwebtoken_1.default.sign(payload, secret, options);
        const decoded = jsonwebtoken_1.default.decode(token); // Don't verify, just decode
        if (decoded && typeof decoded !== "string") {
            const exp = decoded.exp;
            const expiryDate = exp
                ? new Date(exp * 1000).toISOString()
                : "No exp in token";
        }
        else {
            console.log("Could not decode token or token is a string.");
        }
        return token;
    }
    catch (error) {
        console.error(error);
        throw (0, errors_utils_1.BadRequestError)("Error generating access token");
    }
};
exports.generateAccessToken = generateAccessToken;
const verifyAccessToken = (token) => {
    try {
        console.log(JWT_SECRET);
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        console.error(error);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw (0, errors_utils_1.UnauthorizedError)("Token has expired");
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw (0, errors_utils_1.UnauthorizedError)("Invalid token");
        }
        throw (0, errors_utils_1.UnauthorizedError)("Token verification failed");
    }
};
exports.verifyAccessToken = verifyAccessToken;
const extractTokenFromHeader = (authHeader) => {
    if (!authHeader) {
        throw (0, errors_utils_1.UnauthorizedError)("No authorization header");
    }
    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
        throw (0, errors_utils_1.UnauthorizedError)("Invalid authorization header format");
    }
    return token;
};
exports.extractTokenFromHeader = extractTokenFromHeader;
const decodeToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (decoded && typeof decoded === "object") {
            return decoded;
        }
        return null;
    }
    catch (error) {
        return null;
    }
};
exports.decodeToken = decodeToken;
const isTokenExpired = (token) => {
    const decoded = (0, exports.decodeToken)(token);
    if (!decoded || typeof decoded.exp !== "number")
        return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
};
exports.isTokenExpired = isTokenExpired;
const getMillisecondsFromTimeString = (timeString) => {
    const unit = timeString.slice(-1);
    const value = parseInt(timeString.slice(0, -1));
    switch (unit) {
        case "s":
            return value * 1000;
        case "m":
            return value * 60 * 1000;
        case "h":
            return value * 60 * 60 * 1000;
        case "d":
            return value * 24 * 60 * 60 * 1000;
        default:
            throw new Error("Invalid time string format");
    }
};
exports.getMillisecondsFromTimeString = getMillisecondsFromTimeString;
function getUserPermissions(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const result = yield database_1.db.query.userRolesModel.findMany({
            where: (ur, { eq }) => eq(ur.userId, userId),
            with: {
                role: {
                    with: {
                        rolePermissions: {
                            with: {
                                permission: true,
                            },
                        },
                    },
                },
            },
        });
        const permissions = new Set();
        for (const ur of result) {
            for (const perm of (_a = ur.role) === null || _a === void 0 ? void 0 : _a.rolePermissions) {
                permissions.add(perm.permission.name);
            }
        }
        return Array.from(permissions);
    });
}
const requirePermission = (req, permission) => {
    var _a, _b;
    console.log(req.user);
    console.log("Is permission", (_a = req.user) === null || _a === void 0 ? void 0 : _a.hasPermission(permission));
    if (!((_b = req.user) === null || _b === void 0 ? void 0 : _b.hasPermission(permission))) {
        throw new Error("Forbidden");
    }
};
exports.requirePermission = requirePermission;

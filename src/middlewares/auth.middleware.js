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
exports.authenticateUser = void 0;
const errors_utils_1 = require("../services/utils/errors.utils");
const jwt_utils_1 = require("../services/utils/jwt.utils");
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        const token = (0, jwt_utils_1.extractTokenFromHeader)(authHeader);
        console.log("Token received on API:", req.headers.authorization);
        const decoded = (0, jwt_utils_1.verifyAccessToken)(token);
        const permissions = yield (0, jwt_utils_1.getUserPermissions)(decoded.userId);
        req.user = {
            userId: decoded.userId,
            username: decoded.username,
            role: decoded.role,
            hasPermission: (perm) => permissions.includes(perm),
            hasRole: (role) => decoded.role === role,
        };
        console.log(permissions);
        next();
    }
    catch (error) {
        console.error(error);
        next((0, errors_utils_1.UnauthorizedError)("Invalid token"));
    }
});
exports.authenticateUser = authenticateUser;
// utils/getUserPermissions.ts

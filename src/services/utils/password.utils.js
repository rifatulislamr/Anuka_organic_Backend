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
exports.validatePassword = exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const errors_utils_1 = require("./errors.utils");
const SALT_ROUNDS = 12;
const MIN_LENGTH = 8;
const MAX_LENGTH = 100;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, exports.validatePassword)(password);
        const salt = yield bcrypt_1.default.genSalt(SALT_ROUNDS);
        return yield bcrypt_1.default.hash(password, salt);
    }
    catch (error) {
        if (error instanceof errors_utils_1.BadRequestError) {
            throw error;
        }
        throw new Error("Error hashing password");
    }
});
exports.hashPassword = hashPassword;
const comparePassword = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield bcrypt_1.default.compare(password, hash);
    }
    catch (error) {
        throw new Error("Error comparing passwords");
    }
});
exports.comparePassword = comparePassword;
const validatePassword = (password) => {
    const errors = [];
    if (password.length < MIN_LENGTH) {
        errors.push(`Password must be at least ${MIN_LENGTH} characters long`);
    }
    
    if (errors.length > 0) {
        throw (0, errors_utils_1.BadRequestError)(errors.join(". "));
    }
};
exports.validatePassword = validatePassword;

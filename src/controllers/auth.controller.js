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
exports.getUserByIdController = exports.getUsersWithRoles = exports.changePasswordController = exports.updateUserController = exports.register = exports.login = void 0;
const zod_1 = require("zod");
const database_1 = require("../config/database");
const schemas_1 = require("../schemas");
const drizzle_orm_1 = require("drizzle-orm");
const auth_service_1 = require("../services/auth.service");
const loginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, "Username is required"),
    password: zod_1.z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),
});

const registerSchema = zod_1.z
    .object({
    username: zod_1.z.string().min(1, "Username is required"),
    fullName: zod_1.z.string().min(1, "Full name is required"),
    phone: zod_1.z.string().min(1, "Phone number is required"),
    street: zod_1.z.string().min(1, "Street is required"),
    city: zod_1.z.string().min(1, "City is required"),
    state: zod_1.z.string().min(1, "State is required"),
    country: zod_1.z.string().min(1, "Country is required"),
    email: zod_1.z.string().min(1, "Email is required").email("Invalid email address"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: zod_1.z.string(),
    active: zod_1.z.boolean().default(true),
    roleId: zod_1.z.number(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
const changePasswordSchema = zod_1.z
    .object({
    currentPassword: zod_1.z.string().min(1, "Current password is required"),
    newPassword: zod_1.z
        .string()
        .min(8, "New password must be at least 8 characters"),
    confirmNewPassword: zod_1.z
        .string()
        .min(8, "Confirm new password must be at least 8 characters"),
})
    .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = loginSchema.parse(req.body);
        const result = yield (0, auth_service_1.loginUser)(username, password);
        res.json({
            status: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
//
const register = async (req, res, next) => {
    try {
        const { username, fullName, phone, street, city, state, country, email, password, active, roleId, } = registerSchema.parse(req.body);
        const user = await (0, auth_service_1.createUser)({
            username,
            fullName,
            phone,
            street,
            city,
            state,
            country,
            email,
            password,
            active,
            roleId,
        });
        res.status(201).json({
            status: "success",
            data: {
                user: {
                    username: user.username,
                    fullName: user.fullName,
                    phone: user.phone,
                    street: user.street,
                    city: user.city,
                    state: user.state,
                    country: user.country,
                    email: user.email,
                    roleId: user.roleId,
                    active: user.active,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
// ========== Controller Layer ==========
const updateUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { username, email, roleId, active, fullName, phone, street, city, state, country, } = req.body;
        const updateData = {};
        if (username !== undefined)
            updateData.username = username;
        if (email !== undefined)
            updateData.email = email;
        if (roleId !== undefined)
            updateData.roleId = Number(roleId);
        if (active !== undefined)
            updateData.active = Boolean(active);
        if (fullName !== undefined)
            updateData.fullName = fullName;
        if (phone !== undefined)
            updateData.phone = phone;
        if (street !== undefined)
            updateData.street = street;
        if (city !== undefined)
            updateData.city = city;
        if (state !== undefined)
            updateData.state = state;
        if (country !== undefined)
            updateData.country = country;
        const updatedUser = yield (0, auth_service_1.updateUser)(Number(userId), updateData);
        if (!updatedUser) {
            res.status(404).json({
                status: "fail",
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            status: "success",
            data: {
                user: updatedUser,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserController = updateUserController;
const changePasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
        yield (0, auth_service_1.changePassword)(Number(userId), currentPassword, newPassword);
        res.status(200).json({
            status: "success",
            message: "Password changed successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.changePasswordController = changePasswordController;
const getUsersWithRoles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersWithRoles = yield database_1.db
            .select({
            userId: schemas_1.userModel.userId,
            username: schemas_1.userModel.username,
            active: schemas_1.userModel.active,
            roleName: schemas_1.roleModel.roleName,
        })
            .from(schemas_1.userModel)
            .innerJoin(schemas_1.roleModel, (0, drizzle_orm_1.eq)(schemas_1.userModel.roleId, schemas_1.roleModel.roleId));
        res.status(200).json({
            status: "success",
            data: {
                users: usersWithRoles.map((user) => ({
                    id: user.userId,
                    username: user.username,
                    active: user.active,
                    roleName: user.roleName,
                })),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUsersWithRoles = getUsersWithRoles;
// get user by userId
const getUserByIdController = (req, // typing req.params
res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ message: "userId is required" });
            return;
        }
        const user = yield (0, auth_service_1.getUserById)(Number(userId));
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        next(error); // Pass errors to Express error handler
    }
});
exports.getUserByIdController = getUserByIdController;

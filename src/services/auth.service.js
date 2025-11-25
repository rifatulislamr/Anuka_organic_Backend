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
exports.getUserById = exports.changePassword = exports.loginUser = exports.updateUser = exports.getUsers = exports.createUser = exports.getUserDetailsByUserId = exports.findUserByEmail = exports.findUserByUsername = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../config/database");
// import { userModel } from "../schemas/users.schema";
const errors_utils_1 = require("./utils/errors.utils");
const jwt_utils_1 = require("./utils/jwt.utils");
const password_utils_1 = require("./utils/password.utils");
const schemas_1 = require("../schemas");
const findUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const [user] = yield database_1.db
        .select()
        .from(schemas_1.userModel)
        .where((0, drizzle_orm_1.eq)(schemas_1.userModel.username, username));
    return user;
});
exports.findUserByUsername = findUserByUsername;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const [user] = yield database_1.db
        .select()
        .from(schemas_1.userModel)
        .where((0, drizzle_orm_1.eq)(schemas_1.userModel.email, email));
    return user;
});
exports.findUserByEmail = findUserByEmail;
const findUserByPhone = async (phone) => {
    return await database_1.db.query.userModel.findFirst({
        where: (users, { eq }) => eq(users.phone, phone),
    });
};
exports.findUserByPhone = findUserByPhone;
const getUserDetailsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(userId);
    const user = yield database_1.db.query.userModel.findFirst({
        where: (0, drizzle_orm_1.eq)(schemas_1.userModel.userId, userId),
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
    return user;
});
exports.getUserDetailsByUserId = getUserDetailsByUserId;

const createUser = async (userData) => {
    try {
        // Check if username already exists
        const existingUser = await (0, exports.findUserByUsername)(userData.username);
        if (existingUser) {
            throw (0, errors_utils_1.BadRequestError)("Username already registered, please try another");
        }
        // Check if email already exists
        const existingEmail = await (0, exports.findUserByEmail)(userData.email);
        if (existingEmail) {
            throw (0, errors_utils_1.BadRequestError)("Email already registered, please try another");
        }
        // Check if phone already exists
        const existingPhone = await (0, exports.findUserByPhone)(userData.phone);
        if (existingPhone) {
            throw (0, errors_utils_1.BadRequestError)("Phone number already registered, please try another");
        }
        // Hash password
        (0, password_utils_1.validatePassword)(userData.password);
        const hashedPassword = await (0, password_utils_1.hashPassword)(userData.password);
        // Insert user
        const [newUserId] = await database_1.db
            .insert(schemas_1.userModel)
            .values({
            username: userData.username,
            fullName: userData.fullName,
            phone: userData.phone,
            street: userData.street,
            city: userData.city,
            state: userData.state,
            country: userData.country,
            email: userData.email,
            password: hashedPassword,
            active: userData.active,
            roleId: userData.roleId,
        })
            .$returningId();
        return {
            id: newUserId,
            username: userData.username,
            fullName: userData.fullName,
            phone: userData.phone,
            street: userData.street,
            city: userData.city,
            state: userData.state,
            country: userData.country,
            email: userData.email,
            active: userData.active,
            roleId: userData.roleId,
        };
    }
    catch (error) {
        throw error;
    }
};
exports.createUser = createUser;
//get user api
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const userList = yield database_1.db
        .select({
        userId: schemas_1.userModel.userId,
        username: schemas_1.userModel.username,
        email: schemas_1.userModel.email,
        active: schemas_1.userModel.active,
        roleId: schemas_1.userModel.roleId,
        fullName: schemas_1.userModel.fullName,
        phone: schemas_1.userModel.phone,
        street: schemas_1.userModel.street,
        city: schemas_1.userModel.city,
        state: schemas_1.userModel.state,
        country: schemas_1.userModel.country,
        createdAt: schemas_1.userModel.createdAt,
        updatedAt: schemas_1.userModel.updatedAt,
        roleName: schemas_1.roleModel.roleName,
    })
        .from(schemas_1.userModel)
        .leftJoin(schemas_1.roleModel, (0, drizzle_orm_1.eq)(schemas_1.userModel.roleId, schemas_1.roleModel.roleId));
    return userList;
});
exports.getUsers = getUsers;
// ========== Service Layer ==========
const updateUser = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.db
        .update(schemas_1.userModel)
        .set(updateData)
        .where((0, drizzle_orm_1.sql) `${schemas_1.userModel.userId} = ${userId}`);
    const updatedUser = yield database_1.db
        .select({
        userId: schemas_1.userModel.userId,
        username: schemas_1.userModel.username,
        email: schemas_1.userModel.email,
        roleId: schemas_1.userModel.roleId,
        active: schemas_1.userModel.active,
        fullName: schemas_1.userModel.fullName,
        phone: schemas_1.userModel.phone,
        street: schemas_1.userModel.street,
        city: schemas_1.userModel.city,
        state: schemas_1.userModel.state,
        country: schemas_1.userModel.country,
    })
        .from(schemas_1.userModel)
        .where((0, drizzle_orm_1.sql) `${schemas_1.userModel.userId} = ${userId}`)
        .limit(1);
    return updatedUser[0];
});
exports.updateUser = updateUser;
const loginUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield (0, exports.findUserByUsername)(username);
    if (!user) {
        throw (0, errors_utils_1.UnauthorizedError)("Wrong username/passwrod. Please Contact with Administrator");
    }
    // Validate password format if needed
    (0, password_utils_1.validatePassword)(password);
    // Compare the plain password with stored hash
    // Note: We don't hash the incoming password before comparison
    const isValidPassword = yield (0, password_utils_1.comparePassword)(password, user.password);
    if (!isValidPassword) {
        throw (0, errors_utils_1.UnauthorizedError)("Wrong username/password. Please Contact with Administrator");
    }
    // fetch user details from db like role, voucher types, company, location, etc.
    const userDetails = yield (0, exports.getUserDetailsByUserId)(user.userId);
    const permissions = ((_a = userDetails === null || userDetails === void 0 ? void 0 : userDetails.role) === null || _a === void 0 ? void 0 : _a.rolePermissions.map((ur) => ur.permission.name)) || "";
    const token = (0, jwt_utils_1.generateAccessToken)({
        userId: user.userId,
        username: user.username,
        role: user === null || user === void 0 ? void 0 : user.roleId,
        permissions: permissions,
        hasPermission: (perm) => permissions.includes(perm),
    });
    return {
        token,
        user: userDetails,
    };
});
exports.loginUser = loginUser;
const changePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield database_1.db
        .select()
        .from(schemas_1.userModel)
        .where((0, drizzle_orm_1.eq)(schemas_1.userModel.userId, userId))
        .then((rows) => rows[0]);
    if (!user) {
        throw (0, errors_utils_1.UnauthorizedError)("User not found");
    }
    const isValidPassword = yield (0, password_utils_1.comparePassword)(currentPassword, user.password);
    if (!isValidPassword) {
        throw (0, errors_utils_1.UnauthorizedError)("Current password is incorrect");
    }
    (0, password_utils_1.validatePassword)(newPassword);
    const hashedPassword = yield (0, password_utils_1.hashPassword)(newPassword);
    yield database_1.db
        .update(schemas_1.userModel)
        .set({ password: hashedPassword })
        .where((0, drizzle_orm_1.eq)(schemas_1.userModel.userId, userId));
});
exports.changePassword = changePassword;
// get user by userId
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield database_1.db
        .select({
        userId: schemas_1.userModel.userId,
        username: schemas_1.userModel.username,
        email: schemas_1.userModel.email,
        active: schemas_1.userModel.active,
        roleId: schemas_1.userModel.roleId,
        fullName: schemas_1.userModel.fullName,
        phone: schemas_1.userModel.phone,
        street: schemas_1.userModel.street,
        city: schemas_1.userModel.city,
        state: schemas_1.userModel.state,
        country: schemas_1.userModel.country,
        createdAt: schemas_1.userModel.createdAt,
        updatedAt: schemas_1.userModel.updatedAt,
        roleName: schemas_1.roleModel.roleName,
    })
        .from(schemas_1.userModel)
        .leftJoin(schemas_1.roleModel, (0, drizzle_orm_1.eq)(schemas_1.userModel.roleId, schemas_1.roleModel.roleId))
        .where((0, drizzle_orm_1.eq)(schemas_1.userModel.userId, userId))
        .limit(1); // only one user
    return user[0] || null;
});
exports.getUserById = getUserById;

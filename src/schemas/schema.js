"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRelations = exports.orderRelations = exports.cartRelations = exports.reviewRelations = exports.categoryRelations = exports.productRelations = exports.userRolesRelations = exports.rolePermissionsRelations = exports.permissionRelations = exports.roleRelations = exports.userRelations = exports.payments = exports.orders = exports.carts = exports.productReviews = exports.products = exports.categories = exports.userModel = exports.userRolesModel = exports.rolePermissionsModel = exports.permissionsModel = exports.roleModel = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
// ================= ROLES =================
exports.roleModel = (0, mysql_core_1.mysqlTable)("roles", {
    roleId: (0, mysql_core_1.int)("role_id").primaryKey().autoincrement(),
    roleName: (0, mysql_core_1.varchar)("role_name", { length: 50 }).notNull(),
});
exports.permissionsModel = (0, mysql_core_1.mysqlTable)("permissions", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    name: (0, mysql_core_1.varchar)("name", { length: 50 }).notNull().unique(),
});
exports.rolePermissionsModel = (0, mysql_core_1.mysqlTable)("role_permissions", {
    roleId: (0, mysql_core_1.int)("role_id")
        .notNull()
        .references(() => exports.roleModel.roleId, { onDelete: "cascade" }),
    permissionId: (0, mysql_core_1.int)("permission_id")
        .notNull()
        .references(() => exports.permissionsModel.id, { onDelete: "cascade" }),
});
exports.userRolesModel = (0, mysql_core_1.mysqlTable)("user_roles", {
    userId: (0, mysql_core_1.int)("user_id")
        .notNull()
        .references(() => exports.userModel.userId, { onDelete: "cascade" }),
    roleId: (0, mysql_core_1.int)("role_id")
        .notNull()
        .references(() => exports.roleModel.roleId, { onDelete: "cascade" }),
});
// ================= USERS =================
exports.userModel = (0, mysql_core_1.mysqlTable)("users", {
    userId: (0, mysql_core_1.int)("user_id").primaryKey().autoincrement(),
    username: (0, mysql_core_1.varchar)("username", { length: 50 }).notNull().unique(),
    email: (0, mysql_core_1.varchar)("email", { length: 100 }).notNull().unique(),
    password: (0, mysql_core_1.varchar)("password", { length: 255 }).notNull(),
    active: (0, mysql_core_1.boolean)("active").notNull().default(true),
    roleId: (0, mysql_core_1.int)("role_id").references(() => exports.roleModel.roleId, {
        onDelete: "set null",
    }),
    fullName: (0, mysql_core_1.varchar)("full_name", { length: 100 }),
    phone: (0, mysql_core_1.varchar)("phone", { length: 20 }).notNull().unique(),
    street: (0, mysql_core_1.varchar)("street", { length: 255 }),
    city: (0, mysql_core_1.varchar)("city", { length: 100 }),
    state: (0, mysql_core_1.varchar)("state", { length: 100 }),
    country: (0, mysql_core_1.varchar)("country", { length: 100 }),
    postalCode: (0, mysql_core_1.varchar)("postal_code", { length: 20 }),
    isPasswordResetRequired: (0, mysql_core_1.boolean)("is_password_reset_required").default(true),
    createdAt: (0, mysql_core_1.timestamp)("created_at").default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at")
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`)
        .onUpdateNow(),
});
// ================= CATEGORIES =================
exports.categories = (0, mysql_core_1.mysqlTable)("categories", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    name: (0, mysql_core_1.varchar)("name", { length: 100 }).notNull(),
});
// ================= PRODUCTS =================
exports.products = (0, mysql_core_1.mysqlTable)("products", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    name: (0, mysql_core_1.varchar)("name", { length: 150 }).notNull(),
    description: (0, mysql_core_1.text)("description"),
    url: (0, mysql_core_1.varchar)("url", { length: 255 }).notNull(),
    price: (0, mysql_core_1.int)("price").notNull(),
    stock: (0, mysql_core_1.int)("stock").default(0),
    categoryId: (0, mysql_core_1.int)("category_id")
        .notNull()
        .references(() => exports.categories.id, { onDelete: "cascade" }),
    isActive: (0, mysql_core_1.boolean)("is_active").default(true),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
});
// ================= REVIEWS =================
exports.productReviews = (0, mysql_core_1.mysqlTable)("product_reviews", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    productId: (0, mysql_core_1.int)("product_id")
        .notNull()
        .references(() => exports.products.id, { onDelete: "cascade" }),
    userId: (0, mysql_core_1.int)("user_id")
        .notNull()
        .references(() => exports.userModel.userId, { onDelete: "cascade" }),
    rating: (0, mysql_core_1.int)("rating").notNull(),
    comment: (0, mysql_core_1.text)("comment"),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
});
// ================= CART =================
// export const carts = mysqlTable("carts", {
//   id: int("id").primaryKey().autoincrement(),
//   productId: int("product_id")
//     .notNull()
//     .references(() => products.id, { onDelete: "cascade" }),
//   userId: int("user_id")
//     .notNull()
//     .references(() => userModel.userId, { onDelete: "cascade" }),
//   createdAt: timestamp("created_at").defaultNow(),
// });
exports.carts = (0, mysql_core_1.mysqlTable)("carts", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    productId: (0, mysql_core_1.int)("product_id")
        .notNull()
        .references(() => exports.products.id, { onDelete: "cascade" }),
    userId: (0, mysql_core_1.int)("user_id")
        .notNull()
        .references(() => exports.userModel.userId, { onDelete: "cascade" }),
    quantity: (0, mysql_core_1.int)("quantity").notNull().default(1), // ✅ added quantity
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
});
// ================= ORDERS =================
exports.orders = (0, mysql_core_1.mysqlTable)("orders", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    userId: (0, mysql_core_1.int)("user_id")
        .notNull()
        .references(() => exports.userModel.userId, { onDelete: "cascade" }),
    productId: (0, mysql_core_1.int)("product_id")
        .notNull()
        .references(() => exports.products.id, { onDelete: "cascade" }),
    productQuantity: (0, mysql_core_1.int)("product_quantity").notNull(),
    status: (0, mysql_core_1.mysqlEnum)("status", [
        "pending",
        "paid",
        "delivered",
        "cancelled",
    ]).default("pending"),
    totalAmount: (0, mysql_core_1.int)("total_amount").notNull(),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
});
// ================= PAYMENTS =================
exports.payments = (0, mysql_core_1.mysqlTable)("payments", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    userId: (0, mysql_core_1.int)("user_id")
        .notNull()
        .references(() => exports.userModel.userId, { onDelete: "cascade" }),
    orderId: (0, mysql_core_1.int)("order_id")
        .notNull()
        .references(() => exports.orders.id, { onDelete: "cascade" }),
    method: (0, mysql_core_1.mysqlEnum)("method", ["cash", "bkash"]).notNull(),
    amount: (0, mysql_core_1.int)("amount").notNull(),
    status: (0, mysql_core_1.mysqlEnum)("status", ["pending", "completed", "failed"]).default("pending"),
    transactionId: (0, mysql_core_1.varchar)("transaction_id", { length: 255 }),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
});
// ================= RELATIONS =================
// User ↔ Role
exports.userRelations = (0, drizzle_orm_1.relations)(exports.userModel, ({ one, many }) => ({
    role: one(exports.roleModel, {
        fields: [exports.userModel.roleId],
        references: [exports.roleModel.roleId],
    }),
    reviews: many(exports.productReviews),
    carts: many(exports.carts),
    orders: many(exports.orders),
    payments: many(exports.payments),
    userRoles: many(exports.userRolesModel),
}));
exports.roleRelations = (0, drizzle_orm_1.relations)(exports.roleModel, ({ many }) => ({
    users: many(exports.userModel),
    rolePermissions: many(exports.rolePermissionsModel),
    userRoles: many(exports.userRolesModel),
}));
exports.permissionRelations = (0, drizzle_orm_1.relations)(exports.permissionsModel, ({ many }) => ({
    rolePermissions: many(exports.rolePermissionsModel),
}));
exports.rolePermissionsRelations = (0, drizzle_orm_1.relations)(exports.rolePermissionsModel, ({ one }) => ({
    role: one(exports.roleModel, {
        fields: [exports.rolePermissionsModel.roleId],
        references: [exports.roleModel.roleId],
    }),
    permission: one(exports.permissionsModel, {
        fields: [exports.rolePermissionsModel.permissionId],
        references: [exports.permissionsModel.id],
    }),
}));
exports.userRolesRelations = (0, drizzle_orm_1.relations)(exports.userRolesModel, ({ one }) => ({
    user: one(exports.userModel, {
        fields: [exports.userRolesModel.userId],
        references: [exports.userModel.userId],
    }),
    role: one(exports.roleModel, {
        fields: [exports.userRolesModel.roleId],
        references: [exports.roleModel.roleId],
    }),
}));
// Product relations
exports.productRelations = (0, drizzle_orm_1.relations)(exports.products, ({ one, many }) => ({
    category: one(exports.categories, {
        fields: [exports.products.categoryId],
        references: [exports.categories.id],
    }),
    reviews: many(exports.productReviews),
    carts: many(exports.carts),
    orders: many(exports.orders),
}));
exports.categoryRelations = (0, drizzle_orm_1.relations)(exports.categories, ({ many }) => ({
    products: many(exports.products),
}));
exports.reviewRelations = (0, drizzle_orm_1.relations)(exports.productReviews, ({ one }) => ({
    product: one(exports.products, {
        fields: [exports.productReviews.productId],
        references: [exports.products.id],
    }),
    user: one(exports.userModel, {
        fields: [exports.productReviews.userId],
        references: [exports.userModel.userId],
    }),
}));
exports.cartRelations = (0, drizzle_orm_1.relations)(exports.carts, ({ one }) => ({
    product: one(exports.products, {
        fields: [exports.carts.productId],
        references: [exports.products.id],
    }),
    user: one(exports.userModel, {
        fields: [exports.carts.userId],
        references: [exports.userModel.userId],
    }),
}));
exports.orderRelations = (0, drizzle_orm_1.relations)(exports.orders, ({ one, many }) => ({
    user: one(exports.userModel, {
        fields: [exports.orders.userId],
        references: [exports.userModel.userId],
    }),
    product: one(exports.products, {
        fields: [exports.orders.productId],
        references: [exports.products.id],
    }),
    payments: many(exports.payments),
}));
exports.paymentRelations = (0, drizzle_orm_1.relations)(exports.payments, ({ one }) => ({
    user: one(exports.userModel, {
        fields: [exports.payments.userId],
        references: [exports.userModel.userId],
    }),
    order: one(exports.orders, {
        fields: [exports.payments.orderId],
        references: [exports.orders.id],
    }),
}));

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
exports.updateOrderStatus = exports.getOrdersByUser = exports.getAllOrders = exports.createOrder = void 0;
const database_1 = require("../config/database");
const schemas_1 = require("../schemas");
const drizzle_orm_1 = require("drizzle-orm");
const createOrder = (userId, items) => __awaiter(void 0, void 0, void 0, function* () {
    if (!items || items.length === 0) {
        throw new Error("Order must contain at least one item");
    }
    let totalOrderAmount = 0;
    // loop through items
    for (const item of items) {
        const [product] = yield database_1.db
            .select()
            .from(schemas_1.products)
            .where((0, drizzle_orm_1.eq)(schemas_1.products.id, item.productId));
        if (!product)
            throw new Error(`Product ${item.productId} not found`);
        if (product.stock == null || product.stock < item.qty)
            throw new Error(`Not enough stock for product ${item.productId}`);
        const lineAmount = product.price * item.qty;
        totalOrderAmount += lineAmount;
        // deduct stock
        yield database_1.db
            .update(schemas_1.products)
            .set({ stock: product.stock - item.qty })
            .where((0, drizzle_orm_1.eq)(schemas_1.products.id, item.productId));
        // insert row in orders
        yield database_1.db.insert(schemas_1.orders).values({
            userId,
            productId: item.productId,
            productQuantity: item.qty,
            status: "pending",
            totalAmount: lineAmount,
        });
    }
    return { message: "Order created successfully", totalOrderAmount };
});
exports.createOrder = createOrder;
// get all orders - admin
// export const getAllOrders = async () => {
//   return await db.select().from(orders);
// }
const getAllOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.db
        .select({
        id: schemas_1.orders.id,
        userId: schemas_1.orders.userId,
        productId: schemas_1.orders.productId,
        productQuantity: schemas_1.orders.productQuantity,
        totalAmount: schemas_1.orders.totalAmount,
        status: schemas_1.orders.status,
        createdAt: schemas_1.orders.createdAt,
        userName: schemas_1.userModel.username, // or userModel.username
    })
        .from(schemas_1.orders)
        .leftJoin(schemas_1.userModel, (0, drizzle_orm_1.eq)(schemas_1.orders.userId, schemas_1.userModel.userId));
});
exports.getAllOrders = getAllOrders;
// get orders by user
const getOrdersByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.db
        .select()
        .from(schemas_1.orders)
        .where((0, drizzle_orm_1.eq)(schemas_1.orders.userId, userId));
});
exports.getOrdersByUser = getOrdersByUser;
const updateOrderStatus = (orderId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const validStatuses = ["pending", "paid", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
        throw new Error("Invalid status");
    }
    yield database_1.db.update(schemas_1.orders).set({ status: status }).where((0, drizzle_orm_1.eq)(schemas_1.orders.id, orderId));
    return { message: `Order ${orderId} updated to ${status}` };
});
exports.updateOrderStatus = updateOrderStatus;

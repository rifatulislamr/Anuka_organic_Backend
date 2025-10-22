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
exports.getUserCart = exports.removeFromCart = exports.addToCart = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../config/database");
const schemas_1 = require("../schemas");
// Add product to cart (increase quantity if already exists)
const addToCart = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    // check if product already in cart
    const existing = yield database_1.db
        .select()
        .from(schemas_1.carts)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.carts.userId, userId), (0, drizzle_orm_1.eq)(schemas_1.carts.productId, productId)))
        .limit(1);
    if (existing.length > 0) {
        // ✅ increment quantity
        yield database_1.db
            .update(schemas_1.carts)
            .set({ quantity: existing[0].quantity + 1 })
            .where((0, drizzle_orm_1.eq)(schemas_1.carts.id, existing[0].id));
        return { message: "Product quantity updated in cart" };
    }
    // insert new cart item with quantity 1
    yield database_1.db.insert(schemas_1.carts).values({
        userId,
        productId,
        quantity: 1,
    });
    return { message: "Product added to cart" };
});
exports.addToCart = addToCart;
// export const removeFromCart = async (userId: number, productId: number) => {
//   await db
//     .delete(carts)
//     .where(and(eq(carts.userId, userId), eq(carts.productId, productId)));
//   return { message: "Product removed from cart" };
// };
//this is carts delete service for one by one quantity
const removeFromCart = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if product exists in cart
    const existing = yield database_1.db
        .select()
        .from(schemas_1.carts)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.carts.userId, userId), (0, drizzle_orm_1.eq)(schemas_1.carts.productId, productId)))
        .limit(1);
    if (existing.length === 0) {
        throw new Error("Product not found in cart");
    }
    const currentQuantity = existing[0].quantity;
    if (currentQuantity > 1) {
        // ✅ Decrement quantity by 1
        yield database_1.db
            .update(schemas_1.carts)
            .set({ quantity: currentQuantity - 1 })
            .where((0, drizzle_orm_1.eq)(schemas_1.carts.id, existing[0].id));
        return {
            message: "Product quantity decreased",
            quantity: currentQuantity - 1
        };
    }
    else {
        // ✅ Remove product completely when quantity is 1
        yield database_1.db
            .delete(schemas_1.carts)
            .where((0, drizzle_orm_1.eq)(schemas_1.carts.id, existing[0].id));
        return { message: "Product removed from cart" };
    }
});
exports.removeFromCart = removeFromCart;
const getUserCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItems = yield database_1.db
        .select({
        cartId: schemas_1.carts.id,
        productId: schemas_1.carts.productId,
        name: schemas_1.products.name,
        price: schemas_1.products.price,
        quantity: schemas_1.carts.quantity, // ✅ include quantity
        url: schemas_1.products.url,
        createdAt: schemas_1.carts.createdAt,
    })
        .from(schemas_1.carts)
        .innerJoin(schemas_1.products, (0, drizzle_orm_1.eq)(schemas_1.carts.productId, schemas_1.products.id))
        .where((0, drizzle_orm_1.eq)(schemas_1.carts.userId, userId));
    return cartItems;
});
exports.getUserCart = getUserCart;

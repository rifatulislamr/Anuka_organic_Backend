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
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schemas_1 = require("../schemas");
const database_1 = require("../config/database");
const createProduct = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [newProduct] = yield database_1.db.insert(schemas_1.products).values(data).$returningId();
    // Return full product data
    return Object.assign({ id: newProduct }, data);
});
exports.createProduct = createProduct;
const getProducts = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const conditions = [];
    if ((filters === null || filters === void 0 ? void 0 : filters.categoryId) !== undefined) {
        conditions.push((0, drizzle_orm_1.eq)(schemas_1.products.categoryId, filters.categoryId));
    }
    if ((filters === null || filters === void 0 ? void 0 : filters.isActive) !== undefined) {
        conditions.push((0, drizzle_orm_1.eq)(schemas_1.products.isActive, filters.isActive));
    }
    return yield database_1.db
        .select()
        .from(schemas_1.products)
        .where(conditions.length ? (0, drizzle_orm_1.and)(...conditions) : undefined);
});
exports.getProducts = getProducts;
const getProductById = (id, options) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield database_1.db.query.products.findFirst({
        where: (0, drizzle_orm_1.eq)(schemas_1.products.id, id),
        with: Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.withCategory) ? { category: true } : {})), ((options === null || options === void 0 ? void 0 : options.withReviews) ? { reviews: true } : {})),
    });
    return product;
});
exports.getProductById = getProductById;
const updateProduct = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.db.update(schemas_1.products).set(data).where((0, drizzle_orm_1.eq)(schemas_1.products.id, id));
    return yield database_1.db.query.products.findFirst({ where: (0, drizzle_orm_1.eq)(schemas_1.products.id, id) });
});
exports.updateProduct = updateProduct;
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.db.delete(schemas_1.products).where((0, drizzle_orm_1.eq)(schemas_1.products.id, id));
    return { message: "Product deleted successfully" };
});
exports.deleteProduct = deleteProduct;

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
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const database_1 = require("../config/database");
const schemas_1 = require("../schemas");
const drizzle_orm_1 = require("drizzle-orm");
const createCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [newCategory] = yield database_1.db.insert(schemas_1.categories).values(data).$returningId();
    return Object.assign({ id: newCategory }, data);
});
exports.createCategory = createCategory;
const getCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.db.select().from(schemas_1.categories);
});
exports.getCategories = getCategories;
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.db.query.categories.findFirst({
        where: (0, drizzle_orm_1.eq)(schemas_1.categories.id, id),
        with: { products: true },
    });
});
exports.getCategoryById = getCategoryById;
const updateCategory = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.db.update(schemas_1.categories).set(data).where((0, drizzle_orm_1.eq)(schemas_1.categories.id, id));
    return (0, exports.getCategoryById)(id);
});
exports.updateCategory = updateCategory;
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.db.delete(schemas_1.categories).where((0, drizzle_orm_1.eq)(schemas_1.categories.id, id));
    return { success: true };
});
exports.deleteCategory = deleteCategory;

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
exports.deleteCategoryController = exports.updateCategoryController = exports.getCategoryByIdController = exports.getCategoriesController = exports.createCategoryController = void 0;
const zod_1 = require("zod");
const categories_service_1 = require("../services/categories.service");
const categorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Category name is required"),
});
const createCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = categorySchema.parse(req.body);
        const category = yield (0, categories_service_1.createCategory)(data);
        res.status(201).json({ status: "success", data: category });
    }
    catch (err) {
        next(err);
    }
});
exports.createCategoryController = createCategoryController;
const getCategoriesController = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, categories_service_1.getCategories)();
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
exports.getCategoriesController = getCategoriesController;
const getCategoryByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const category = yield (0, categories_service_1.getCategoryById)(id);
        res.json({ status: "success", data: category });
    }
    catch (err) {
        next(err);
    }
});
exports.getCategoryByIdController = getCategoryByIdController;
const updateCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const data = categorySchema.partial().parse(req.body);
        const updated = yield (0, categories_service_1.updateCategory)(id, data);
        res.json({ status: "success", data: updated });
    }
    catch (err) {
        next(err);
    }
});
exports.updateCategoryController = updateCategoryController;
const deleteCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield (0, categories_service_1.deleteCategory)(id);
        res.json({ status: "success", data: result });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteCategoryController = deleteCategoryController;

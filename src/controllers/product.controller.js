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
exports.deleteProductController = exports.updateProductController = exports.getProductByIdController = exports.getProductsController = exports.createProductController = exports.productSchema = void 0;
const product_service_1 = require("../services/product.service");
const zod_1 = require("zod");
// export const productSchema = z.object({
//   name: z.string().min(1, "Product name is required"),
//   description: z.string().optional(),
//   url: z.string().url("Invalid product image URL"),
//   price: z.number().min(0, "Price must be greater than or equal to 0"),
//   stock: z.number().min(0, "Stock must be greater than or equal to 0"),
//   categoryId: z.number().int().min(1, "Category is required"),
//   isActive: z.boolean().default(true),
// });
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Product name is required"),
    description: zod_1.z.string().optional(),
    url: zod_1.z.string().url("Invalid URL").optional(), // optional now
    price: zod_1.z.number().min(0, "Price must be >= 0"),
    stock: zod_1.z.number().min(0, "Stock must be >= 0"),
    categoryId: zod_1.z.number().int().min(1, "Category is required"),
    isActive: zod_1.z.boolean().default(true),
});
const createProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse form-data (numbers/booleans) first
        const validatedData = exports.productSchema.parse(Object.assign(Object.assign({}, req.body), { price: Number(req.body.price), stock: Number(req.body.stock), categoryId: Number(req.body.categoryId), isActive: req.body.isActive === "true" || req.body.isActive === true }));
        // Ensure url is always a string for the service
        const dataForService = Object.assign(Object.assign({}, validatedData), { url: req.file
                ? `http://localhost:4000/uploads/${req.file.filename}` // full URL
                : "http://localhost:4000/uploads/default.jpg" });
        // Now TS knows url is string
        const product = yield (0, product_service_1.createProduct)(dataForService);
        res.status(201).json({ status: "success", data: product });
    }
    catch (err) {
        next(err);
    }
});
exports.createProductController = createProductController;
const getProductsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId, isActive } = req.query;
        const products = yield (0, product_service_1.getProducts)({
            categoryId: categoryId ? Number(categoryId) : undefined,
            isActive: isActive ? isActive === "true" : undefined,
        });
        res.json(products);
    }
    catch (err) {
        next(err);
    }
});
exports.getProductsController = getProductsController;
const getProductByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { withReviews, withCategory } = req.query;
        const product = yield (0, product_service_1.getProductById)(Number(req.params.id), {
            withReviews: withReviews === "true",
            withCategory: withCategory === "true",
        });
        if (!product) {
            res.status(404).json({ status: "error", message: "Product not found" });
            return;
        }
        res.json(product);
    }
    catch (err) {
        next(err);
    }
});
exports.getProductByIdController = getProductByIdController;
const updateProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = exports.productSchema.partial().parse(req.body);
        const updated = yield (0, product_service_1.updateProduct)(Number(req.params.id), data);
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
});
exports.updateProductController = updateProductController;
const deleteProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, product_service_1.deleteProduct)(Number(req.params.id));
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
exports.deleteProductController = deleteProductController;

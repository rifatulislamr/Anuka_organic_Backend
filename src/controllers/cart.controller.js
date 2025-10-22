"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getUserCartController = exports.removeFromCartController = exports.addToCartController = void 0;
const cartService = __importStar(require("../services/cart.service"));
const addToCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // populated by auth middleware
        const { productId } = req.body;
        if (!userId || !productId) {
            res.status(400).json({ message: "userId and productId are required" });
            return;
        }
        const result = yield cartService.addToCart(userId, productId);
        res.status(201).json(result);
    }
    catch (error) {
        console.error("❌ Error in addToCartController:", error.message);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
});
exports.addToCartController = addToCartController;
// export const removeFromCartController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const userId = req.user?.userId;
//     const productId = Number(req.params.productId);
//     if (!userId || !productId) {
//       res.status(400).json({ message: "userId and productId are required" });
//       return;
//     }
//     const result = await cartService.removeFromCart(userId, productId);
//     res.status(200).json(result);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };
// this is delete carts controller
const removeFromCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // Match addToCartController style
        const productId = Number(req.params.productId);
        if (!userId || !productId) {
            res.status(400).json({ message: "userId and productId are required" });
            return;
        }
        const result = yield cartService.removeFromCart(userId, productId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("❌ Error in removeFromCartController:", error.message);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
});
exports.removeFromCartController = removeFromCartController;
const getUserCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(400).json({ message: "userId is required" });
            return;
        }
        const cartItems = yield cartService.getUserCart(userId);
        res.status(200).json(cartItems);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUserCartController = getUserCartController;

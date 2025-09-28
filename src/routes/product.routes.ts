import { Router } from "express";
import {
  createProductController,
  getProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller";

const router = Router();

router.post("/create", createProductController);
router.get("/get", getProductsController);
router.get("/get/:id", getProductByIdController);
router.put("/update/:id", updateProductController);
router.delete("/delete/:id", deleteProductController);

export default router;

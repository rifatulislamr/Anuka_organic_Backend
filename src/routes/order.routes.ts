import { Router } from "express";
import {
  createOrderController,
  getOrdersByUserController,
  updateOrderStatusController,
} from "../controllers/order.controller";
import { authenticateUser } from "../middlewares/auth.middleware";


const router = Router();

router.post("/create-orders", authenticateUser, createOrderController);
router.get("/get-orders", authenticateUser, getOrdersByUserController);
router.put("/update-orders/:id/status", authenticateUser, updateOrderStatusController);

export default router;

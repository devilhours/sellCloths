// backend/routes/cart.routes.js
import express from "express";
import { addToCart, getCart, removeFromCart, updateCartItemQuantity } from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// All cart routes should be protected
router.get("/", protectRoute, getCart);
router.post("/add", protectRoute, addToCart);
router.delete("/remove/:productId", protectRoute, removeFromCart);
router.patch("/update", protectRoute, updateCartItemQuantity); 

export default router;
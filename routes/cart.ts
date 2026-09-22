import express from "express";

import {
  getCarts,
  storeCart,
  deleteCart,
  updateCart,
  clearCart,
} from "../controllers/cart";

import checkAuthentication from "../middlewares/checkAuthentication";

const router = express.Router();

router.get("/", checkAuthentication, getCarts);

router.post("/", checkAuthentication, storeCart);

router.put("/:id", checkAuthentication, updateCart);

router.delete("/", checkAuthentication, clearCart);

router.delete("/:id", checkAuthentication, deleteCart);

export default router;
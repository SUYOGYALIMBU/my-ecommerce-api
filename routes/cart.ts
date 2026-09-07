import express from "express"



import {
  getCarts,
  storeCart,
  deleteCart,
  updateCart,
} from "../controllers/cart";

import checkAuthentication from "../middlewares/checkAuthentication"

const router = express.Router();

router.get("/", checkAuthentication, getCarts);
router.post("/", checkAuthentication, storeCart);
router.put("/:id", checkAuthentication, updateCart);
router.delete("/:id", checkAuthentication, deleteCart);

// module.exports = router;
export default router

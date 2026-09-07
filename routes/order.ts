import express from "express";

import  {
  getOrders,
  storeOrder,
  deleteOrder,
  updateOrder,
  verifyOrder,
} from "../controllers/order"

import checkAuthentication from "../middlewares/checkAuthentication";

const OrderRouter = express.Router();

OrderRouter.get("/", checkAuthentication, getOrders);
OrderRouter.post("/", checkAuthentication, storeOrder);
OrderRouter.get("/verification", verifyOrder);
OrderRouter.put("/:id", checkAuthentication, updateOrder);
OrderRouter.delete("/:id", checkAuthentication, deleteOrder);

// module.exports = OrderRouter;
export default OrderRouter;

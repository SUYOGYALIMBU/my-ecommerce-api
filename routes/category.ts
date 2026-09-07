import express from "express"

import {
  getCategories,
  storeCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/category";


import checkAuthentication from "../middlewares/checkAuthentication"
import checkAdmin from "../middlewares/checkAdmin";

const router = express.Router();

router.get("/", getCategories);
router.post("/", checkAuthentication, checkAdmin, storeCategory);
router.put("/:id", checkAuthentication, checkAdmin, updateCategory);
router.delete("/:id", checkAuthentication, checkAdmin, deleteCategory);

// module.exports = router;
export default router;

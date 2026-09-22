import { Request } from "express";
import express from "express";
import multer from "multer";
import path from "path";

import {
  getProducts,
  getMyProducts,
  getProduct,
  storeProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/product.js";

import checkAuthentication from "../middlewares/checkAuthentication";

// const checkAdmin = require("../middlewares/checkAdmin");
import checkAdmin from "../middlewares/checkAdmin";

import Product from "../models/Product";

// const Product = require("../models/Product");

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
//     cb(null, file.fieldname + '-' + uniqueSuffix)
//   }
// })

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// ===============================
// GET MY PRODUCTS
// ===============================

router.get(
  "/api/products/mine",
  checkAuthentication,
  getMyProducts,
);

// ===============================
// GET SINGLE PRODUCT
// ===============================

router.get("/api/products/:id", getProduct);

// ===============================
// GET ALL PRODUCTS
// ===============================

router.get("/api/products", getProducts);

// ===============================
// CREATE PRODUCT
// ===============================

router.post(
  "/api/products",
  checkAuthentication,
  upload.array("photos", 12),
  storeProduct,
);

// ===============================
// UPDATE PRODUCT
// ===============================

router.put(
  "/api/products/:id",
  checkAuthentication,
  updateProduct,
);

// ===============================
// DELETE PRODUCT
// ===============================

router.delete(
  "/api/products/:id",
  checkAuthentication,
  deleteProduct,
);

// ===============================
// VERIFY PRODUCT
// ===============================

router.patch(
  "/api/products/verify/:id",
  checkAuthentication,
  checkAdmin,
  (req: Request) => {
    Product.update(
      {
        isVerified: true,
      },
      {
        where: {
          id: req.params.id,
        },
      },
    );
  },
);

export default router;
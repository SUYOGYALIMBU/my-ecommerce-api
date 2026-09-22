
import "dotenv/config";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";

import "./models/index.js";

import sequelize from "./connections/database";

import authRoutes from "./routes/auth";
import cartRoutes from "./routes/cart";
import categoryRoutes from "./routes/category";
import productRoutes from "./routes/product";
import OrderRoutes from "./routes/order";

const app = express();
const port = 4000;


// CORS
app.use(cors());

app.use(express.json());

app.use("/uploads", express.static("uploads"));

const middleware1 = (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  console.log("middelware1");
  next();
};

const middleware2 = (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  console.log("middelware2");
  next();
};

app.use(authRoutes);
app.use(productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", OrderRoutes);

app.get("/api", middleware2, middleware1, (req, res) => {
  res.send("welcome to chaitra ecommerce apiiii !");
});

const checkDbConnection = async () => {
  try {
    await sequelize.authenticate();

    await sequelize.sync({ alter: true });

    console.log("DB Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

checkDbConnection();

export default app;


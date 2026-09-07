// require("dotenv").config();
import 'dotenv/config'
// const express = require("express");
import express, { Request,Response,NextFunction } from "express"



// require("./models/index");
import ("./models/index.js")

import sequelize from "./connections/database";
const app = express();
const port = 4000;


// const authRoutes = require("./routes/auth");
import authRoutes from "./routes/auth"
import cartRoutes from "./routes/cart"
import categoryRoutes from "./routes/category"
import productRoutes from "./routes/product"
import OrderRoutes from "./routes/order"


// cors

app.use(express.json()); // global middleware : applicable to all api routes |  to read data from req.body
// app.use(checkAuthentication) // global middelware

app.use("/uploads", express.static("uploads"));

const middleware1 = (_req: Request, _res:Response, next:NextFunction) => {
  console.log("middelware1");
  next(); //netx valid middeleware in line
};

const middleware2 = (req: Request, res:Response, next:NextFunction) => {
  console.log("middelware2");
  next();
};

// app.use(middleware1); // global middleware
// app.use(middleware2); // global middleware
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
    // await sequelize.sync({ force: true }); // NOTE: this will remove all the datas from database
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

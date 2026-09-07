// model associations

import Cart from "./Cart";
import User from "./User";

// const User = require("./User");
// const Cart = require("./Cart");
import Product from "./Product";
import Category from "./Category";
import ProductImage from "./ProductImage";


import SubOrder from "./SubOrder";
import OrderItem from "./OrderItem";


Cart.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

Product.hasMany(Cart, {
  foreignKey: "productId",
  as: "Carts",
});

Product.hasMany(ProductImage, {
  foreignKey: "productId",
  as: "images",
});

User.hasMany(Product, {
  foreignKey: "userId",
  as: "products",
});

Product.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

Category.hasMany(Product, {
  foreignKey: "categoryId",
  as: "products",
});

console.log("binded");

// User.hasMany(Product)
// Product.belongsTo(User)

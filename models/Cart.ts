import { DataTypes } from "sequelize";
import User from "./User";

// const { DataTypes } = require("sequelize");
// import User = require("./User");

import Product from "./Product";
import sequelize from "../connections/database";

const Cart = sequelize.define(
  "Cart",
  {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
  },
  {
    tableName: "carts",
    underscored: true,
    timestamps: true,
  },
);

// module.exports = Cart;
export default Cart;

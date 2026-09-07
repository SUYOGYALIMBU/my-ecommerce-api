import { DataTypes } from "sequelize";
import SubOrder from "./SubOrder";
import Product from "./Product";

import sequelize from "../connections/database";
const OrderItem = sequelize.define(
  "OrderItem",
  {
    subOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SubOrder,
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "order_items",
    underscored: true,
    timestamps: true,
  },
);

export default OrderItem;

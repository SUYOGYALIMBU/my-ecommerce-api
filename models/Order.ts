import { DataTypes } from "sequelize";
import User from "./User";

import sequelize from "../connections/database";
const Order = sequelize.define(
  "Order",
  {
    orderNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM,
      values: ["pending", "accepted", "shipping", "completed", "rejected"],
      defaultValue: "pending",
    },
    paymentStatus: {
      type: DataTypes.ENUM,
      values: ["paid", "unpaid", "conflict"],
      defaultValue: "unpaid",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentMode: {
      type: DataTypes.ENUM,
      values: ["cod", "esewa"],
    },
  },
  {
    tableName: "orders",
    underscored: true,
    timestamps: true,
  },
);

export default Order;

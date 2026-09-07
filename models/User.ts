import { DataTypes } from "sequelize"

import sequelize from "../connections/database";

const User = sequelize.define(
  "User",
  {
    // id will be automatically created by sequalize.
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    // },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isSeller: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    shippingCharge: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    storeName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // testField: {
    //   allowNull: false,
    //   type: DataTypes.STRING,
    // },
    // role: {
    //   type: DataTypes.STRING,
    //   defaultValue: "buyer",
    //   values: ["buyer", "seller", "admin"],
    // },
  },
  {
    tableName: "users",
    underscored: true,
    timestamps: true,
  },
);

// module.exports = User;
export default User

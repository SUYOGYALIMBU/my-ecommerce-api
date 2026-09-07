import { DataTypes } from "sequelize";
import Product from "./Product";


import sequelize from "../connections/database";

const ProductImage = sequelize.define(
  "ProductImage",
  {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "product_images",
    underscored: true,
    timestamps: true,
  },
);

export default ProductImage;

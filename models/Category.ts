import { DataTypes } from "sequelize";

import sequelize from "../connections/database";

const Category = sequelize.define(
  "Category",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentCategoryId: {
      // parent_category_id
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "categories",
    underscored: true,
    timestamps: true,
  },
);

Category.hasMany(Category, {
  foreignKey: "parentCategoryId",
  as: "subCategories",
});

export default Category;

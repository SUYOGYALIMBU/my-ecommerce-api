import { Request, Response, NextFunction } from "express";

import Category from "../models/Category";

const getCategories = async (req: Request, res: Response) => {
  let categories = await Category.findAll({
    where: {
      parentCategoryId: null,
    },
    include: {
      model: Category,
      as: "subCategories",
      attributes: ['id', 'name']
    },
  }); // select * from categories
  res.send({
    data: categories,
  });
};

const storeCategory = async (req: Request, res: Response) => {
  try {
    let category = await Category.create({
      name: req.body.name,
      parentCategoryId: req.body.parentCategoryId,
    });

    res.send(category);
  } catch (err) {

    let msg = ""
    if (err instanceof Error) {
      msg = err.message
    }

    res.status(500).send({
      msg: "SERVER error",
      errorMsg: msg
    });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  res.send("categories updated");
  return;
  // zoi validation
  console.log(req.params.id);

  const cart = await Category.update(
    {
      title: req.body.title,
      price: req.body.price,
    },
    {
      where: {
        id: req.params.id,
      },
    },
  );

  res.send("cart update");
};

const deleteCategory = async (req: Request, res: Response) => {
  res.send("categories deleted");
  return;
  const cart = await Category.destroy({
    where: {
      id: req.params.id,
    },
  });

  res.send("cart deleted");
};

// named export
export {
  getCategories,
  storeCategory,
  updateCategory,
  deleteCategory,
};

import { Request,Response,NextFunction } from "express";
import Cart from "../models/Cart";


import Product from "../models/Product";

const getCarts = async (req: Request, res:  Response) => {
  let carts = await Cart.findAll({
    where: {
      userId: req.user.id,
    },
    include: {
      model: Product,
      as: "product",
    },
  }); // select * from carts
  res.send({
    data: carts,
  });
};

const storeCart = async (req: Request, res:  Response) => {
  try {
    let cart = await Cart.create({
      userId: req.user.id,
      productId: req.body.productId,
      quantity: req.body.quantity,
    });

    res.send(cart);
  } catch (err) {
    res.status(500).send({
      msg: "SERVER error",
    });
  }
};

const updateCart = async (req: Request, res:  Response) => {
  res.send("carts updated");
  return;
  // zoi validation
  console.log(req.params.id);

  const cart = await Cart.update(
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

const deleteCart = async (req: Request, res:  Response) => {
  console.log("porocuts deleting....");
  res.send("carts deleted");
  return;
  const cart = await Cart.destroy({
    where: {
      id: req.params.id,
    },
  });

  res.send("cart deleted");
};

// named export
export {
  getCarts,
  storeCart,
  updateCart,
  deleteCart,
};

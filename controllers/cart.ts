import { Request, Response } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";
import ProductImage from "../models/ProductImage";

const getCarts = async (req: Request, res: Response) => {
  try {
    const carts = await Cart.findAll({
      where: {
        userId: req.user.id,
      },
      include: {
        model: Product,
        as: "product",
        include: [
          {
            model: ProductImage,
            as: "images",
          },
        ],
      },
    });

    res.send({
      data: carts,
    });
  } catch (err) {
    console.error("Get cart error:", err);

    res.status(500).send({
      msg: "SERVER error",
      error: err instanceof Error ? err.message : err,
    });
  }
};

const storeCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.create({
      userId: req.user.id,
      productId: req.body.productId,
      quantity: req.body.quantity || 1,
    });

    res.send(cart);
  } catch (err) {
    console.error("Store cart error:", err);

    res.status(500).send({
      msg: "SERVER error",
      error: err instanceof Error ? err.message : err,
    });
  }
};

const updateCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.update(
      {
        quantity: req.body.quantity,
      },
      {
        where: {
          id: req.params.id,
          userId: req.user.id,
        },
      },
    );

    res.send({
      msg: "Cart updated",
      data: cart,
    });
  } catch (err) {
    console.error("Update cart error:", err);

    res.status(500).send({
      msg: "SERVER error",
      error: err instanceof Error ? err.message : err,
    });
  }
};

const deleteCart = async (req: Request, res: Response) => {
  try {
    const deleted = await Cart.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!deleted) {
      return res.status(404).send({
        msg: "Cart item not found",
      });
    }

    res.send({
      msg: "Cart item removed",
    });
  } catch (err) {
    console.error("Delete cart error:", err);

    res.status(500).send({
      msg: "SERVER error",
      error: err instanceof Error ? err.message : err,
    });
  }
};

const clearCart = async (req: Request, res: Response) => {
  try {
    await Cart.destroy({
      where: {
        userId: req.user.id,
      },
    });

    res.send({
      msg: "Cart cleared",
    });
  } catch (err) {
    console.error("Clear cart error:", err);

    res.status(500).send({
      msg: "SERVER error",
      error: err instanceof Error ? err.message : err,
    });
  }
};

export {
  getCarts,
  storeCart,
  updateCart,
  deleteCart,
  clearCart,
};
import axios from "axios";
import { Request, Response, NextFunction } from "express";

import { Op } from "sequelize";
import crypto from "crypto";

import Order from "../models/Order";
import Product from "../models/Product";
import User from "../models/User";
import SubOrder from "../models/SubOrder";
import OrderItem from "../models/OrderItem";
import Cart from "../models/Cart";

import sequelize from "../connections/database";

const getOrders = async (req: Request, res: Response) => {
  let orders = await Order.findAll({}); // select * from orders
  res.send({
    data: orders,
  });
};

const storeOrder = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();

  try {
    let date = new Date();
    let totalShippingCharge = 0;
    let totalProductPrice = 0;
    const realMonth = date.getMonth() + 1;
    let orderNo =
      "DRZ-" +
      realMonth +
      "-" +
      Date.now() +
      Math.floor(Math.random() * 1000000);

    let order = await Order.create(
      {
        orderNo,
        paymentMode: req.body.paymentMode,
        userId: req.user.id,
        address: req.body.address,
        phone: req.body.phone,
      },
      { transaction: t },
    );

    let products = req.body.products;
    // console.log(products);

    let cartPoducts = await Cart.findAll({
      where: {
        userId: req.user.id,
      },
      attributes: ["productId", "quantity"],
    });

    let cartProductIds = cartPoducts.map((el: InstanceType<typeof Cart>) =>
      el.getDataValue("productId"),
    );

    let sellers = await User.findAll({
      include: {
        model: Product,
        as: "products",
        where: {
          id: {
            [Op.in]: cartProductIds,
          },
        },
      },
    });

    // sellers.forEach(async (seller) => {
    for (const seller of sellers) {
      let subOrder = await SubOrder.create(
        {
          orderId: order.getDataValue("id"),
          sellerId: seller.getDataValue("id"),
          shippingCharge: seller.getDataValue("shippingCharge"),
        },
        { transaction: t },
      );

      totalShippingCharge += seller.getDataValue("shippingCharge");

      // seller.products.forEach(async (product) => {
      for (const product of seller.getDataValue("products")) {
        let productQty =
          cartPoducts
            .find(
              (el: InstanceType<typeof Cart>) =>
                el.getDataValue("productId") == product.getDataValue("id"),
            )
            ?.getDataValue("quantity") ?? 0;
        await OrderItem.create(
          // await OrderItem.bulkCreate(
          {
            subOrderId: subOrder.getDataValue("id"),
            productId: product.getDataValue("id"),
            quantity: productQty,
            price: product.getDataValue("price"),
            productName: product.getDataValue("title"),
          },
          { transaction: t },
        );

        totalProductPrice += productQty * product.getDataValue("price");
      }
    }

    let esewaPayload = undefined;

    let totalAmount = totalProductPrice + totalShippingCharge;

    if (req.body.paymentMode == "esewa") {
      let productCode = "EPAYTEST";
      const message = `total_amount=${totalAmount},transaction_uuid=${orderNo},product_code=${productCode}`;

      let signature = crypto
        .createHmac("sha256", "8gBm/:&EnhH.1/q")
        .update(message)
        .digest("base64");

      esewaPayload = {
        amount: totalAmount,
        tax_amount: 0,
        total_amount: totalAmount,
        transaction_uuid: orderNo,
        product_code: productCode,
        product_service_charge: 0,
        product_delivery_charge: 0,
        succeess_url: "http://localhost:5173/order-success",
        failure_url: "http://localhost:5173/order-failture",
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: signature,
      };
    }

    await t.commit();
    console.log(2222222222);
    res.send({
      msg: "order created",
      esewaPayload,
    });
  } catch (err) {
    await t.rollback();
    res.status(500).send({
      msg: "SERVER error",
    });
  }
};

const updateOrder = async (req: Request, res: Response) => {
  res.send("orders updated");
  return;
  // zoi validation
  console.log(req.params.id);

  const cart = await Order.update(
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

const deleteOrder = async (req: Request, res: Response) => {
  res.send("orders deleted");
  return;
  const cart = await Order.destroy({
    where: {
      id: req.params.id,
    },
  });

  res.send("cart deleted");
};

const verifyOrder = async (req: Request, res: Response) => {
  const base64 = req.query.token as string;
  // Decode Base64
  const decodedString = Buffer.from(base64, "base64").toString("utf8");

  // Parse JSON
  const data = JSON.parse(decodedString);

  let response = await axios.get(
    `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=EPAYTEST&total_amount=${data.total_amount}&transaction_uuid=${data.transaction_uuid}`,
  );

  if (response.data.status == "COMPLETE") {
    await Order.update(
      {
        paymentStatus: "paid",
      },
      {
        where: {
          orderNo: data.transaction_uuid,
        },
      },
    );
  }

  res.send("success");
};

// named export
export { getOrders, storeOrder, updateOrder, deleteOrder, verifyOrder };

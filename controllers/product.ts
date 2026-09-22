import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { Op, Sequelize, OrderItem } from "sequelize";

import Product from "../models/Product.js";
import Category from "../models/Category";
import ProductImage from "../models/ProductImage.js";

cloudinary.config({
  cloud_name: String(process.env.CLOUDINARY_CLOUD_NAME),
  api_key: String(process.env.CLOUDINARY_API_KEY),
  api_secret: String(process.env.CLOUDINARY_API_SECRET),
});

// ===============================
// GET ALL PRODUCTS
// ===============================

const getProducts = async (req: Request, res: Response) => {
  try {
    let limit = 25;
    let page = 1;
    let searchTerm = "";
    let sortBy: OrderItem = ["createdAt", "DESC"];
    let categoryIds: string[] = [];

    if (req.query.categoryIds) {
      categoryIds = (req.query.categoryIds as string).split(",");
    }

    const sort = req.query.sort as string;

    if (sort === "priceAsc" || sort === "priceASC") {
      sortBy = ["price", "ASC"];
    } else if (sort === "priceDesc" || sort === "priceDESC") {
      sortBy = ["price", "DESC"];
    } else if (sort === "latest") {
      sortBy = ["createdAt", "DESC"];
    } else if (sort === "oldest") {
      sortBy = ["createdAt", "ASC"];
    } else if (sort === "titleA-Z") {
      sortBy = [
        Sequelize.fn("lower", Sequelize.col("title")),
        "ASC",
      ];
    } else if (sort === "titleZ-A") {
      sortBy = [
        Sequelize.fn("lower", Sequelize.col("title")),
        "DESC",
      ];
    }

    if (req.query.limit) {
      limit = parseInt(req.query.limit as string);
    }

    if (req.query.page) {
      page = parseInt(req.query.page as string);
    }

    if (req.query.q) {
      searchTerm = req.query.q as string;
    }

    let categoryCondition: any = {};

    if (categoryIds.length > 0) {
      categoryCondition = {
        id: {
          [Op.in]: categoryIds,
        },
      };
    }

    const result = await Product.findAndCountAll({
      where: {
        title: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },

      include: [
        {
          model: Category,
          as: "category",
          where: categoryCondition,
        },
        {
          model: ProductImage,
          as: "images",
        },
      ],

      limit,
      offset: (page - 1) * limit,
      order: [sortBy],
    });

    const products = result.rows.map((product: any) => {
      const productData = product.toJSON();

      productData.images = (productData.images || []).map(
        (img: any) => ({
          id: img.id,
          image: img.path,
        }),
      );

      return productData;
    });

    res.send({
      data: {
        products,
        total: result.count,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      message: "Failed to load products",
      error,
    });
  }
};

// ===============================
// GET MY PRODUCTS
// ===============================

const getMyProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      where: {
        userId: req.user.id,
      },

      include: [
        {
          model: Category,
          as: "category",
        },
        {
          model: ProductImage,
          as: "images",
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    const productData = products.map((product: any) => {
      const data = product.toJSON();

      data.images = (data.images || []).map((img: any) => ({
        id: img.id,
        image: img.path,
      }));

      return data;
    });

    res.send({
      data: {
        products: productData,
      },
    });
  } catch (error) {
    console.error("My products error:", error);

    res.status(500).send({
      message: "Failed to load your products",
      error,
    });
  }
};

// ===============================
// GET SINGLE PRODUCT
// ===============================

const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(
      Number(req.params.id),
      {
        include: [
          {
            model: Category,
            as: "category",
          },
          {
            model: ProductImage,
            as: "images",
          },
        ],
      },
    );

    if (!product) {
      return res.status(404).send({
        message: "Product not found",
      });
    }

    const productData: any = product.toJSON();

    productData.images = (productData.images || []).map(
      (img: any) => ({
        id: img.id,
        image: img.path,
      }),
    );

    res.send({
      data: productData,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      message: "Failed to load product",
      error,
    });
  }
};



const storeProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user.isSeller) {
      return res.status(403).send({
        msg: "forbidden",
      });
    }

    const {
      title,
      description,
      price,
      stock,
      categoryId,
    } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      stock,
      userId: req.user.id,
      categoryId,
    });

    // Get uploaded files from multer
    const files =
      (req.files as Express.Multer.File[]) || [];

    // Upload images to Cloudinary
    for (const file of files) {
      const uploadResult: any = await new Promise(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "furnew-products",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              },
            )
            .end(file.buffer);
        },
      );

      await ProductImage.create({
        path: uploadResult.secure_url,
        productId: product.getDataValue("id"),
      });
    }

    const createdProduct = await Product.findByPk(
      product.getDataValue("id"),
      {
        include: [
          {
            model: Category,
            as: "category",
          },
          {
            model: ProductImage,
            as: "images",
          },
        ],
      },
    );


    const productData: any =
      createdProduct?.toJSON();

    if (productData) {
      productData.images = (
        productData.images || []
      ).map((img: any) => ({
        id: img.id,
        image: img.path,
      }));
    }

    res.send({
      data: productData,
    });
  } catch (error) {
    console.error("Product upload error:", error);

    res.status(500).send({
      message: "Failed to create product",
      error,
    });
  }
};


const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    const product = await Product.findOne({
      where: {
        id: productId,
        userId: req.user.id,
      },
    });

    if (!product) {
      return res.status(404).send({
        message: "Product not found",
      });
    }

    const { title, description, price, stock, categoryId } = req.body;

    await product.update({
      title,
      description,
      price,
      stock,
      categoryId,
    });

    res.send({
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).send({
      message: "Failed to update product",
    });
  }
};



const deleteProduct = async (
  req: Request,
  res: Response,
) => {
  try {
    const productId = Number(req.params.id);

    const product = await Product.findOne({
      where: {
        id: productId,
        userId: req.user.id,
      },
    });

    if (!product) {
      return res.status(404).send({
        message: "Product not found",
      });
    }


    await ProductImage.destroy({
      where: {
        productId: productId,
      },
    });

  
    await product.destroy();

    res.send({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).send({
      message: "Failed to delete product",
    });
  }
};

export {
  getProducts,
  getMyProducts,
  getProduct,
  storeProduct,
  updateProduct,
  deleteProduct,
};
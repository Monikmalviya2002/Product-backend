import express from "express";
import Product from "../models/product.js";
import userAuth from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const productRouter = express.Router();

        const storage = multer.diskStorage({
           destination: function (req, file, cb) {
    const uploadPath = "uploads/";
           if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
           cb(null, uploadPath);
             },
           filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
           });
const upload = multer({ storage });


           productRouter.post("/create", userAuth, upload.array("images"), async (req, res) => {
      try {
    const { productName, productType, quantityStock, mrp, sellingPrice, brandName, exchangeEligible, status } = req.body;

   
    if (!productName || productName.trim() === "") return res.status(400).json({ message: "Product name is required!" });
      if (!productType || productType.trim() === "") return res.status(400).json({ message: "Product type is required!" });
    if (quantityStock == null) return res.status(400).json({ message: "Quantity stock is required!" });
     if (mrp == null) return res.status(400).json({ message: "MRP is required!" });
    if (sellingPrice == null) return res.status(400).json({ message: "Selling price is required!" });
    if (!brandName || brandName.trim() === "") return res.status(400).json({ message: "Brand name is required!" });

    
    const images = req.files ? req.files.map(file => file.path) : [];

    const product = new Product({
      productName,
      productType,
      quantityStock,
      mrp,
      sellingPrice,
      brandName,
      images,
      exchangeEligible: exchangeEligible === "true" || exchangeEligible === true,
      status: status || "UNPUBLISHED",
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct:", error.message);
    res.status(500).json({ message: error.message });
  }
      });


       productRouter.post("/update/:id", userAuth, upload.array("images"), async (req, res) => {
            try {
    const { id } = req.params;
    const { productName, productType, quantityStock, mrp, sellingPrice, brandName, exchangeEligible, status } = req.body;

    if (!id) return res.status(400).json({ message: "Please provide a product id" });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found!" });

    
    if (productName) product.productName = productName;
    if (productType) product.productType = productType;
    if (quantityStock != null) product.quantityStock = quantityStock;
    if (mrp != null) product.mrp = mrp;
    if (sellingPrice != null) product.sellingPrice = sellingPrice;
    if (brandName) product.brandName = brandName;
    if (exchangeEligible != null) product.exchangeEligible = exchangeEligible === "true" || exchangeEligible === true;
    if (status) product.status = status;

   
    if (req.files && req.files.length > 0) {
      product.images = req.files.map(file => file.path);
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.log("Error in updateProduct:", error.message);
    res.status(500).json({ message: error.message });
  }
});


         productRouter.get("/products", userAuth, async (req, res) => {
            try {
    const products = await Product.find();
    res.status(200).json({ length: products.length, products });
           } catch (error) {
    console.log("Error in getProducts:", error.message);
    res.status(500).json({ message: error.message });
  }
         });


           productRouter.get("/product/:id", userAuth, async (req, res) => {
             try {
            const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Please provide a product id" });

          const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found!" });

    res.status(200).json(product);
          } catch (error) {
    console.log("Error in getProduct:", error.message);
    res.status(500).json({ message: error.message });
  }
          });


           productRouter.delete("/delete/:id", userAuth, async (req, res) => {
              try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found!" });

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.log("Error in deleteProduct:", error.message);
    res.status(500).json({ message: error.message });
  }
});

export default productRouter;

import express from "express";
import Product from "../models/product.js";
import userAuth from "../middleware/auth.js";

const productRouter = express.Router();


productRouter.post("/create", userAuth, async (req, res) => {
  try {
    const { productName, productType, quantityStock, mrp, sellingPrice, brandName, images, exchangeEligible, status } = req.body;

              if (!productName || productName.trim() === "") {
      return res.status(400).json({ message: "Product name is required!" });
            }
     if (!productType || productType.trim() === "") {
      return res.status(400).json({ message: "Product type is required" });
         }
    if (quantityStock == null) {
         return res.status(400).json({ message: "Quantity stock is required!" });
    }
       if (mrp == null) {
      return res.status(400).json({ message: "MRP is required!" });
         }
    if (sellingPrice == null) {
      return res.status(400).json({ message: "Selling price is required!" });
      }
         if (!brandName || brandName.trim() === "") {
          return res.status(400).json({ message: "Brand name is required!" });
    }

    const product = new Product({
       productName,
      productType,
      quantityStock,
       mrp,
      sellingPrice,
      brandName,
       images,
      exchangeEligible,
       status,
    });

        await product.save();
         res.status(201).json(product);
            } catch (error) {
        console.log("Error in createProduct: ", error.message);
       res.status(500).json({ message: error.message });
        }
        });
  
         productRouter.get("/products", userAuth, async (req, res) => {
          try {
           const products = await Product.find();

           res.status(200).json({
           length: products.length,
            products,
             });
            } catch (error) {
            console.log("Error in getProducts:", error.message);
          res.status(500).json({ message: error.message });
             }
            });


           productRouter.get("/product/:id", userAuth, async (req, res) => {
              try {
              const { id } = req.params;

               if (!id) {
             return res.status(400).json({ message: "Please provide a product id" });
                 }

                const product = await Product.findById(id);

             if (!product) {
             return res.status(404).json({ message: "Product not found!" });
                }

             res.status(200).json(product);
              } catch (error) {
             console.log("Error in getProduct: ", error.message);
             res.status(500).json({ message: error.message });
               }
               });


              productRouter.post("/update/:id", userAuth, async (req, res) => {
               try {
         const { id } = req.params;
     const { productName, productType, quantityStock, mrp, sellingPrice, brandName, images, exchangeEligible, status } 
               =req.body;

        if (!id) {
      return res.status(400).json({ message: "Please provide a product id" });
    }

         const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({ message: "Product not found!" });
    }

   
    if (productName) product.productName = productName;
       if (productType) product.productType = productType;
       if (quantityStock != null) product.quantityStock = quantityStock;
        if (mrp != null) product.mrp = mrp;
     if (sellingPrice != null) product.sellingPrice = sellingPrice;
  if (brandName) product.brandName = brandName;
      if (images) product.images = images;
    if (exchangeEligible != null) product.exchangeEligible = exchangeEligible;
      if (status) product.status = status;

           await product.save();
    return res.status(200).json(product);
            } catch (error) {
    console.log("Error in updateProduct:", error.message);
       res.status(500).json({ message: error.message });
  }
        });


           productRouter.delete("/delete/:id", userAuth, async (req, res) => {
              try {
         const { id } = req.params;

        const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.log("Error in deleteProduct: ", error.message);
    res.status(500).json({ message: error.message });
  }
});

export default productRouter;

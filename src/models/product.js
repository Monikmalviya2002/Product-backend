import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    productType: {
      type: String,
      required: true,
      index: true, 
    },

    quantityStock: {
      type: Number,
      required: true,
      min: 0,
    },

    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    brandName: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        type: String, 
      },
    ],

    exchangeEligible: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["PUBLISHED", "UNPUBLISHED"],
      default: "UNPUBLISHED",
    },
  },
  { timestamps: true }
);

       const Product = mongoose.model("Product", productSchema);
          export default Product;

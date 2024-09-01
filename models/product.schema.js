import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      trim: true,
      maxLength: [120, "Product name should be 120 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a Product Price"],
      maxLength: [5, "Product Price should not be more than 5 digits"],
    },
    description: {
      type: String,
      //use some form editors-- personal assignment
    },
    photos: [
      {
        secure_url: {
          type: String,
          required: [true],
        },
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);

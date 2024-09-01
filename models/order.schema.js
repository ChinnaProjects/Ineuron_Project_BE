import mongoose, { Types } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectID,
            ref: Product,
            required: true,
          },
          price: Number,
          count: Number,
        },
      ],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectID,
      ref: User,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    couponCode: String,
    transractionId: String,
    status: {
      type: String,
      enum: ["ORDERED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "ORDERED",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);

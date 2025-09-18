// backend/models/product.model.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    ratings: { type: Number, required: true, min: 0, max: 5, default: 0 },
    image: { type: String, required: true },
    
    // --- NEW FIELD ---
    // This links the product to the user who created it.
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This must match the name you used when creating the User model
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
// backend/controllers/cart.controller.js
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

// --- Add an item to the cart ---
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cartItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

    if (cartItemIndex > -1) {
      // If item already exists in cart, update quantity
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      // If item is not in cart, add it
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.status(200).json({ message: "Item added to cart", cart: user.cart });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// --- Get the user's cart ---
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    // Populate the product details for each item in the cart
    const user = await User.findById(userId).populate({
      path: 'cart.productId',
      model: 'Product'
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// --- Remove an item from the cart ---
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params; // Get productId from URL parameters
        const userId = req.user._id;

        const user = await User.findById(userId);
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);

        await user.save();
        res.status(200).json({ message: "Item removed from cart", cart: user.cart });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const updateCartItemQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;

        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1." });
        }

        await User.updateOne(
            { _id: userId, "cart.productId": productId },
            { $set: { "cart.$.quantity": quantity } }
        );

        res.status(200).json({ message: "Cart updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
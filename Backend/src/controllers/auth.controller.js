// backend/controllers/auth.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    generateToken(newUser._id, res);

    // CORRECTED: Send the user object directly as the response
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      cart: newUser.cart,
    });
  } catch (error) {
    console.error("Error in signup controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    generateToken(user._id, res);

    // CORRECTED: Send the user object directly as the response
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error in login controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    // CORRECTED: Properly expire the cookie
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in logout controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleFavorite = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const user = await User.findById(userId);
        const isFavorited = user.favorites.includes(productId);

        if (isFavorited) {
            // Remove from favorites
            await User.updateOne({ _id: userId }, { $pull: { favorites: productId } });
            res.status(200).json({ message: "Product removed from favorites." });
        } else {
            // Add to favorites
            await User.updateOne({ _id: userId }, { $addToSet: { favorites: productId } });
            res.status(200).json({ message: "Product added to favorites." });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullName, profilePic } = req.body;
        const userId = req.user._id;
        
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.fullName = fullName || user.fullName; // Update fullName if provided

        if (profilePic) {
            if(user.profilePic) {
                const publicId = user.profilePic.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            user.profilePic = uploadResponse.secure_url;
        }

        const updatedUser = await user.save();
        updatedUser.password = undefined; // Remove password from response

        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // CORRECTED: Send the user object directly
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in checkAuth controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

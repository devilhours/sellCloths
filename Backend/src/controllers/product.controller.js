import express from 'express';
import dotenv from 'dotenv';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import cloudinary from '../lib/cloudinary.js';

dotenv.config();

const router = express.Router();

// POST /api/products -> Add a new product
// export const addProduct = async (req, res) => {
//     const { name, price, ratings, description, image} = req.body;
  
//     try {   
//         if (!name || !price || !ratings || !description || !image) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         if(ratings < 0 || ratings > 5) {
//             return res.status(400).json({ message: 'Ratings must be between 0 and 5' });
//         }

//         const imageUrl = await cloudinary.uploader.upload(image);

//         const newProduct = new Product({
//             name,
//             price,
//             ratings,
//             description,
//             image: imageUrl.secure_url || ''
//         });

//         if (newProduct) {
//             await newProduct.save();

//             res.status(201).json({
//                 message: 'Product added successfully',
//              });
//         } else {
//             res.status(400).json({ message: 'Product addition failed' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, ratings, image } = req.body;
    const sellerId = req.user._id; // We get this from our authentication middleware

    const imageUrl = await cloudinary.uploader.upload(image);

    const newProduct = new Product({
      name,
      description,
      price,
      ratings,
      image: imageUrl.secure_url || '',
      soldBy: sellerId, // Assign the logged-in user as the seller
    });

    await newProduct.save();

    // To return the seller's name, we need to populate it
    const productWithOwner = await Product.findById(newProduct._id).populate("soldBy", "fullName");

    res.status(201).json({ message: "Product added successfully", product: productWithOwner });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// -- getProducts ---
export const getProducts = async (req, res) => {
  try {
    // Use .populate() to fetch the seller's details along with each product
    const products = await Product.find({}).populate("soldBy", "fullName"); // "fullName" means we only want the fullName field from the User document
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// GET /api/products/:id -> Get a single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
};

// DELETE /api/products/:id -> Delete a product by ID
export const deleteProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
};

// PUT /api/products/:id -> Update a product by ID
export const updateProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.name = req.body.name;
        product.price = Number(req.body.price);
        product.ratings = Number(req.body.ratings);
        product.description = req.body.description;
        product.image = req.body.image;
        
        await product.save();
        res.json({ message: 'Product updated!', product });
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
};

// PATCH /api/products/:id/favorite -> Toggle favorite for a product
export const toggleFavorite = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        } else {
            product.isFavorite = !product.isFavorite;
            await product.save();
            res.json({ message: 'Product favorite status toggled', isFavorite: product.isFavorite });
        }
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
};

export default router;

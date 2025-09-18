// backend/routes/product.routes.js
import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { addProduct, deleteProductById, getProductById, getProducts, toggleFavorite, updateProductById } from '../controllers/product.controller.js';
import { checkAuth } from '../controllers/auth.controller.js';


const router = express.Router();

// GET /api/products -> Get all products
router.get('/getproducts', getProducts);
router.get('/getproducts/id', getProductById);

// POST /api/products -> Add a new product
router.post('/addproduct', protectRoute, addProduct);

// PATCH /api/products/:id/favorite -> Toggle favorite for a product
router.patch('/:id/favorite', protectRoute, toggleFavorite);

// PUT /api/products/:id -> Update a product by ID
router.put('/:id', protectRoute, updateProductById);

// DELETE /api/products/:id -> Delete a product by ID
router.delete('/:id', protectRoute, deleteProductById);

router.get('/check', protectRoute, checkAuth);


export default router;

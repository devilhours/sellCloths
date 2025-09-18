import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

export const protectRoute = async (req, res, next) => {
   try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }

        const user = await User.findById(decoded.userID).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        req.user = user;
        next();
    
   } catch (error) {
       console.error(`Error: ${error.message}`);
       res.status(401).json({ message: 'Not authorized, token failed' });
   }
}
import mongooge from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


export const connectDB = async () => {
    try {
        const conn = await mongooge.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
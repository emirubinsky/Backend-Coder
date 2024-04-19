import dotenv from 'dotenv';
import path from 'path';

// Ruta al archivo .env
const envPath = path.resolve(__dirname, '../../.env');


dotenv.config({ path: envPath });


export const MONGO_URL = process.env.MONGO_URL;
export const JWT_SECRET = process.env.JWT_SECRET; 
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const CALLBACK_URL = process.env.CALLBACK_URL;
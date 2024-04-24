import { fileURLToPath } from "url";
import path, { dirname } from "path";
import multer from "multer";
import dotenv from "dotenv";
import bcrypt from 'bcrypt'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, './.env') });

export const MONGO_URL = process.env.MONGO_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const CALLBACK_URL = process.env.CALLBACK_URL;
export const APP_SESSION_SECRET = process.env.APP_SESSION_SECRET;

export function getProductsFilePath() {
    return path.join(__dirname, "../productos.json");
}

export function getCartFilePath() {
    return path.join(__dirname, "../carrito.json");
}

export function configureProductMulter() {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, 'public', 'img'));
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    });

    return multer({ storage: storage });
}

export default __dirname;

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => {
    console.log(
        `Datos a validar: user-password: ${user.password}, password: ${password}`
    );
    return bcrypt.compareSync(password, user.password);
};

console.log("Loading UTILS ... <<<<<<<<<<--------------");
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";
import multer from "multer";
import bcrypt from 'bcrypt'

// import { customLogger } from './appHelpers/logger.helper.js';

console.log("UTIL starting")

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

console.log("UTIL > DIRNAME declarations", {
    __filename,
    __dirname
})

console.log("UTIL >  process.argv",  process.argv)

const enviroment = getMode()

console.log("UTIL > enviroment declarations", enviroment)

let path_enviroment = ""
switch (enviroment) {
    case "DEVELOPMENT":
        path_enviroment = './.env.development'
        break;
    case "STAGING":
        path_enviroment = './.env.staging'
        break;
    case "PRODUCTION":
        path_enviroment = './.env.production'
        break;
}


// TODO : Esto separarlo en un config.js aparte pare solo manejar lecturas
// Esto hace kick-off del proceso de lectura de archivo .env

console.log("UTIL > path resolution", path.resolve(__dirname, './.env'))

dotenv.config({ path: path.resolve(__dirname, path_enviroment) });

// Si el scripting en package.json funciona...entonces podemos leer directamente el process.env

export const PORT = process.env.PORT
export const MONGO_URL = process.env.MONGO_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const CALLBACK_URL = process.env.CALLBACK_URL;
export const APP_SESSION_SECRET = process.env.APP_SESSION_SECRET;
export const MAIL_USERNAME = process.env.MAIL_USERNAME
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD
export const TWILIO_SSID = process.env.TWILIO_SSID
export const AUTH_TOKEN = process.env.AUTH_TOKEN
export const PHONE_NUMBER = process.env.PHONE_NUMBER
export const PHONE_NUMBER_TO = process.env.PHONE_NUMBER_TO

console.log("UTIL ending, these are the .env readings", {
    PORT,
    MONGO_URL,
    JWT_SECRET,
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL,
    APP_SESSION_SECRET,
    MAIL_USERNAME,
    MAIL_PASSWORD,
    TWILIO_SSID,
    AUTH_TOKEN,
    PHONE_NUMBER,
    PHONE_NUMBER_TO,
})

function getMode() {
    const modeIndex = process.argv.indexOf('--mode');
    if (modeIndex !== -1 && process.argv[modeIndex + 1]) {
        return process.argv[modeIndex + 1].toUpperCase();
    }
    throw new Error('Mode not specified or invalid');
}


export function getProductsFilePath() {
    return path.join(__dirname, "../productos.json");
}

export function getCartFilePath() {
    return path.join(__dirname, "../carrito.json");
}

export function configureProductMulter() {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, 'public', 'img', 'products'));//, 'products'
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    });

    return multer({
        storage: storage,
        onError: function (err, next) {

            console.log("Multer upload Error", err)
            next()
        }
    });
}

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => {
    console.log(
        `Datos a validar: user-password: ${user.password}, password: ${password}`
    );
    return bcrypt.compareSync(password, user.password);
};

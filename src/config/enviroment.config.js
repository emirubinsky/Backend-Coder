import __dirname from './dirname.config'
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, './.env') });

export const PORT = process.env.PORT;
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

console.log("ENVIROMENT CONFIG ending, these are the .env readings", {
    ...process.env
})
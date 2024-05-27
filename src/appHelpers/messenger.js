import nodemailer from "nodemailer";
import twilio from "twilio";
import {
    __dirname,
    MAIL_USERNAME,
    MAIL_PASSWORD,
    TWILIO_SSID,
    AUTH_TOKEN,
    PHONE_NUMBER,
    PHONE_NUMBER_TO
} from "../util.js";

import { customLogger } from '../appHelpers/logger.helper.js';
customLogger.info("Messenger > LISTO")

// Nodemailer setup
const mailOptions = {
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    port: 587,
    auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
    },
};
const transport = nodemailer.createTransport(mailOptions);

// Twilio setup
const client = twilio(TWILIO_SSID, AUTH_TOKEN);

const mandarEmail = async ({ datos }) => {
    const { to, subject, message } = datos;
    const htmlContent = `<div>
                          <h1>${subject}</h1>
                          <p>${message}</p>
                       </div>`;

    try {
        const result = await transport.sendMail({
            from: `Organica - <${MAIL_USERNAME}>`,
            to: to,
            subject: subject,
            html: htmlContent,
        });
        customLogger.debug("Correo enviado", result);
    } catch (error) {
        customLogger.error("Error enviando correo:", {
            to, subject, message,
            error,
            stack: error.stack
        });
    }
};

const mandarSms = async (datos) => {
    const { to, message } = datos;
    try {
        const result = await client.messages.create({
            body: message,
            to: to, // cliente
            from: PHONE_NUMBER, // número de Twilio
        });
        customLogger.debug("Mensaje enviado", result);
    } catch (error) {
        customLogger.error("Error enviando SMS:", { ...error });
    }
};

export default {
    mandarEmail,
    mandarSms,
};

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
        console.log("Correo enviado", result);
    } catch (error) {
        console.error("Error enviando correo:", {
            to, subject, message,
            error
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
        console.log("Mensaje enviado", result);
    } catch (error) {
        console.error("Error enviando SMS:", error);
    }
};

export default {
    mandarEmail,
    mandarSms,
};

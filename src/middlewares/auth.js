import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../util.js"

// Esta función middleware es más robusta
export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ status: "error", message: "No autorizado" });
    }

    console.log(authHeader);

    const token = authHeader.split(" ")[1];

    // Error para ver, cada vez que realizo un logout, se produce el error de JsonWebTokenError: jwt malformed
    jwt.verify(token, JWT_SECRET, (error, credentials) => {
        console.log(error);

        if (error) {
            console.error('JWT Verification Error:', error);
            // Handle the error appropriately
            return res.status(401).send({ status: "error", message: "Unauthorized" });
        }

        req.user = credentials.user;
        next();
    })
}

// Esta funcion es la que usó el profe en clase22
export function auth(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    next();
}
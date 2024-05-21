import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../util.js"

// Esta función middleware es más robusta
// TODO: Hacerla funcionar
export const authToken = (req, res, next) => {
    console.log("-------------------------------------------------")
    console.log("MIDDLEWARE authToken", req.session)
    if (!req.session || !req.session.user) {
        console.log("MIDDLEWARE auth > authToken a login", req.session)
        return res.redirect("/login");
    }
    console.log("-------------------------------------------------")
    next();
    /*
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies.jwt//jwtToken;

    console.log("authToken", { authHeader, cookieToken })

    // Verificar si el token está presente en el encabezado de autorización o en la cookie jwtToken
    const token = authHeader ? authHeader.split(" ")[1] : cookieToken;

    if (!token) {
        return res.status(401).send({ status: "error", message: "No autorizado" });
    }

    jwt.verify(token, config.jwtSecret, (error, user) => {
        if (error) {
            console.error('JWT Verification Error:', error);
            return res.status(401).send({ status: "error", message: "Unauthorized" });
        }

        req.user = user;
        next();
    });
    */
}

// Esta funcion es la que usó el profe en clase22
export function auth(req, res, next) {
    console.log("-------------------------------------------------")
    console.log("MIDDLEWARE auth", req.session)
    if (!req.session || !req.session.user) {
        console.log("MIDDLEWARE auth > redirect a login", req.session)
        return res.redirect("/login");
    }
    console.log("-------------------------------------------------")
    next();
}


// Middleware de autenticación para admin
export const isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({ message: 'Acceso no autorizado' });
    }
};

// Middleware de autenticación para user
export const isUser = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'user') {
        next();
    }
    else {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
}
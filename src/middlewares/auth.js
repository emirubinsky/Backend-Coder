import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../util.js"

import { customLogger } from '../appHelpers/logger.helper.js';

// Esta función middleware es más robusta
// TODO: Hacerla funcionar
export const authToken = (req, res, next) => {
    customLogger.info("-------------------------------------------------")
    customLogger.info("MIDDLEWARE authToken", req.session)
    if (!req.session || !req.session.user) {
        customLogger.info("MIDDLEWARE auth > authToken a login", req.session)

        const acceptHeader = req.get('Accept');

        if (acceptHeader && !acceptHeader.includes('text/html')) {
            // If the request expects a JSON response
            customLogger.info("MIDDLEWARE auth > response with json")
            return res.status(401).send({ status: "error", message: "No autenticado" });
        } else {
            customLogger.info("MIDDLEWARE auth > redirect a login")
            // If the request is from a browser or expects HTML
            return res.redirect("/login");
        }


    }
    customLogger.info("-------------------------------------------------")
    next();
    /*
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies.jwt//jwtToken;

    customLogger.info("authToken", { authHeader, cookieToken })

    // Verificar si el token está presente en el encabezado de autorización o en la cookie jwtToken
    const token = authHeader ? authHeader.split(" ")[1] : cookieToken;

    if (!token) {
        return res.status(401).send({ status: "error", message: "No autorizado" });
    }

    jwt.verify(token, config.jwtSecret, (error, user) => {
        if (error) {
            customLogger.error('JWT Verification Error:', error);
            return res.status(401).send({ status: "error", message: "Unauthorized" });
        }

        req.user = user;
        next();
    });
    */
}

// Esta funcion es la que usó el profe en clase22
export function auth(req, res, next) {
    customLogger.info("-------------------------------------------------")
    customLogger.info("MIDDLEWARE auth", req.session)
    if (!req.session || !req.session.user) {

        const acceptHeader = req.get('Accept');

        if (acceptHeader && !acceptHeader.includes('text/html')) {
            // If the request expects a JSON response
            customLogger.info("MIDDLEWARE auth > response with json")
            return res.status(401).send({ status: "error", message: "No autenticado" });
        } else {
            customLogger.info("MIDDLEWARE auth > redirect a login")
            // If the request is from a browser or expects HTML
            return res.redirect("/login");
        }
    }
    customLogger.info("-------------------------------------------------")
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

// Middleware de autenticación para usuarios premium
export const isPremium = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'premium') {
        return next();
    } else {
        return res.status(403).json({ message: 'Acceso no autorizado' });
    }
};

export const isUserOrPremium = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'user' || req.session.user.role === 'premium') {
        next();
    }
    else {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
}

export const isPremiumOrAdmin = (req, res, next) => {
    if(req.session && req.session.user && req.session.user.role === 'premium' || req.session.user.role === 'admin') {
        next();
    }
    else {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
}

export const isAll = (req, res, next) => {
    if(req.user && req.user.role === 'admin' || req.user.role === 'premium' || req.user.role === 'user') {
        next();
    }
    else {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
}
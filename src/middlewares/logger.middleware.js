import { customLogger } from '../appHelpers/logger.helper.js';

// Middleware to log incoming requests
export const requestLogger = (req, res, next) => {
    customLogger.http(`${req.method} ${req.url}`);
    next();
};

// Middleware to log responses
export const responseLogger = (req, res, next) => {
    const oldSend = res.send;

    res.send = function (data) {
        customLogger.info(`Response: ${res.statusCode} ${res.statusMessage}`, { metadata: data });
        res.send = oldSend;
        return res.send(data);
    };
    next();
};

// Middleware to log errors
/*
primera version...
export const errorLogger = (err, req, res, next) => {
    customLogger.error(`Error: ${err.message}`, { ...err });
    res.status(500).send('Something went wrong!');
};
*/

export const errorLogger = (err, req, res, next) => {
    // Log the error
    customLogger.error(`Error: ${err.message}`, { ...err });

    // Check if headers have already been sent
    if (res.headersSent) {
        return next(err);
    }

    // If the error has a status code, use it; otherwise, default to 500
    const statusCode = err.statusCode || 500;
    res.status(statusCode);

    // Send the error message if it's not already sent
    // console.log("err", err)
    if (err.isCustom) {
        res.json(err);
    } else {
        res.send('Something went wrong!');
    }
};
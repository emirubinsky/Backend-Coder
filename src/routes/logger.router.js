import express from "express"
import { customLogger as logger } from '../appHelpers/logger.helper.js';

const loggerRouter = express.Router();

loggerRouter.get('/fatal', (req, res) => {
    logger.fatal('This is a fatal log');
    res.send('Logged a fatal message');
});

loggerRouter.get('/error', (req, res) => {
    logger.error('This is an error log');
    res.send('Logged an error message');
});

loggerRouter.get('/warning', (req, res) => {
    logger.warning('This is a warning log');
    res.send('Logged a warning message');
});

loggerRouter.get('/info', (req, res) => {
    logger.info('This is an info log');
    res.send('Logged an info message');
});

loggerRouter.get('/http', (req, res) => {
    logger.http('This is an http log');
    res.send('Logged an http message');
});

loggerRouter.get('/debug', (req, res) => {
    logger.debug('This is a debug log');
    res.send('Logged a debug message');
});

export default loggerRouter;
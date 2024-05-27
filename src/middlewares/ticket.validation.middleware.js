// middleware/validationMiddleware.js
import { body, query, param, validationResult } from 'express-validator';
import { customLogger } from '../appHelpers/logger.helper.js';
import ValidationError from '../appHelpers/errors/validation.error.js'
import { ENUM_ERROR_TYPES } from '../appHelpers/enums/enum.collection.js';

const REQ_PARAM_TICKET_ID = 'cid'

export const validateTicket = [
    // Esta propiedad se calcula en el Manager
    // body('code').isString().withMessage('Code must be a string'),

    // Esta propiedad se calcula en el Manager
    // body('purchase_datetime').isISO8601().withMessage('Purchase datetime must be a valid date'),

    // TODO: usar este en futuro
    //body('purchaser').isEmail().withMessage('Purchaser must be a valid email'),
    // body('purchaser').isString().withMessage('Purchaser must be a valid string'),

    body('cartId').isMongoId().withMessage('Cart must be a valid cart ID'),
    // body('user').isMongoId().withMessage('User must be a valid user ID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const message = "TICKET VALIDATION MDW > validateCart > error"
            const customError = ValidationError.createError({
                cause: "TICKET > Validation > validateTicket",
                message,
                code: ENUM_ERROR_TYPES.VALIDATION_ERROR,
                items: errors.array()
            })
            customLogger.error(message, { ...customError })
            return next(customError) //res.status(400).json(customError);
        }
        next();
    }
];


export const validateTicketId = [
    param(REQ_PARAM_TICKET_ID).isMongoId().withMessage('Invalid Ticket ID format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const message = "TICKET VALIDATION MDW > validateTicketId > error"
            const customError = ValidationError.createError({
                cause: "TICKET > Validation > validateTicketId",
                message,
                code: ENUM_ERROR_TYPES.VALIDATION_ERROR,
                items: errors.array()
            })
            customLogger.error(message, { ...customError })
            return next(customError) //res.status(400).json(customError);
        }
        next();
    }
];

// Validation rules for product queries
export const validateTicketQuery = [
    query('page').optional().isInt({ gt: 0 }).withMessage('Page must be a positive integer'),
    query('sort').optional().isString().withMessage('Sort must be a string'),
    //query('filter').optional().isObject().withMessage('Filter must be an object'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            const message = "TICKET VALIDATION MDW > validateTicketQuery > error"
            const customError = ValidationError.createError({
                cause: "TICKET > Validation > validateTicketQuery",
                message,
                code: ENUM_ERROR_TYPES.VALIDATION_ERROR,
                items: errors.array()
            })
            customLogger.error(message, { ...customError })
            return next(customError) //res.status(400).json(customError);

        }
        customLogger.info("TICKET VALIDATION MDW > validateTicketQuery > OK")
        next();
    }
];

/*
module.exports = {
    validateProduct,
    validateProductId,
    validateProductQuery
};
*/
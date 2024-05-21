// middleware/validationMiddleware.js
import { body, query, param, validationResult } from 'express-validator';

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
            console.log("TICKET VALIDATION MDW > validateCart > error")
            return res.status(400).json({
                errors: errors.array()
            });
        }
        next();
    }
];


export const validateTicketId = [
    param(REQ_PARAM_TICKET_ID).isMongoId().withMessage('Invalid Ticket ID format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
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
            console.log("TICKET VALIDATION MDW > validateTicketQuery > error")
            return res.status(400).json({
                errors: errors.array()
            });
        }
        console.log("TICKET VALIDATION MDW > validateTicketQuery > OK")
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
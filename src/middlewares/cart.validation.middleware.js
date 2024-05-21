// middleware/validationMiddleware.js
import { body, query, param, validationResult } from 'express-validator';

const REQ_PARAM_CART_ID = 'cid'
const REQ_PARAM_PRODUCT_ID = 'pid'

// Validation rules for creating a product

export const validateCart = [
    body('products').isArray().withMessage('Products must be an array'),
    body('products.*.product').isMongoId().withMessage('Each product must be a valid product ID'),
    body('products.*.quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
    body('products.*.price').optional().isFloat({ gt: 0 }).withMessage('Price, if provided, must be a positive number'),
    body('user').isMongoId().withMessage('User must be a valid user ID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("CART VALIDATION MDW > validateCart > error")
            return res.status(400).json({
                errors: errors.array()
            });
        }
        next();
    }
];

export const validateUpdateProductCartQuantity = [
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("CART VALIDATION MDW > validateUpdateProductCartQuantity > error")
            return res.status(400).json({
                errors: errors.array()
            });
        }
        next();
    }
];

export const validateCartId = [
    param(REQ_PARAM_CART_ID).isMongoId().withMessage('Invalid Cart ID format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export const validateProductId = [
    param(REQ_PARAM_PRODUCT_ID).isMongoId().withMessage('Invalid Product ID format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validation rules for product queries
export const validateCartQuery = [
    query('page').optional().isInt({ gt: 0 }).withMessage('Page must be a positive integer'),
    query('sort').optional().isString().withMessage('Sort must be a string'),
    //query('filter').optional().isObject().withMessage('Filter must be an object'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("CART VALIDATION MDW > validateCartQuery > error")
            return res.status(400).json({
                errors: errors.array()
            });
        }
        console.log("CART VALIDATION MDW > validateCartQuery > OK")
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
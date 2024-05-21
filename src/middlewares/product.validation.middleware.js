// middleware/validationMiddleware.js
import { body, query, param, validationResult } from 'express-validator';

// Custom validator to check if file is an image
const isImage = value => {
    // Assuming `value` contains the file object and has a mime type property
    const mimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return value && mimeTypes.includes(value.mimetype);
};


// Validation rules for creating a product

export const validateProduct = [
    body('title').isString().withMessage('Name must be a string'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('category').isString().withMessage('Category must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),

    (req, res, next) => {
        console.log('Body:', req.body); // Debugging statement
        console.log('Files:', req.files); // Debugging statement

        // Validate the main image file
        if (!req.files || !req.files.image || !req.files.image[0] || !isImage(req.files.image[0])) {
            return res.status(400).json({ errors: [{ msg: 'Image must be a valid image file' }] });
        }

        // Validate thumbnails if they are present
        if (req.files.thumbnails) {
            const thumbnails = req.files.thumbnails;
            for (const file of thumbnails) {
                if (!isImage(file)) {
                    return res.status(400).json({ errors: [{ msg: 'Each thumbnail must be a valid image file' }] });
                }
            }
        }
        next();
    },
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateId = [
    
];

export const validateProductId = [
    param('id').isMongoId().withMessage('Invalid ID format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validation rules for product queries
export const validateProductQuery = [
    query('page').optional().isInt({ gt: 0 }).withMessage('Page must be a positive integer'),
    query('sort').optional().isString().withMessage('Sort must be a string'),
    query('filter').optional().isObject().withMessage('Filter must be an object'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("PRODUCT VALIDATION MDW > validateProductQuery > error" )
            return res.status(400).json({ errors: errors.array() });
        }
        console.log("PRODUCT VALIDATION MDW > validateProductQuery > OK" )
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
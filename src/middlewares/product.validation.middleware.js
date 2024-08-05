// middleware/validationMiddleware.js
import { body, query, param, validationResult } from 'express-validator';
import { customLogger } from '../appHelpers/logger.helper.js';
import ValidationError from '../appHelpers/errors/validation.error.js'
import { ENUM_ERROR_TYPES } from '../appHelpers/enums/enum.collection.js';

// Custom validator to check if file is an image
const isImage = value => {
    // Assuming `value` contains the file object and has a mime type property
    const mimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg',];
    return value && mimeTypes.includes(value.mimetype);
};


// Validation rules for creating a product

export const validateProduct = [
    body('title').isString().withMessage('Name must be a string'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('category').isString().withMessage('Category must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),

    (req, res, next) => {
        customLogger.info('Body:', req.body); // Debugging statement
        customLogger.info('Files:', req.files); // Debugging statement

        // Validate the main image file
        if (!req.files || !req.files.image || !req.files.image[0] || !isImage(req.files.image[0])) {

            const message = 'Image must be a valid image file'
            const customError = ValidationError.createError({
                cause: "Product > Validation > File",
                message,
                code: ENUM_ERROR_TYPES.VALIDATION_FILE_ERROR,
                items: [{ msg: message }]
            })
            customLogger.error(message, { ...customError })
            return next(customError) //res.status(400).json(customError);
        }

        // Validate thumbnails if they are present
        if (req.files.thumbnails) {
            const thumbnails = req.files.thumbnails;
            for (const file of thumbnails) {
                if (!isImage(file)) {
                    const message = 'Each thumbnail must be a valid image file'
                    const customError = ValidationError.createError({
                        cause: "Product > Validation > File",
                        message,
                        code: ENUM_ERROR_TYPES.VALIDATION_FILE_ERROR,
                        items: [{ msg: message }]
                    })
                    customLogger.error(message, { ...customError })
                    return next(customError) //res.status(400).json(customError);
                }
            }
        }
        next();
    },
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const message = 'Product VALIDATION MDW > validateProduct > error'
            const customError = ValidationError.createError({
                cause: "Product > Validation > validateProduct",
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

export const validateProducOnUpdate = [
    body('title').isString().withMessage('Name must be a string'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('category').isString().withMessage('Category must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),

    (req, res, next) => {
        const { image, thumbnails } = req.files || {};
        const removedThumbnails = req.body.removedThumbnails;

        console.log(validateProducOnUpdate, { image, thumbnails, removedThumbnails })

        // Validate the main image file only if a new file is provided
        if (image) {
            if (!image[0] || !isImage(image[0])) {
                const message = 'Image must be a valid image file';
                const customError = ValidationError.createError({
                    cause: "Product > Validation > File",
                    message,
                    code: ENUM_ERROR_TYPES.VALIDATION_FILE_ERROR,
                    items: [{ msg: message }]
                });
                return next(customError);
            }
        }

        // Validate thumbnails if they are present
        if (thumbnails) {
            for (const file of thumbnails) {
                if (!isImage(file)) {
                    const message = 'Each thumbnail must be a valid image file';
                    const customError = ValidationError.createError({
                        cause: "Product > Validation > File",
                        message,
                        code: ENUM_ERROR_TYPES.VALIDATION_FILE_ERROR,
                        items: [{ msg: message }]
                    });
                    return next(customError);
                }
            }
        }

        // If no new images are provided and no thumbnails are removed, skip file validation
        if (!image && !thumbnails && !removedThumbnails) {
            return next();
        }

        next();
    },

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const customError = ValidationError.createError({
                cause: "Product > Validation > validateProduct",
                message: 'Product VALIDATION MDW > validateProduct > error',
                code: ENUM_ERROR_TYPES.VALIDATION_ERROR,
                items: errors.array()
            });
            return next(customError);
        }
        next();
    }
];

export const validateProducOnUpdateOLD = [
    body('title').isString().withMessage('Name must be a string'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('category').isString().withMessage('Category must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),

    (req, res, next) => {
        customLogger.debug('Body:', req.body); // Debugging statement
        customLogger.debug('Files:', req.files); // Debugging statement
        console.log("validateProductOnUpdate", { doWeHaveImageMain: req.files && req.files.image })

        // Validate the main image file
        if(req.files && req.files.image){
            if (!req.files.image[0] || !isImage(req.files.image[0])) {

                const message = 'Image must be a valid image file'
                const customError = ValidationError.createError({
                    cause: "Product > Validation > File",
                    message,
                    code: ENUM_ERROR_TYPES.VALIDATION_FILE_ERROR,
                    items: [{ msg: message }]
                })
                customLogger.error(message, { ...customError })
                return next(customError) //res.status(400).json(customError);
            }
        }

        // Validate thumbnails if they are present
        if (req.files.thumbnails) {
            const thumbnails = req.files.thumbnails;
            for (const file of thumbnails) {
                if (!isImage(file)) {
                    const message = 'Each thumbnail must be a valid image file'
                    const customError = ValidationError.createError({
                        cause: "Product > Validation > File",
                        message,
                        code: ENUM_ERROR_TYPES.VALIDATION_FILE_ERROR,
                        items: [{ msg: message }]
                    })
                    customLogger.error(message, { ...customError })
                    return next(customError) //res.status(400).json(customError);
                }
            }
        }
        next();
    },
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const message = 'Product VALIDATION MDW > validateProduct > error'
            const customError = ValidationError.createError({
                cause: "Product > Validation > validateProduct",
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

export const validateProductId = [
    param('id').isMongoId().withMessage('Invalid ID format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const message = 'Product VALIDATION MDW > validateProductId > error'
            const customError = ValidationError.createError({
                cause: "Product > Validation > validateProductId",
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
export const validateProductQuery = [
    query('page').optional().isInt({ gt: 0 }).withMessage('Page must be a positive integer'),
    query('sort').optional().isString().withMessage('Sort must be a string'),
    query('filter').optional().isObject().withMessage('Filter must be an object'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            const message = "PRODUCT VALIDATION MDW > validateProductQuery > error"
            const customError = ValidationError.createError({
                cause: "Product > Validation > validateProductQuery",
                message,
                code: ENUM_ERROR_TYPES.VALIDATION_ERROR,
                items: errors.array()
            })
            customLogger.error(message, { ...customError })
            return next(customError) //res.status(400).json(customError);
        }
        customLogger.info("PRODUCT VALIDATION MDW > validateProductQuery > OK")
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
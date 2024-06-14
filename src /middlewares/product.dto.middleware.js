// middleware/dtoMiddleware.js
import ProductDTO from '../dao/dto/product.dto.js';
import ProductQueryDTO from '../dao/dto/product.query.dto.js';

import { customLogger } from '../appHelpers/logger.helper.js';

export const createProductDTO = (req, res, next) => {
    try {

        customLogger.info("createProductDTO > body", req.body); // Log request body (form data)
        customLogger.info("createProductDTO > files", req.files); // Log uploaded files (images)

        //const image = req.files['image'][0].filename; // Get main image filename
        //const thumbnails = req.files['thumbnails'].map(file => file.filename); // Get thumbnail image filenames
        const id = req.params.id ? req.params.id : -1
        const status = req.body.active === 'true'; // Convert checkbox value to boolean

        const image = req.files != null &&
            req.files['image'] != null &&
            req.files['image'].length > 0 &&
            req.files['image'][0] &&
            req.files['image'][0]['filename'] != null ?
            req.files['image'][0].filename : null; // Get main image filename
        const thumbnails = req.files != null &&
            req.files['thumbnails'] != null &&
            req.files['thumbnails'].length > 0 &&
            req.files['thumbnails'].map(file => file.filename) ?
            req.files['thumbnails'].map(file => file.filename) : null;

        const dto = new ProductDTO({
            id,
            title: req.body.title,
            description: req.body.description,
            code: req.body.code,
            category: req.body.category,
            brand: req.body.brand,
            price: req.body.price,
            stock: req.body.stock,
            status,
            image,
            thumbnails,
            owner: req.session.userId
        });

        customLogger.info("createProductDTO", {
            dto
        })

        req.dto = dto

        next();
    } catch (error) {
        customLogger.error(error.message, { stack: error.stack })
        res.status(400).json({
            reason: 'MIDDLEWARE > PRODUCT DTO > Invalid product data',
            errorMessage: error.message,
            stack: error.stack
        });
    }
};

export const createProductQueryDTO = (req, res, next) => {
    try {

        // Obtención de parametros desde el body.
        const { category, brand, sort } = req.query;

        const {
            limit = 5,
            page = 1,
            view = true,
            adm = false
        } = req.query != null ? req.query : {};

        // Obtención de parametros desde el queryString

        // Formacion del objeto query para perfeccionar la query.
        const query = {};

        if (category) {
            query.category = category;
        }

        if (brand) {
            query.brand = brand;
        }

        /* manejo especial de url */
        // TODO: mejorar
        let baseUrlHandled = req.baseUrl
        if (view) {
            baseUrlHandled = baseUrlHandled.replace("/api", "")
        }

        if (adm) {
            baseUrlHandled = baseUrlHandled.replace("/products", "/products/list")
        }

        customLogger.info("createProductQueryDTO", { view, baseUrl: req.baseUrl })

        const dto = new ProductQueryDTO({
            host: req.get('host'),
            protocol: req.protocol,
            baseUrl: baseUrlHandled,
            query,
            limit,
            page,
            sort: { price: sort === 'asc' ? 1 : -1 }
        });

        customLogger.info("createProductQueryDTO", {
            dto
        })

        req.dto = dto

        next();
    } catch (error) {
        customLogger.error(error.message, { stack: error.stack })
        res.status(400).json({
            reason: 'MIDDLEWARE > PRODUCT QUERY DTO > Invalid product-query data',
            errorMessage: error.message,
            stack: error.stack
        });
    }
};

/*
module.exports = {
    createProductDTO,
    createProductQueryDTO
};
*/
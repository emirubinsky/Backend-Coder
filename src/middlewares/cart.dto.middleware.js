// middleware/dtoMiddleware.js
import CartDTO from '../dao/dto/cart.dto.js';
import CartQueryDTO from '../dao/dto/cart.query.dto.js';

import { customLogger } from '../appHelpers/logger.helper.js';

export const createCartDTO = (req, res, next) => {
    try {

        customLogger.info(req.body);
        customLogger.info(req.session); 

        const id = req.params.cid ? req.params.cid : -1

        const dto = new CartDTO({
            products: req.body.products, 
            user: req.session.userId || req.body.user,
            id
        });

        customLogger.info("createCartDTO", {
            dto
        })

        req.dto = dto

        next();
    } catch (error) {
        res.status(400).json({
            reason: 'MIDDLEWARE > CART DTO > Invalid cart data',
            errorMessage: error.message
        });
    }
};

export const initializeCartDTO = (req, res, next) => {
    try {

        customLogger.info(req.body);
        customLogger.info(req.session); 

        const id = req.params.cid ? req.params.cid : -1

        const dto = new CartDTO({
            products: [], //req.body.products, 
            user: req.session.userId || req.body.user,
            id
        });

        customLogger.info("initializeCartDTO", {
            dto
        })

        req.dto = dto

        next();
    } catch (error) {
        res.status(400).json({
            reason: 'MIDDLEWARE > INIT CART DTO > Invalid cart data',
            errorMessage: error.message
        });
    }
};

export const updateQuantityCartDTO = (req, res, next) => {
    try {

        const {
            cid: cartId,
            pid: productId
        } = req.params;

        const { quantity, replace = false } = req.body

        customLogger.info('comenzando updateQuantityCartDTO')
        customLogger.debug('body', req.body);
        console.log('body', req.body);

        /*
                {
                    "product": "661af6a1053f3748c277f426",
                    "quantity": 20,
                    "price": 23.5
                }
        */

        const dto = new CartDTO({
            products: [{
                product: productId,
                quantity,
                replace
            }], 
            // TODO - Aca obtener el userId logueado
            user: req.session.userId || req.body.user,
            id: cartId
        });

        customLogger.info("updateQuantityCartDTO", {
            dto
        })

        req.dto = dto

        next();
    } catch (error) {
        res.status(400).json({
            reason: 'MIDDLEWARE > UPDATE CART QUANTITY DTO > Invalid cart data',
            errorMessage: error.message
        });
    }
};

export const createCartQueryDTO = (req, res, next) => {
    try {

        const {
            limit = 10,
            page = 1,
        } = req.query != null ? req.query : {};

        // Obtención de parametros desde el queryString

        // Formacion del objeto query para perfeccionar la query.
        const query = {};

        const dto = new CartQueryDTO({
            host: req.get('host'),
            protocol: req.protocol,
            baseUrl: req.baseUrl,
            query,
            limit,
            page,
        });

        customLogger.info("createCartQueryDTO", {
            dto
        })

        req.dto = dto

        next();
    } catch (error) {
        res.status(400).json({
            reason: 'MIDDLEWARE > CART QUERY DTO > Invalid cart-query data',
            errorMessage: error.message
        });
    }
};

/*
module.exports = {
    createCartDTO,
    createCartQueryDTO
};
*/
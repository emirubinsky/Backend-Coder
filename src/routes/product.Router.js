import express from "express"

import { configureProductMulter } from "../util.js";

import {
    createProductDTO,
    createProductQueryDTO
} from "../middlewares/product.dto.middleware.js"

import {
    validateProduct,
    validateProductId,
    validateProductQuery
} from "../middlewares/product.validation.middleware.js"

import { authToken, isAdmin } from "../middlewares/auth.js";

import ProductController from "../controllers/product.controller.js";

import { requestLogger, responseLogger, errorLogger } from '../middlewares/logger.middleware.js';

const productRouter = express.Router();
const imgUpload = configureProductMulter(); // TODO - Esto estaría bueno llevarlo a otra parte, para que ya esta configurado y facil de acceder

// Maneja la solicitud para ver los detalles de UN producto
productRouter.get("/:id",
    requestLogger,
    ProductController.getOne);

// Ruta para renderizar la vista de productos en tiempo real
productRouter.get("/",
    requestLogger,
    validateProductQuery,
    createProductQueryDTO,
    responseLogger, // esta aquí para sobre-escribir el res.send y asi "interceptar" y loguear la respuesta
    ProductController.getAll);

// Maneja la solicitud para ver las categorias de los productos
// productRouter.get("/category/:category", productController.getProductCategory);

// Manejar la solicitud para agregar un producto en tiempo real
productRouter.post("/",
    requestLogger,
    authToken,
    isAdmin,
    imgUpload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'thumbnails', maxCount: 5 }]
    ),
    validateProduct,
    createProductDTO,
    responseLogger, // esta aquí para sobre-escribir el res.send y asi "interceptar" y loguear la respuesta
    ProductController.add);


// Manejar la solicitud para actualizar
productRouter.put("/:id",
    requestLogger,
    authToken,
    isAdmin,
    imgUpload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'thumbnails', maxCount: 5 }]
    ),
    validateProductId,
    validateProduct,
    createProductDTO,
    responseLogger, // esta aquí para sobre-escribir el res.send y asi "interceptar" y loguear la respuesta
    ProductController.update);

// Manejar la solicitud para la eliminación de un producto en tiempo real
productRouter.delete('/:id',
    requestLogger,
    authToken,
    isAdmin,
    validateProductId,
    responseLogger, // esta aquí para sobre-escribir el res.send y asi "interceptar" y loguear la respuesta
    ProductController.delete
);


export default productRouter;
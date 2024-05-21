import express from "express";
import CartController from "../controllers/cart.controller.js";

import { authToken, isUser } from "../middlewares/auth.js";

import {
    createCartDTO,
    initializeCartDTO,
    createCartQueryDTO,
    updateQuantityCartDTO
} from "../middlewares/cart.dto.middleware.js"

import {
    validateCart,
    validateUpdateProductCartQuantity,
    validateCartId,
    validateProductId,
    validateCartQuery
} from "../middlewares/cart.validation.middleware.js"

const cartRouter = express.Router();
// Para rutas protegidas const protectWithJWT = passport.authenticate("jwt", { session: false });

// Maneja la solicitud de renderizar el carrito
cartRouter.get("/:cid",
    authToken,
    isUser,
    CartController.getOne);

// Maneja la solicitud de renderizar el carrito
cartRouter.get("/",
    validateCartQuery,
    createCartQueryDTO,
    CartController.getAll);

// Maneja la solicitud de agregar el producto al carrito
cartRouter.post("/",
    authToken,
    isUser,
    validateCart,
    createCartDTO,
    CartController.add);

// Maneja la solicitud de agregar el producto al carrito
cartRouter.post("/user",
    authToken,
    isUser,
    // validateCart,
    initializeCartDTO,
    CartController.initialize);

// Maneja la solicitud para actualizar el carrito con nuevos productos
cartRouter.put("/:cid",
    authToken,
    isUser,
    validateCartId,
    validateCart,
    createCartDTO,
    CartController.update);

// Maneja la solicitud para limpiar el carrito
cartRouter.delete("/:cid",
    authToken,
    isUser,
    validateCartId,
    CartController.delete);

/* Rutas especializadas para gestionar los PRODUCTOS de un CARRITO. */
// Maneja la solicitud para actualizar la cantidad de algun producto dentro del carrito
cartRouter.put("/:cid/products/:pid",
    authToken,
    isUser,
    validateCartId,
    validateProductId,
    validateUpdateProductCartQuantity,
    updateQuantityCartDTO,
    CartController.updateProductQuantity);

// Maneja la solicitud para borrar el producto seleccionado del carrito
cartRouter.delete("/:cid/products/:pid",
    authToken,
    isUser,
    validateCartId,
    validateProductId,
    CartController.removeProduct);


export default cartRouter;
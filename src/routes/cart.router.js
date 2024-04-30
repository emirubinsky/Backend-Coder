import express from "express";
import passport from "passport";
import CartController from "../controllers/cart.controller.js";

const cartRouter = express.Router();
// Para rutas protegidas const protectWithJWT = passport.authenticate("jwt", { session: false });

// Maneja la solicitud de renderizar el carrito
cartRouter.get("/:cid", CartController.getOne);

// Maneja la solicitud de renderizar el carrito
cartRouter.get("/", CartController.getAll);

// Maneja la solicitud de agregar el producto al carrito
cartRouter.post("/", CartController.add);

// Maneja la solicitud para actualizar el carrito con nuevos productos
cartRouter.put("/:cid", CartController.update);

// Maneja la solicitud para limpiar el carrito
cartRouter.delete("/:cid", CartController.delete);

/* Rutas especializadas para gestionar los PRODUCTOS de un CARRITO. */
// Maneja la solicitud para actualizar la cantidad de algun producto dentro del carrito
cartRouter.put("/:cid/products/:pid", CartController.updateProductQuantity);

// Maneja la solicitud para borrar el producto seleccionado del carrito
cartRouter.delete("/:cid/products/:pid", CartController.removeProduct);

export default cartRouter;
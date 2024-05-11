import express from "express"

import { configureProductMulter } from "../util.js";

import ProductController from "../controllers/product.controller.js";

const productRouter = express.Router();
const imgUpload = configureProductMulter(); // TODO - Esto estaría bueno llevarlo a otra parte, para que ya esta configurado y facil de acceder
// Para rutas protegidas const protectWithJWT = passport.authenticate("jwt", { session: false });

// Maneja la solicitud para ver los detalles de UN producto
productRouter.get("/:id", ProductController.getOne);

// Ruta para renderizar la vista de productos en tiempo real
productRouter.get("/", ProductController.getAll);

// Maneja la solicitud para ver las categorias de los productos
// productRouter.get("/category/:category", productController.getProductCategory);

// Manejar la solicitud para agregar un producto en tiempo real
productRouter.post("/", imgUpload.single("image"), ProductController.add);

// Manejar la solicitud para actualizar
productRouter.put("/:id", imgUpload.single("image"), ProductController.update);

// Manejar la solicitud para la eliminación de un producto en tiempo real
productRouter.delete('/:id', ProductController.delete);

export default productRouter;
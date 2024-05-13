import express from "express";
import passport from "passport";
import TicketController from "../controllers/ticket.controller.js";

const ticketRouter = express.Router();
// Para rutas protegidas const protectWithJWT = passport.authenticate("jwt", { session: false });

// Maneja la solicitud de renderizar el carrito
ticketRouter.get("/:cid", TicketController.getOne);

// Maneja la solicitud de renderizar el carrito
ticketRouter.get("/", TicketController.getAll);

// Maneja la solicitud de agregar el producto al carrito
ticketRouter.post("/", TicketController.add);

// Maneja la solicitud para actualizar el carrito con nuevos productos
ticketRouter.put("/:cid", TicketController.update);

// Maneja la solicitud para limpiar el carrito
ticketRouter.delete("/:cid", TicketController.delete);

export default ticketRouter;
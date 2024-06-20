import express from "express";
import TicketController from "../controllers/ticket.controller.js";

import {
    createTicketDTO,
    createTicketQueryDTO
} from "../middlewares/ticket.dto.middleware.js"

import {
    validateTicket,
    validateTicketId,
    validateTicketQuery
} from "../middlewares/ticket.validation.middleware.js"

import { authToken, isUser } from "../middlewares/auth.js";

const ticketRouter = express.Router();
// Para rutas protegidas const protectWithJWT = passport.authenticate("jwt", { session: false });

// Maneja la solicitud de renderizar el carrito
ticketRouter.get("/:cid", TicketController.getOne);

// Maneja la solicitud de renderizar el carrito
ticketRouter.get("/",
    //authToken,
    //isUser,
    validateTicketQuery,
    createTicketQueryDTO,
    TicketController.getAll);

// Maneja la solicitud de agregar el producto al carrito
ticketRouter.post("/",
    authToken,
    isUser,
    validateTicket,
    createTicketDTO,
    TicketController.add);

// Maneja la solicitud para actualizar el carrito con nuevos productos
ticketRouter.put("/:cid",
    authToken,
    isUser,
    validateTicketId,
    validateTicket,
    createTicketDTO,
    TicketController.update);

// Maneja la solicitud para limpiar el carrito
ticketRouter.delete("/:cid",
    authToken,
    isUser,
    validateTicketId,
    TicketController.delete);

export default ticketRouter;
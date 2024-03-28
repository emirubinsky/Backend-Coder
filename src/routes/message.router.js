import express from "express";
import messageController from "../dao/controllers/message.controller.js";

const messageRouter = express.Router();

// Maneja la solicitud para obtener los mensajes en tiempo real
messageRouter.get("/", messageController.getMessages);

// Maneja la solicitud para agregar mensajes en tiempo real
messageRouter.post("/", messageController.addMessage);

// Maneja la solicitud para actualizar mensajes en tiempo real
messageRouter.patch("/:id", messageController.updateMessage);

export default messageRouter;
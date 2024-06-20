import express from "express";
import cartRouter from "./cart.router.js";
import ticketRouter from "./ticket.router.js";
import productRouter from "./product.router.js";
import messageRouter from "./message.router.js";
import userRouter from "./user.router.js";
import mockRouter from "./mock.router.js";
import loggerRouter from "./logger.router.js";

import viewsRouter from "./views.router.js";

import { customLogger } from '../appHelpers/logger.helper.js';
import { errorLogger } from '../middlewares/logger.middleware.js';

customLogger.info("Router > LISTO");

const router = express.Router();

router.use("/api/carts", cartRouter);
router.use("/api/tickets", ticketRouter);
router.use("/api/products", productRouter);
router.use("/api/messages", messageRouter);
router.use("/api/mocking", mockRouter);
router.use("/api/logger", loggerRouter);
router.use("/users", userRouter);

router.use("/", viewsRouter)

/* Definición "global" de uso de logging de errores */
router.use(errorLogger);
export default router;
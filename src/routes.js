import express from "express";
import cartRouter from "./routes/cart.router.js";
import ticketRouter from "./routes/ticket.router.js";
import productRouter from "./routes/product.router.js";
import messageRouter from "./routes/message.router.js";
import userRouter from "./routes/user.router.js";

import viewsRouter from "./routes/views.router.js";

const router = express.Router();

router.use("/api/carts", cartRouter);
router.use("/api/tickets", ticketRouter);
router.use("/api/products", productRouter);
router.use("/api/messages", messageRouter);
router.use("/users", userRouter);

router.use("/", viewsRouter)

export default router;
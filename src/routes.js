import express from "express";
import cartRouter from "./routes/cart.router.js";
import productRouter from "./routes/product.router.js";
import messageRouter from "./routes/message.router.js";
import userRouter from "./routes/user.router.js";

import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";

const router = express.Router();

// Deshabilito esta, y usaremos la definición que está en
// views.router.js -> y asi va primero al login
/*
router.get("/", async(req, res) => {
    res.render("home");
});
*/

router.use("/api/carts", cartRouter);
router.use("/api/products", productRouter);
router.use("/api/messages", messageRouter);
router.use("/users", userRouter);

router.use("/", viewsRouter)
//router.use("/api/sessions", sessionsRouter); 

export default router;

import { Server } from "socket.io";

export default function initializeSocketServer(httpServer){
    // Servidor WebSocket
    const io = new Server(httpServer);

    io.on('connection', socket => {
        console.log("Nuevo cliente conectado!!");

        socket.on("deleteProduct", (deleteProductId) => {
            console.log("Producto borrado:", deleteProductId);
            io.emit("deleteProduct", deleteProductId);
        });

        socket.on("addProduct", (addProduct) => {
            console.log("Producto agregado:", addProduct);
            io.emit("addProduct", addProduct);
        });

        socket.on("addMessage", (addMessage) => {
            console.log("Mensaje agregado", addMessage);
            io.emit("addMessage", addMessage);
        });

        socket.on("deleteProductCart", (deleteProductCartId) => {
            console.log("Producto eliminado del carrito", deleteProductCartId);
            io.emit("deleteProductCart", deleteProductCartId);
        });

        socket.on("clearCart", (clearCart) => {
            console.log("Carrito vaciado:", clearCart);
            io.emit("clearCart", clearCart);
        });
    });
}


import express from "express";
import mongoose from "mongoose";
import http from "http";
import Handlebars from "handlebars";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import __dirname from "./util.js";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import cors from "cors";


import router from "./routes.js";

// Estas dos importaciones se usan en routes.js
// import viewsRouter from "./routes/views.router.js";
// import sessionsRouter from "./routes/sessions.router.js";

/**
 *  Aca hubo un tema entre clase 21 > 22
 *  Primero en clase 21 se guardo la configuracion de JWT en config/jwt.js (que tiene sentido)
 *  Y luego se importaba así:
 *      import passport from "./config/jwt.js";
 *  Pero aca iba haber problemas cuando más tarde se configurar el middleware
 *      passport.initialize()
 *      passport.session()
 *  Porqué? porque nuestro archivo jwt.js NO tenía esas funciones.
 *  Esas funciones son parte del modulo "passport"
 */

/**
 * Esta funcion que importamos se encarga de configurar TODAS las estrategias posibles
 */
import initilizePassport from "./config/passport.config.js"; 
import passport from 'passport'
// import auth from "./config/auth.js"; // Esto no lo usamos más. Esta todo en ./config/passport.config.js

import { MONGO_URL } from "./util.js";
const PORT = 8080;

/* Esto es usado como una "directiva" especial
 * Ejemplo en donde se usa: realTimeProducts.handlebars
 */
Handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});

const fileStore = FileStore(session); // TODO: Estamos usando el FileStore?
const app = express();
const httpServer = http.createServer(app); // INFO: Esto no sería necesario, Express automatiza esta parte.

// Middleware para analizar el cuerpo de la solicitud JSON
app.use(express.json());

// Middleware para utilizar cookies
app.use(cookieParser());

// Middleware para usar cors
app.use(cors());

// Middleware para usar el session para autenticaciones de usuarios
app.use(
    session({
        store: new MongoStore({
            mongoUrl: MONGO_URL,
            ttl: 3600,
        }),
        secret: "CoderSecrets",//process.env.APP_SESSION_SECRET, //CoderSecrets
        resave: false,
        saveUninitialized: false,
    })
);

// Rutas para productos y carritos
//app.use("/api/products", productRouter);
//app.use("/api/carts", cartRouter);

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (err) => {
    console.error("Error de conexión a MongoDB:", err);
});

db.once("open", () => {
    console.log("Conexión a MongoDB exitosa");
});

// Middleware adicional para analizar el cuerpo de la solicitud JSON en cartRouter
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

// Middleware de Passport para la autenticación de sesión
initilizePassport(); // Inicializar Passport y sus estrategias. Antiguamente usabamos un archivo "auth.js"
app.use(passport.initialize()); // Esto llama al middleware y lo inicializa
app.use(passport.session()); // Info: alters the request object and change the 'user' value that is currently the session id (from the client cookie)


// Middleware para utilizar plantillas html
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Middleware para los archivos?
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares para el enrutamiento
app.use("/", router);
// app.use("/", viewsRouter); // <- esto vive en el routes.js
// app.use("/api/sessions", sessionsRouter); // <- esto vive en el routes.js

// Servidor HTTP
httpServer.listen(PORT, () => {
    console.log("Servidor conectado!!");
});

// Info: de nuevo, aquí se podría haber prescindido de httpServer y usar directamente express a traves de app, ejemplo del profe
// app.listen(app.get("PORT"), console.log(`Server on port ${app.get("PORT")}`));

// Y con esta línea se podría haber definido la parte del puerto a escuchar.
// app.set("PORT", process.env.PORT || PORT); // Usualmente 8000 o 4000

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
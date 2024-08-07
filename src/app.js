import express from "express";
import process from "process";
import http from "http";
import { __dirname } from "./util.js";
import { customLogger } from '../src/appHelpers/logger.helper.js';
import HandleBarsRegister from "./appHelpers/handleBarsRegister.js";
import swagger_setup from "./appHelpers/swagger.helper.js";
import handlebars from "express-handlebars";
import initializeSocketServer from './appSocketServer.js';
import bodyParser from "body-parser";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";

import router from "./routes/router.js";
import messenger from "./appHelpers/messenger.js";

process.on('uncaughtException', (err) => {
    console.error('unhandledRejection:', err);

    customLogger.fatal('Uncaught Exception', { message: err.message, stack: err.stack });
    throw err;
    process.exit(1); // Exit the process after logging the fatal error
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('unhandledRejection:', reason);
    if (reason instanceof Error) {
        customLogger.fatal('Unhandled Rejection', { message: reason.message, stack: reason.stack });
    } else {
        customLogger.fatal('Unhandled Rejection', { reason });
    }
    throw reason;
    process.exit(1); // Exit the process after logging the fatal error
});

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

import { MONGO_URL, PORT, MAIN_URL } from "./util.js";
customLogger.info("SERVER IMPORTS - OK")

try {
    customLogger.info("SERVER SETUP - INICIO")

    //const PORT = 8080;

    // FileStore fue la primera version de session que usamos. CLASE 19
    // const fileStore = FileStore(session); // TODO: Estamos usando el FileStore?
    const app = express();
    customLogger.info("http.createServer > ...setup")
    const httpServer = http.createServer(app); // INFO: Esto no sería necesario, Express automatiza esta parte.
    customLogger.info("http.createServer > ...setup OK")
    /* Inicializamos manejo de errores GLOBALES */
    // Catch unhandled errors

    // Middleware para analizar el cuerpo de la solicitud JSON
    customLogger.info("express.json > ...setup")
    app.use(express.json());
    customLogger.info("express.json > ...setup OK")

    // Middleware para utilizar cookies
    app.use(cookieParser());
    customLogger.info("cookieParser > ...setup  OK")

    // Middleware para usar cors
    //app.use(cors());
    app.use(cors({
        origin: MAIN_URL || 'http://localhost:8080/'
    }));

    customLogger.info("cors > ...setup  OK")

    // Middleware para usar el session para autenticaciones de usuarios
    customLogger.info("MONGO SESSION > ...setup")
    app.use(
        session({
            store: new MongoStore({
                mongoUrl: MONGO_URL,
                ttl: 3600,
                useNewUrlParser: true,
                useUnifiedTopology: true
            }),
            secret: "CoderSecrets",//process.env.APP_SESSION_SECRET, //CoderSecrets
            resave: false,
            saveUninitialized: false,
        })
    );
    customLogger.info("MONGO SESSION > ...setup OK")

    // Middleware adicional para analizar el cuerpo de la solicitud JSON en cartRouter
    customLogger.info("BODY PARSER > ...setup")
    app.use(bodyParser.json());
    customLogger.info("BODY PARSER > ...setup OK")

    app.use(express.urlencoded({ extended: true }));

    // Middleware de Passport para la autenticación de sesión
    customLogger.info("PASSPORT > ...yendo")
    initilizePassport(); // Inicializar Passport y sus estrategias. Antiguamente usabamos un archivo "auth.js"
    app.use(passport.initialize()); // Esto llama al middleware y lo inicializa
    app.use(passport.session()); // Info: alters the request object and change the 'user' value that is currently the session id (from the client cookie)


    /* MOTOR DE VISTAS > CLASE: */
    // Llamamos a helper para registrar nuevas directivas.
    HandleBarsRegister.registerHelpers()

    // Middleware para utilizar plantillas html
    app.engine("handlebars", handlebars.engine());
    app.set("views", __dirname + "/views");
    app.set("view engine", "handlebars");

    // Middleware para los archivos?
    app.use(express.static(path.join(__dirname, 'public')));

    // Middleware to set Content-Type for .js files
    app.use((req, res, next) => {
        if (req.originalUrl.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        next();
    });

    // Middleware para pasar la variable BASE_URL a todas las vistas
    app.use((req, res, next) => {
        res.locals.BASE_URL = MAIN_URL;
        next();
    });

    // Middlewares para el enrutamiento
    customLogger.info("INICIANDO ROUTER ...........")
    app.use("/", router);
    // app.use("/", viewsRouter); // <- esto vive en el routes.js
    // app.use("/api/sessions", sessionsRouter); // <- esto vive en el routes.js

    // Servidor HTTP
    httpServer.listen(PORT, () => {
        customLogger.info("------------> SERVIDOR CONECTADO <------------")
    });

    // Info: de nuevo, aquí se podría haber prescindido de httpServer y usar directamente express a traves de app, ejemplo del profe
    // app.listen(app.get("PORT"), console.log(`Server on port ${app.get("PORT")}`));

    // Y con esta línea se podría haber definido la parte del puerto a escuchar.
    // app.set("PORT", process.env.PORT || PORT); // Usualmente 8000 o 4000

    initializeSocketServer(httpServer)


    // Inicializar Swagger
    swagger_setup(app, __dirname)

} catch (error) {
    customLogger.error('APP ERROR FATAL ', { ...error });
    console.error("ERROR > ", error)
}
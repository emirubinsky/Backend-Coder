
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { customLogger } from '../appHelpers/logger.helper.js';

export default function swagger_setup(app, __dirname) {

    const swaggerOptions = {
        definition: {
            openapi: "3.0.1",
            info: {
                title: "Documentacion del proyecto",
                description: "API del proyecto"
            }
        },
        apis: [`${__dirname}/docs/**/*.yaml`]
    }

    const specs = swaggerJSDoc(swaggerOptions);
    app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

    customLogger.info("Swagger > LISTO")
}
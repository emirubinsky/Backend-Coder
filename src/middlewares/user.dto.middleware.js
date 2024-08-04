// middleware/dtoMiddleware.js
import UserQueryDTO from '../dao/dto/user.query.dto.js';

import { customLogger } from '../appHelpers/logger.helper.js';

export const createUserQueryDTO = (req, res, next) => {
    try {

        // Obtención de parametros desde el body.
        const { sort } = req.query;

        const {
            limit = 5,
            page = 1,
            view = true,
            adm = false
        } = req.query != null ? req.query : {};

        // Obtención de parametros desde el queryString

        // Formacion del objeto query para perfeccionar la query.
        const query = {};

        /* manejo especial de url */
        // TODO: mejorar
        let baseUrlHandled = req.baseUrl
        if (view) {
            baseUrlHandled = baseUrlHandled.replace("/api", "")
        }

        if (adm) {
            baseUrlHandled = baseUrlHandled.replace("/users", "/users/list")
        }

        customLogger.info("createUserQueryDTO", { view, baseUrl: req.baseUrl, baseUrlHandled })

        const dto = new UserQueryDTO({
            host: req.get('host'),
            protocol: req.protocol,
            baseUrl: baseUrlHandled,
            query,
            limit,
            page,
            sort: { price: sort === 'asc' ? 1 : -1 }
        });

        customLogger.info("createUserQueryDTO", {
            dto
        })

        req.dto = dto

        next();
    } catch (error) {
        customLogger.error(error.message, { stack: error.stack })
        res.status(400).json({
            reason: 'MIDDLEWARE > USER QUERY DTO > Invalid user-query data',
            errorMessage: error.message,
            stack: error.stack
        });
    }
};

/*
module.exports = {
    createUserDTO,
    createUserQueryDTO
};
*/
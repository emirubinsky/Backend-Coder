import TicketDTO from '../dao/dto/ticket.dto.js';
import TicketQueryDTO from '../dao/dto/ticket.query.dto.js';

export const createTicketDTO = (req, res, next) => {
    try {

        console.log("createTicketDTO > START", {
            body: req.body,
            session: req.session
        }) 

        const id = req.params.cid ? req.params.cid : -1

        const dto = new TicketDTO({
            purchaser: req.session.userId || req.body.user,
            purchaserEmail: req.session.email ,
            cart: req.body.cartId,
            user: req.session.userId || req.body.user,
            id
        });

        console.log("createTicketDTO > DTO GENERATED", {
            dto
        })

        req.dto = dto

        next();
    } catch (error) {
        res.status(400).json({
            reason: 'MIDDLEWARE > TICKET DTO > Invalid cart data',
            errorMessage: error.message
        });
    }
};

export const createTicketQueryDTO = (req, res, next) => {
    try {

        const {
            limit = 10,
            page = 1,
        } = req.query != null ? req.query : {};

        // Obtención de parametros desde el queryString

        // Formacion del objeto query para perfeccionar la query.
        const query = {};

        const dto = new TicketQueryDTO({
            host: req.get('host'),
            protocol: req.protocol,
            baseUrl: req.baseUrl,
            query,
            limit,
            page,
        });

        console.log("createTicketQueryDTO", {
            dto
        })

        req.dto = dto

        next();
    } catch (error) {
        res.status(400).json({
            reason: 'MIDDLEWARE > TICKET QUERY DTO > Invalid ticket-query data',
            errorMessage: error.message
        });
    }
};

/*
module.exports = {
    createTicketDTO,
    createTicketQueryDTO
};
*/
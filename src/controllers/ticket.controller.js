// TODO_ Pasarlo a clase esto
import ProductManager from '../managers/product.manager.js'
import TicketManager from '../managers/ticket.manager.js'

const SUCCESS = 'success'

class TicketController {

    static async getOne(req, res) {
        try {
            const id = req.params.cid

            const ticket = await TicketManager.getOne(id, true);

            if (ticket) {
                console.log({ticket})
                res.status(200).json({ ticket });
            } else {
                res.status(404).json({ error: `Ticket with ID: ${id} not found` });
            }
        } catch (error) {
            console.error(`Error loading ticket: ${error}`, error);
            res.status(500).json({ error: 'Error retrieving ticket' });
        }
    }

    static async getAll(req, res) {
        try {
            // Manipulacion de los parametros del <body> y del <queryString> => por seguridad.

            const {
                limit = 10,
                page = 1,
            } = req.query != null ? req.query : {};

            // Obtención de parametros desde el queryString

            // Formacion del objeto query para perfeccionar la query.
            const query = {};

            const options = {
                limit,
                page,
                // TODO: Agregar algun sorting luego
            };

            // Llamada a la capa de negocio
            const managerOutput = await TicketManager.getAll({
                host: req.get('host'),
                protocol: req.protocol,
                baseUrl: req.baseUrl,
                query,
                options
            });

            // Construir la respuesta JSON
            const response = {
                status: SUCCESS,
                Tickets: managerOutput.tickets,
                Query: managerOutput.pagination,
            };

            // Envío respuesta
            res.json({ message: "Lista de Carros:", response })

        } catch (error) {
            console.error(`Error loading tickets: ${error}`, error);
            res.status(500).json({ error: 'Error retrieving tickets' });
        }
    }

    static async add(req, res) {
        try {

            //const cartId = req.params.cid
            const userId = req.session.userId

            const parameterValidation = TicketController.validateInsertion(req.body)

            if (!parameterValidation) {
                return res.status(400).json({
                    error: "Parametros inválidos"
                });
            }

            // TODO - maniobrar los parametros aca
            const newTicket = await TicketManager.add({
                ...req.body,
                //cartId,
                userId
            });

            return res.json({
                message: "Ticket creado!!!",
                Ticket: newTicket,
            });

        } catch (err) {
            console.error("Error al guardar el Ticket:", err);
            return res.status(500).json({
                error: "Error en la base de datos",
                details: err.message
            });
        }
    }

    static async update(req, res) {

        try {
            const id = req.params.cid

            const parameterValidation = TicketController.validateUpdate(req.body)

            if (!parameterValidation) {
                return res.status(400).json({
                    error: "Parametros inválidos"
                });
            }

            const updatedTicket = await TicketManager.update({
                ...req.body,
                id
            })

            return res.json({
                message: "Ticket actualizado!!!",
                Ticket: updatedTicket,
            });

        } catch (err) {
            console.error("Error al actualizar el Ticket:", err);
            return res.status(500).json({
                error: "Error en la base de datos",
                details: err.message
            });
        }

    }

    static async delete(req, res) {
        try {
            const ticketId = req.params.cid;

            const deletionOutput = await TicketManager.delete(ticketId);

            return res.json({
                message: "Operacion de ticketo procesada",
                output: deletionOutput, // INFO: Aca es 0 cuando borra algo, N cuando logra encontrar algo y borrarlo
                id: ticketId,
            });

        } catch (error) {
            return res.status(500).json({
                error: "Error en la base de datos",
                details: err.message
            });
        }
    }


    /* Otros métodos controladores */

    /* Métodos internos - No expuestos en routes */
    // TODO - Completar.
    static validateInsertion = (body) => true

    static validateUpdate = (body) => true

    static validateProductInsertion = (body) => true

    static validateProductUpdate = (body) => true

    static validateProductDelete = (body) => true

}

export default TicketController;
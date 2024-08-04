import TicketManager from '../managers/ticket.manager.js'

import { customLogger } from '../appHelpers/logger.helper.js';

const SUCCESS = 'success'

class TicketController {

    static async getOne(req, res) {
        try {
            const id = req.params.cid

            const ticket = await TicketManager.getOne(id, true);

            if (ticket) {
                customLogger.info({ ticket })
                res.status(200).json({ ticket });
            } else {
                res.status(404).json({ error: `Ticket with ID: ${id} not found` });
            }
        } catch (error) {
            customLogger.error(`Error loading ticket: ${error}`, { ...error });
            res.status(500).json({ error: 'Error retrieving ticket' });
        }
    }

    static async getAll(req, res) {
        try {
            customLogger.info("Ticket Router > getAll", { dto: req.dto })

            // Llamada a la capa de negocio
            const managerOutput = await TicketManager.getAll(req.dto);

            // Construir la respuesta JSON
            const response = {
                status: SUCCESS,
                Tickets: managerOutput.tickets,
                Query: managerOutput.pagination,
            };

            // Envío respuesta
            res.json({ message: "Lista de Tickets:", response })

        } catch (error) {
            customLogger.error(`Error loading tickets: ${error}`, { ...error });
            res.status(500).json({ error: 'Error retrieving tickets' });
        }
    }

    static async add(req, res) {
        try {
            customLogger.info("================= ADD ===============");

            const userId = req.session.userId;
            const userRole = req.session.user.role;

            const newTicket = await TicketManager.add(req.dto, userId, userRole);

            return res.json({
                message: "Ticket creado!!!",
                Ticket: newTicket,
            });

        } catch (err) {
            customLogger.error("Error al guardar el Ticket:", { ...err });
            return res.status(500).json({
                error: "Error en la base de datos",
                details: err.message
            });
        }
    }

    static async update(req, res) {
        try {
            customLogger.info("================= UPDATE ===============");

            const updatedTicket = await TicketManager.update(req.dto)

            return res.json({
                message: "Ticket actualizado!!!",
                Ticket: updatedTicket,
            });

        } catch (err) {
            customLogger.error("Error al actualizar el Ticket:", { ...err });
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

        } catch (err) {
            return res.status(500).json({
                error: "Error en la base de datos",
                details: err.message
            });
        }
    }

}

export default TicketController;

export default class TicketRepository {

    constructor(dao) {
        /**
         * Asignación del DATA-ACCESS-OBJECT seleccionado 
         * Podrá ser:  Mongo o Memory por ahora
         * Ejemplo aquí, si la PERSISTENCIA sería "MONGO"
         * entonces esto haría referencia a dao/mongo/services/ticket.service.js
         * - e invocaría a métodos "homologados" (o interfaz) que 
         * -- en definitva haria uso de las capacidades de mongo.
         */
        console.log("Repository > Ticket", { dao })
        this.dao = dao;
    }

    async getOne(id) {
        const result = await this.dao.getOne(id)

        return result
    }

    async getAll(TicketQueryDTO) {
        const result = await this.dao.getAll(TicketQueryDTO)

        return result
    }

    async insert(TicketDTO) {
        const result = await this.dao.insert(TicketDTO)

        return result
    }

    async update(TicketDTO) {

        const result = await this.dao.update(TicketDTO)

        return result
    }

    async deleteOne(id) {
        const result = await this.dao.deleteOne(id)

        return result
    }

}

export default class CartRepository {

    constructor(dao) {
        /**
         * Asignación del DATA-ACCESS-OBJECT seleccionado 
         * Podrá ser:  Mongo o Memory por ahora
         * Ejemplo aquí, si la PERSISTENCIA sería "MONGO"
         * entonces esto haría referencia a dao/mongo/services/cart.service.js
         * - e invocaría a métodos "homologados" (o interfaz) que 
         * -- en definitva haria uso de las capacidades de mongo.
         */
        this.dao = dao;
    }

    async getOne(id) {
        const result = await this.dao.getOne(id)

        return result
    }

    async getAll(CartQueryDTO) {
        const result = await this.dao.getAll(CartQueryDTO)

        return result
    }

    async insert(CartDTO) {
        const result = await this.dao.insert(CartDTO)

        return result
    }

    async update(CartDTO) {

        const result = await this.dao.update(CartDTO)

        return result
    }

    async deleteOne(id) {
        const result = await this.dao.deleteOne(id)

        return result
    }

}
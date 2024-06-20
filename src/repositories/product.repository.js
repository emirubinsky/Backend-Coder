
export default class ProductRepository {

    constructor(dao) {
        /**
         * Asignación del DATA-ACCESS-OBJECT seleccionado 
         * Podrá ser:  Mongo o Memory por ahora
         * Ejemplo aquí, si la PERSISTENCIA sería "MONGO"
         * entonces esto haría referencia a dao/mongo/services/product.service.js
         * - e invocaría a métodos "homologados" (o interfaz) que 
         * -- en definitva haria uso de las capacidades de mongo.
         */
        this.dao = dao;
    }

    async getOne(id) {
        const result = await this.dao.getOne(id)

        return result
    }

    async getAll(ProductQueryDTO) {
        const result = await this.dao.getAll(ProductQueryDTO)

        return result
    }

    async insert(ProductDTO) {
        const result = await this.dao.insert(ProductDTO)

        return result
    }

    async update(ProductDTO) {

        const result = await this.dao.update(ProductDTO)

        return result
    }

    async deleteOne(id) {
        const result = await this.dao.deleteOne(id)

        return result
    }

}
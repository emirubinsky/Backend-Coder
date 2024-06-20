
export default class UserRepository {

    constructor(dao) {
        /**
         * Asignación del DATA-ACCESS-OBJECT seleccionado 
         * Podrá ser:  Mongo o Memory por ahora
         * Ejemplo aquí, si la PERSISTENCIA sería "MONGO"
         * entonces esto haría referencia a dao/mongo/services/user.service.js
         * - e invocaría a métodos "homologados" (o interfaz) que 
         * -- en definitva haria uso de las capacidades de mongo.
         */
        this.dao = dao;
    }

    async getOne(id) {
        const result = await this.dao.getOne(id)

        return result
    }

    async getAll(UserQueryDTO) {
        const result = await this.dao.getAll(UserQueryDTO)

        return result
    }

    async insert(UserDTO) {
        const result = await this.dao.insert(UserDTO)

        return result
    }

    async update(UserDTO) {

        const result = await this.dao.update(UserDTO)

        return result
    }

    async deleteOne(id) {
        const result = await this.dao.deleteOne(id)

        return result
    }

}
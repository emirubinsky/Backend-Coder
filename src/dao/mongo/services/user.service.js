import User from "../models/user.model.js";
import { customLogger } from '../../../appHelpers/logger.helper.js';

const model = User

export default class UserMongoService {
    constructor() { }

    // TODO - Considerar usar el middleware de "pre" para alterar las salidas de ciertas operaciones.
    // Clase: 16
    // Peligro, hay que definirlo en el modelo, y es GLOBAL a todas las operaciones.
    async getOne(id, populate = false) {

        const result = await model
            .findOne({ _id: id })
            .lean()
        /* 
        populate ?
            await model
                .findOne({ _id: id })
                .populate('products.product')
                .lean() :
            await model
                .findOne({ _id: id })
                .lean()

        */

        return result
    }

    async findByEmail(email) {
        try {
            const user = await model.findOne({ email });
            return user;
        } catch (error) {
            throw new Error("Error al buscar usuario por correo electrónico: " + error.message);
        }
    }

    async findInactiveUsers(inactivityPeriod) {
        const inactivityDate = new Date(Date.now() - inactivityPeriod);
        console.log('findInactiveUsers > inactivityDate:', inactivityDate);
        try {
            const filter = {
                $or: [
                    { last_connection: { $exists: false } },
                    { last_connection: { $lt: inactivityDate } }
                ]
            };

            const users = await model.find(filter)//{ last_connection: { $lte: inactivityDate } }

            const inactiveUsers = []

            console.log('findInactiveUsers > users:', users);
            return users;
        } catch (error) {
            throw new Error("Error al buscar usuarios inactivos: " + error.message);
        }
    }

    async deleteInactiveUser(userId) {
        try {
            const deleteInactiveUser = await model.deleteOne({ _id: userId });
            return deleteInactiveUser;
        } catch (error) {
            throw new Error("Error al eliminar el usuario inactivo: " + error.message);
        }
    }

    async getAll(productQueryDTO) {

        const {
            host,
            protocol,
            baseUrl,
            query,
            limit,
            page,
            sort
        } = productQueryDTO

        const options = {
            page,
            limit
            //sort
        }

        const userPaginationOutput = await model.paginate(query, options);

        const users = userPaginationOutput.docs.map(user => user.toObject());

        let prevLink = null;
        if (userPaginationOutput.hasPrevPage) {
            prevLink = `${protocol}://${host}${baseUrl}?page=${userPaginationOutput.prevPage}`;
        }

        // Determinar el link para la página siguiente
        let nextLink = null;
        if (userPaginationOutput.hasNextPage) {
            nextLink = `${protocol}://${host}${baseUrl}?page=${userPaginationOutput.nextPage}`;
        }

        return {
            users,
            pagination: {
                totalDocs: userPaginationOutput.totalDocs,
                limit: userPaginationOutput.limit,
                totalPages: userPaginationOutput.totalPages,
                page: userPaginationOutput.page,
                pagingCounter: userPaginationOutput.pagingCounter,
                hasPrevPage: userPaginationOutput.hasPrevPage,
                hasNextPage: userPaginationOutput.hasNextPage,
                prevPage: userPaginationOutput.prevPage,
                nextPage: userPaginationOutput.nextPage,
                prevLink,
                nextLink
            }
        }
    }

    async insert({ user }) {

        const newEntity = new User({
            user
        });

        const existentUser = await model.findOne({ user });
        customLogger.info("MONGO SERVICE > CART | CHECKING EXISTENCE", { existentUser })
        if (existentUser) {
            return existentUser
        }

        // else: create a new one
        const newInsertedDoc = await newEntity.save()
        return newInsertedDoc;

    }

    async update(userDTO) {

        const filter = {
            _id: userDTO.id
        }

        /*
            Datos a validar: user-password: $2b$10$S8.a5WV50d0l.7aF7TkgueiMlfBMwEL.k4zh8qvOmCm9wF1ZI9B2K, password: 123
            MONGO > user.service > update {
            filter: { _id: undefined },
            userDTO: UserDTO {
                first_name: 'Roberto',
                last_name: 'Perez',
                full_name: 'Roberto, Perez',
                email: 'admin_perez@mail.com',
                age: 34,
                password: '$2b$10$S8.a5WV50d0l.7aF7TkgueiMlfBMwEL.k4zh8qvOmCm9wF1ZI9B2K',
                role: 'admin',
                profile: undefined,
                last_connection: 2024-08-01T19:04:48.120Z,
                documents: undefined
            }
            }
            MONGO > user.service > updatedDoc { updatedDoc: null }
            login > updatedUser { updatedUser: null }
        */

        console.log("MONGO > user.service > update", { filter, userDTO })

        const updatedDoc = await model.findOneAndUpdate(filter, userDTO, {
            returnOriginal: false
        })

        console.log("MONGO > user.service > updatedDoc", { updatedDoc })

        return updatedDoc;
    }

    async deleteOne(id) {
        const deletedEntity = await model.deleteOne({ _id: id }).lean();

        return deletedEntity
    }

}

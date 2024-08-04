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

            /*
            users.forEach(user => {
                console.log('findInactiveUsers > users:', {
                    userId: user._id,
                    lastConnection: user.last_connection
                });
            })
            */

            console.log('findInactiveUsers > users:', users);
            return users;
        } catch (error) {
            throw new Error("Error al buscar usuarios inactivos: " + error.message);
        }
    }

    async deleteInactiveUser(userId){
        try {
            const deleteInactiveUser = await model.deleteOne({ _id: userId });
            return deleteInactiveUser;
        } catch (error) {
            throw new Error("Error al eliminar el usuario inactivo: " + error.message);
        }
    }

    async getAll({
        host,
        protocol,
        baseUrl,
        query,
        limit,
        page
    }) {
        const options = {
            page,
            limit,
            populate: {
                path: 'products.product', // populate the product field in the products array
                select: "_id title price"
            }
            //sort
        }

        const userPaginationOutput = await model.paginate(query, options);

        // Access paginated users with populated 'items'
        // Access paginated users with populated 'products'
        userPaginationOutput.docs.forEach((user) => {
            customLogger.info('-------');
            customLogger.info('User ID:', user._id);
            customLogger.info('User:', user.user);
            customLogger.info('Products:', user.products);
            user.products
                .filter(userProduct => userProduct.product !== null)
                .forEach((userProduct) => {
                    customLogger.info('Product ID:', userProduct.product._id);
                    //customLogger.info('Product Name:', userProduct.product.name);
                    customLogger.info('Product Title:', userProduct.product.title);
                    customLogger.info('Quantity:', userProduct.quantity);
                });
        });
        //

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

    async insert({ products, user }) {

        const newEntity = new User({
            products,
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

    async update({ id, products, user }) {

        const filter = {
            _id: id
        }

        const entityToUpdate = {
            user,
            products
        }

        customLogger.info("MONGO > user.service > update", { filter, entityToUpdate })

        const updatedDoc = await model.findOneAndUpdate(filter, entityToUpdate, {
            returnOriginal: false
        })

        return updatedDoc;
    }

    async deleteOne(id) {
        const deletedEntity = await model.deleteOne({ _id: id }).lean();

        return deletedEntity
    }

}

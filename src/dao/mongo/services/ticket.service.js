import Product from "../models/product.model.js"
import Ticket from "../models/ticket.model.js";

const model = Ticket

export default class TicketMongoService {

    constructor() { }

    // TODO - Considerar usar el middleware de "pre" para alterar las salidas de ciertas operaciones.
    // Clase: 16
    // Peligro, hay que definirlo en el modelo, y es GLOBAL a todas las operaciones.
    async getOne(id, populate = false) {

        // Version nueva.

        const result = populate ?
            await model
                .findOne({ _id: id })
                .populate('products.product')
                .lean() :
            await model
                .findOne({ _id: id })
                .lean()


        return result

        // Version vieja.
        /*
        const result = populate ?
            await model
                .findOne({ _id: id })
                .populate('cart')
                .lean()
                .then(async (ticket) => {
                    if (ticket.cart && ticket.cart.products) {
                        // Extract product IDs from the cart
                        const productIds = ticket.cart.products.map(item => item.product);

                        // Retrieve all products using the Product model
                        const populatedProducts = await Product.find({ _id: { $in: productIds } });

                        // Map populated products back to the cart items
                        ticket.cart.products.forEach(item => {
                            const matchingProduct = populatedProducts.find(p => p._id.toString() === item.product.toString());
                            if (matchingProduct) {
                                item.product = matchingProduct; // Replace product ID with populated product
                            }
                        });
                    }
                    return ticket;
                })
            :
            await model
                .findOne({ _id: id })
                .lean()


        return result
        */
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
            // Logica Nueva
            populate: {
                path: 'products.product', // populate the product field in the products array
                select: "_id title price"
            }
        }

        const ticketPaginationOutput = await model.paginate(query, options);

        // Logica Vieja
        /*
        // Extract all product IDs from the paginated entities
        const productIds = ticketPaginationOutput.docs.reduce((ids, ticket) => {
            if (ticket.cart && ticket.cart.products) {
                ticket.cart.products.forEach(item => {
                    ids.push(item.product);
                });
            }
            return ids;
        }, []);

        // Retrieve all products using the Product model
        const populatedProducts = await Product.find({ _id: { $in: productIds } });

        // Map populated products back to each entity's cart
        ticketPaginationOutput.docs.forEach(ticket => {
            if (ticket.cart && ticket.cart.products) {
                ticket.cart.products.forEach(item => {
                    const matchingProduct = populatedProducts.find(p => p._id.toString() === item.product.toString());
                    if (matchingProduct) {
                        item.product = matchingProduct; // Replace product ID with populated product
                    }
                });
            }
        });
        */

        let prevLink = null;
        if (ticketPaginationOutput.hasPrevPage) {
            prevLink = `${protocol}://${host}${baseUrl}?page=${ticketPaginationOutput.prevPage}`;
        }

        // Determinar el link para la página siguiente
        let nextLink = null;
        if (ticketPaginationOutput.hasNextPage) {
            nextLink = `${protocol}://${host}${baseUrl}?page=${ticketPaginationOutput.nextPage}`;
        }

        const tickets = ticketPaginationOutput.docs.map(ticket => ticket.toObject());

        return {
            tickets,
            pagination: {
                totalDocs: ticketPaginationOutput.totalDocs,
                limit: ticketPaginationOutput.limit,
                totalPages: ticketPaginationOutput.totalPages,
                page: ticketPaginationOutput.page,
                pagingCounter: ticketPaginationOutput.pagingCounter,
                hasPrevPage: ticketPaginationOutput.hasPrevPage,
                hasNextPage: ticketPaginationOutput.hasNextPage,
                prevPage: ticketPaginationOutput.prevPage,
                nextPage: ticketPaginationOutput.nextPage,
                prevLink,
                nextLink
            }
        }
    }

    async insert({
        code,
        purchase_datetime,
        amount,
        purchaser,
        // cart,
        products,
        user
    }) {
        const newEntity = new Ticket({
            code,
            purchase_datetime,
            amount,
            purchaser,
            // cart,
            products,
            user
        });

        const newInsertedDoc = await newEntity.save()
        return newInsertedDoc;

    }

    async update({
        id,
        code,
        purchase_datetime,
        amount,
        purchaser,
        // cart,
        products,
        user
    }) {

        const filter = {
            _id: id
        }

        const entityToUpdate = {
            id,
            code,
            purchase_datetime,
            amount,
            purchaser,
            // cart,
            products,
            user
        }

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


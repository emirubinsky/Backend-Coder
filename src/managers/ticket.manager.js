import * as service from '../services/ticket.service.js'
import ProductManager from '../managers/product.manager.js'
import CartManager from '../managers/cart.manager.js'

class TicketManager {

    static async getOne(id, populate = false) {
        // Perform business logic operations
        // Nothing...

        // Call service layer for database interactions
        const result = await service.getOne(id, populate)

        return result;

    }

    static async getAll({ host, protocol, baseUrl, query, options }) {

        const serviceOutput = await service.getAll({ query, options });

        const tickets = serviceOutput.docs.map(ticket => ticket.toObject());

        let prevLink = null;
        if (serviceOutput.hasPrevPage) {
            prevLink = `${protocol}://${host}${baseUrl}?page=${serviceOutput.prevPage}`;
        }

        // Determinar el link para la página siguiente
        let nextLink = null;
        if (serviceOutput.hasNextPage) {
            nextLink = `${protocol}://${host}${baseUrl}?page=${serviceOutput.nextPage}`;
        }

        return {
            tickets,
            pagination: {
                totalDocs: serviceOutput.totalDocs,
                limit: serviceOutput.limit,
                totalPages: serviceOutput.totalPages,
                page: serviceOutput.page,
                pagingCounter: serviceOutput.pagingCounter,
                hasPrevPage: serviceOutput.hasPrevPage,
                hasNextPage: serviceOutput.hasNextPage,
                prevPage: serviceOutput.prevPage,
                nextPage: serviceOutput.nextPage,
                prevLink,
                nextLink
            }
        }

    }

    static async add(newTicketDetail) {

        /**
         * Desde el controller yo recibiría
         * - el userId => y de ahi saco el email
         * - el cartId => y de ahí nada, lo uso
         * - y calculo el total
         * -- llamando al carrito, iterando el producto y todo.
         */
        const { cartId, userId } = newTicketDetail

        const cart = await CartManager.getOne(cartId, true)

        // Use reduce() to calculate total cost
        const totalCost = cart.products.reduce((accumulator, cartProduct) => {
            // Multiply product price with quantity and add to accumulator
            const productPrice = cartProduct.product.price; // Access product price
            const quantity = cartProduct.quantity; // Access quantity

            const productTotal = productPrice * quantity; // Calculate total cost for this product

            return accumulator + productTotal; // Accumulate total cost
        }, 0); // Initial accumulator value is 0

        
        const insertBody = {
            //code,
            purchase_datetime: new Date(),
            amount: totalCost,
            purchaser: userId,
            cart: cartId,
            user: userId
        }

        console.log("ticket > insert", { insertBody })
        // TODO: Poner mas validaciones...

        const serviceOutput = await service.insert(insertBody);

        return serviceOutput
    }

    /**
     * El ticketToUpdate va a tener
     * - OBLIGATORIAMENTE el ID.
     * - Y un puñado de props para actualizar (opcional)
     */
    static async update(ticketToUpdate) {

        console.log({ ticketToUpdate })
        const serviceOutput = await service.update(ticketToUpdate);

        return serviceOutput

    }

    static async delete(id) {
        return await service.deleteOne(id);
    }

}


export default TicketManager;
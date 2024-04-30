import * as service from '../services/cart.service.js'
import ProductManager from '../managers/product.manager.js'

class CartManager {

    static async getOne(id, populate = false) {
        // Perform business logic operations
        // Nothing...

        // Call service layer for database interactions
        const result = await service.getOne(id)

        return result;

    }

    static async getAll({ host, protocol, baseUrl, query, options }) {

        const serviceOutput = await service.getAll({ query, options });

        const carts = serviceOutput.docs.map(cart => cart.toObject());

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
            carts,
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

    static async add(newCartDetail) {

        // TODO: Poner mas validaciones...

        const serviceOutput = await service.insert(newCartDetail);

        return serviceOutput
    }

    /**
     * El cartToUpdate va a tener
     * - OBLIGATORIAMENTE el ID.
     * - Y un puñado de props para actualizar (opcional)
     */
    static async update(cartToUpdate) {

        console.log({ cartToUpdate })
        const serviceOutput = await service.update(cartToUpdate);

        return serviceOutput

    }

    static async delete(id) {
        return await service.deleteOne(id);
    }

    static async updateProductQuantity({ cartToUpdate, product, newQuantity }) {

        // Check if product already exists in the cart
        console.log("productos antes de", cartToUpdate.products)
        const existingProduct = cartToUpdate.products.find(item => item.product.equals(product._id));

        if (existingProduct) {
            existingProduct.quantity = newQuantity;
        } else {
            cartToUpdate.products.push({
                product: product._id,
                quantity: newQuantity
            });
        }

        // TODO - unificar bien el tema _id
        cartToUpdate.id = cartToUpdate._id

        console.log("productos despues de", cartToUpdate.products)

        return await CartManager.update(cartToUpdate)
    }

    static async removeProductFromCart({ cartToUpdate, product }) {

        cartToUpdate.products = cartToUpdate.products.filter(item => !item.product.equals(product._id));

        // TODO - unificar bien el tema _id
        cartToUpdate.id = cartToUpdate._id

        return await CartManager.update(cartToUpdate)
    }

}


export default CartManager;
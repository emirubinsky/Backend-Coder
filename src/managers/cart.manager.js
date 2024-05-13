import * as service from '../services/cart.service.js'
import ProductManager from '../managers/product.manager.js'

class CartManager {

    static async getOne(id, populate = false) {
        // Perform business logic operations
        // Nothing...

        // Call service layer for database interactions
        const result = await service.getOne(id, populate)

        return result;

    }

    static async getAll({ host, protocol, baseUrl, query, options }) {

        const serviceOutput = await service.getAll({ query, options });

        //
        //console.log('Paginated Carts:', serviceOutput);
        // Access paginated carts with populated 'items'
        // Access paginated carts with populated 'products'
        serviceOutput.docs.forEach((cart) => {
            console.log('Cart ID:', cart._id);
            console.log('User ID:', cart.user);
            console.log('Products:');
            cart.products.forEach((cartProduct) => {
                console.log('Product ID:', cartProduct.product._id);
                console.log('Product Name:', cartProduct.product.name);
                console.log('Product Title:', cartProduct.product.title);
                console.log('Quantity:', cartProduct.quantity);
            });
        });
        //

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

        try {
            console.log({ newCartDetail })

            const validation = await this.validateCart(newCartDetail)

            const serviceOutput = await service.insert(newCartDetail);

            return serviceOutput
        } catch (error) {
            return error
        }

    }

    /**
     * El cartToUpdate va a tener
     * - OBLIGATORIAMENTE el ID.
     * - Y un puñado de props para actualizar (opcional)
     */
    static async update(cartToUpdate) {
        try {
            console.log({ cartToUpdate })

            const validation = await this.validateCart(cartToUpdate)

            const serviceOutput = await service.update(cartToUpdate);

            return serviceOutput
        } catch (error) {
            return error
        }
    }

    static async delete(id) {
        return await service.deleteOne(id);
    }

    static async updateProductQuantity({ cartToUpdate, product, newQuantity }) {

        try {
            const validation = await this.validateCartProduct(product, newQuantity)

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
        } catch (error) {
            return error
        }
    }

    static async removeProductFromCart({ cartToUpdate, product }) {

        cartToUpdate.products = cartToUpdate.products.filter(item => !item.product.equals(product._id));

        // TODO - unificar bien el tema _id
        cartToUpdate.id = cartToUpdate._id

        return await CartManager.update(cartToUpdate)
    }


    static async validateCart(cardDetail) {

        try {
            // Validamos usuario
            // TODO: Deberíamos crear un UserManager para estas cosas?
            // const user = await User.findById(cardDetail.userId);

            // Validamos cada producto
            // Existencia y luego stock

            for (const cartProduct of cardDetail.products) {
                const result = await this.validateCartProduct(
                    cartProduct.product,
                    cartProduct.quantity
                );
                // Handle `result` here if needed
            }

            return {
                success: true
            }
        } catch (error) {
            return {
                success: false,
                reason: error
            }
        }
    }

    static async validateCartProduct(productId, quantity) {
        try {
            const product = await ProductManager.getOne(productId);

            if (!product) {
                throw new Error("Producto no encontrado");
            }

            if (product.stock < 1) {
                throw new Error("Producto fuera de stock");
            }

            if (product.stock < quantity) {
                throw new Error("Producto no posee suficiente stock");
            }

            return {
                success: true
            }
        } catch (error) {
            return {
                success: false,
                reason: error
            }
        }
    }
}


export default CartManager;
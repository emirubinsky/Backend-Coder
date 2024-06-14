import { cartService } from "../repositories/index.js";
import ProductManager from './product.manager.js'
import { customLogger } from '../appHelpers/logger.helper.js';

class CartManager {
    static async getOne(id, populate = false) {
        // Perform business logic operations
        // Nothing...

        // Call cartService layer for database interactions
        const result = await cartService.getOne(id, populate)

        return result;

    }

    static async getAll(cartQueryDTO) {

        const serviceOutput = await cartService.getAll(cartQueryDTO);

        return serviceOutput

    }

    static async add(cartDTO) {
        try {
            customLogger.info("-----------------", { cartToAdd: cartDTO })

            const validation = await this.validateCart(cartDTO)

            const serviceOutput = await cartService.insert(cartDTO);

            return serviceOutput
        } catch (error) {
            customLogger.error("CART MANAGER > ERROR > add", {
                errorMessage: error.message,
                ...error
            })
            throw error
        }
    }

    static async initialize(cartDTO) {
        try {
            customLogger.info("-----------------", { cartToAdd: cartDTO })

            // const validation = await this.validateCart(cartDTO)
            const serviceOutput = await cartService.insert(cartDTO);

            return serviceOutput
        } catch (error) {
            customLogger.error("CART MANAGER > ERROR > add", {
                errorMessage: error.message,
                ...error
            })
            throw error
        }
    }

    /**
     * El cartToUpdate va a tener
     * - OBLIGATORIAMENTE el ID.
     * - Y un puñado de props para actualizar (opcional)
     */
    static async update(cartDTO) {
        try {
            customLogger.info("-----------------", { cartToUpdate: cartDTO })

            const validation = await this.validateCart(cartDTO)

            const serviceOutput = await cartService.update(cartDTO);

            return serviceOutput
        } catch (error) {
            customLogger.error("CART MANAGER > ERROR > update", {
                errorMessage: error.message,
                ...error
            })
            throw error
        }
    }

    static async delete(id) {
        try {
            const serviceOutput = await cartService.deleteOne(id);

            return serviceOutput
        } catch (error) {
            customLogger.error("CART MANAGER > ERROR > delete", {
                errorMessage: error.message,
                ...error
            })
            throw error
        }
    }

    static async updateProductQuantity(updateQuantityCartDTO, userId, userRole) {

        try {
            const cartId = updateQuantityCartDTO.id
            const productId = updateQuantityCartDTO.products[0].product
            const newQuantity = updateQuantityCartDTO.products[0].quantity
            const replaceQuantity = updateQuantityCartDTO.products[0].replace

            const cart = await this.getOne(cartId)

            if (!cart) {
                return new Error('Cart not found - We can not continue');
            }
            cart.id = cart._id

            // TODO - Poner aquí validación de Cart x User

            const product = await ProductManager.getOne(productId)

            if (!product) {
                return new Error('Product not found - We can not continue');
            }

            if(userRole !== "admin" || "premium") {
                logger.warn(`User no autorizado`);
                throw new Error("Usted no esta autorizado");
            }

            if(userRole == "premium" && userId == product.owner) {
                logger.warn(`User es autor de este producto`);
                throw new Error("Usted es el creador de este producto, no puede agregarlo al carrito");
            }

            const validation = await this.validateCartProduct(product, newQuantity)

            // Check if product already exists in the cart
            
            customLogger.info("productos antes de", cart.products)

            const existingProduct = cart.products.find(item => item.product._id.toString() === product._id.toString());

            if (existingProduct) {
                if(replaceQuantity){
                    existingProduct.quantity = newQuantity;
                }else{
                    existingProduct.quantity += newQuantity;
                }
                
            } else {
                cart.products.push({
                    product: product._id,
                    quantity: newQuantity
                });
            }
            
            customLogger.info("productos despues de", cart.products)
            
            const serviceOutput = await CartManager.update(cart)
            return serviceOutput
        } catch (error) {
            customLogger.error("CART MANAGER > ERROR > updateProductQuantity", {
                reason: error.message,
                ...error
            })
            throw error
        }
    }

    static async removeProductFromCart({ cartId, productId, userId, userRole }) {

        try {

            const cart = await this.getOne(cartId)

            if (!cart) {
                return new Error('Cart not found - We can not continue');
            }

            // TODO - Poner aquí validación de Cart x User

            const product = await ProductManager.getOne(productId)

            if (!product) {
                return new Error('Product not found - We can not continue');
            }

            if(userRole !== "admin" || "premium") {
                logger.warn(`User no autorizado`);
                throw new Error("Usted no esta autorizado");
            }

            if(userRole == "premium" && userId == product.owner) {
                logger.warn(`User es autor de este producto`);
                throw new Error("Usted es el creador de este producto, no puede agregarlo al carrito");
            }

            cart.products = cart.products.filter(item => !item.product.equals(product._id));

            // TODO - unificar bien el tema _id
            cart.id = cart._id

            return await CartManager.update(cart)
        } catch (error) {
            customLogger.info("removeProductFromCart > ERROR", {
                reason: error.message
            })
            throw error
        }
    }

    static async validateCart(cartDTO) {

        try {
            // Validamos usuario
            // TODO: Deberíamos crear un UserManager para estas cosas?
            // const user = await User.findById(cardDetail.userId);

            // Validamos cada producto
            // Existencia y luego stock

            for (const cartProduct of cartDTO.products) {
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
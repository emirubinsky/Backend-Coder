import { ticketService } from "../repositories/index.js";
import ProductManager from './product.manager.js'
import CartManager from './cart.manager.js'

import ProductDTO from '../dao/dto/product.dto.js'
import CartDTO from "../dao/dto/cart.dto.js";

import messenger from "../appHelpers/messenger.js";

class TicketManager {

    static async getOne(id, populate = false) {
        try {
            const serviceOutput = await ticketService.getOne(id, populate)

            return serviceOutput
        } catch (error) {
            console.error("TICKET MANAGER > ERROR > getOne", {
                errorMessage: error.message
            })
            throw error
        }
    }

    static async getAll(ticketQueryDTO) {
        try {
            const serviceOutput = await ticketService.getAll(ticketQueryDTO);

            return serviceOutput
        } catch (error) {
            console.error("TICKET MANAGER > ERROR > getAll", {
                errorMessage: error.message
            })
            throw error
        }
    }

    static async add(ticketDTO) {
        try {
            console.log("-----------------", { ticketToAddDraft: ticketDTO })
            /**
             * Desde el controller yo recibiría
             * - el userId => y de ahi saco el email
             * - el cartId => y de ahí nada, lo uso
             * - y calculo el total
             * -- llamando al carrito, iterando el producto y todo.
             */
            const {
                cart: cartId,
                user: userId
            } = ticketDTO

            const cart = await CartManager.getOne(cartId, true)
            console.log("ticketDTO > add", {cart})
            const productsToPurchase = [];
            const productsToKeepInCart = [];

            const productUpdateResults = []

            for (const cartProductItem of cart.products) {
                const product = await ProductManager.getOne(cartProductItem.product);

                if (!product) {
                    throw new Error(`Producto con ID ${cartProductItem.product} no encontrado`);
                }

                if (product.stock >= cartProductItem.quantity) {
                    // Suficiente stock, reducir stock y agregar a la compra
                    product.stock -= cartProductItem.quantity;


                    const productDTO = new ProductDTO({
                        title: product.title,
                        description: product.description,
                        code: product.code,
                        category: product.category,
                        brand: product.brand,
                        price: product.price,
                        stock: product.stock,
                        status: product.status,
                        image: product.image,
                        thumbnails: product.thumbnails,
                        id: product._id
                    })

                    const productUpdateResult = await ProductManager.update(productDTO)
                    productUpdateResults.push(productUpdateResult)

                    // totalPurchaseAmount += item.productTotal; // TODO revisar esto.
                    productsToPurchase.push(cartProductItem);
                } else {
                    // No suficiente stock, mantener en el carrito
                    productsToKeepInCart.push(cartProductItem);
                }
            }

            if (productsToPurchase.length === 0) {
                throw new Error("No hay productos suficientes en stock para realizar la compra");
            }

            // Use reduce() to calculate total cost
            // Usamos <productsToPurchase> en vez de <carts.products> porque nos interesa solo calcular el total
            // de lo que pudimos comprar
            const totalCost = productsToPurchase.reduce((accumulator, cartProduct) => {
                // Multiply product price with quantity and add to accumulator
                const productPrice = cartProduct.product.price; // Access product price
                const quantity = cartProduct.quantity; // Access quantity

                const productTotal = productPrice * quantity; // Calculate total cost for this product

                return accumulator + productTotal; // Accumulate total cost
            }, 0); // Initial accumulator value is 0


            const insertBody = {
                // Propiedad auto-generada por el DAO de turno.
                // code,
                purchase_datetime: new Date(),
                amount: totalCost,
                purchaser: userId,

                // cart,
                products: productsToPurchase,

                user: userId
            }

            console.log("-----------------", { ticketToAddFinal: insertBody })

            // Insertamos el ticket de la compra realizada con los productos
            const ticketInsertResult = await ticketService.insert(insertBody);

            // Limpiar el carrito y mantener los productos que no se pudieron comprar
            const cartDTOwithoutItemsThatWereNotPossibleToBuy = new CartDTO({
                products: productsToKeepInCart,
                user: cart.user,
                id: cart._id
            })

            const cartUpdateResult = CartManager.update(cartDTOwithoutItemsThatWereNotPossibleToBuy)

            const datosEmail = {
                to: ticketDTO.purchaserEmail, 
                subject: "Ticket Generado", 
                message: "Muchas gracias, su compra ha sido regitrado con el ID: " + ticketInsertResult._id 
            }
            console.log("TICKET MANAGER > EMAIL > ", { datosEmail })
            messenger.mandarEmail({
                datos: datosEmail
            })

            return {
                ticketInsertResult,
                productUpdateResults,
                cartUpdateResult
            }
        } catch (error) {
            console.error("TICKET MANAGER > ERROR > add", {
                errorMessage: error.message
            })
            throw error
        }
    }

    /**
     * El ticketToUpdate va a tener
     * - OBLIGATORIAMENTE el ID.
     * - Y un puñado de props para actualizar (opcional)
     */
    static async update(ticketDTO) {
        try {
            console.log("-----------------", { ticketToUpdate: ticketDTO })

            const serviceOutput = await ticketService.update(ticketDTO);

            return serviceOutput
        } catch (error) {
            console.error("TICKET MANAGER > ERROR > update", {
                errorMessage: error.message
            })
            throw error
        }
    }

    static async delete(id) {
        try {
            const serviceOutput = await ticketService.deleteOne(id);

            return serviceOutput
        } catch (error) {
            console.error("TICKET MANAGER > ERROR > update", {
                errorMessage: error.message
            })
            throw error
        }
    }

}


export default TicketManager;
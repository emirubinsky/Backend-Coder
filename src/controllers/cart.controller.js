// TODO_ Pasarlo a clase esto
import ProductManager from '../managers/product.manager.js'
import CartManager from '../managers/cart.manager.js'

const SUCCESS = 'success'

class CartController {

    static async getOne(req, res) {
        try {
            const id = req.params.cid

            const cart = await CartManager.getOne(id);

            if (cart) {
                res.status(200).json({ cart });
            } else {
                res.status(404).json({ error: `Cart with ID: ${id} not found` });
            }
        } catch (error) {
            console.error(`Error loading cart: ${error}`, error);
            res.status(500).json({ error: 'Error retrieving cart' });
        }
    }

    static async getAll(req, res) {
        try {
            // Manipulacion de los parametros del <body> y del <queryString> => por seguridad.

            const {
                limit = 10,
                page = 1,
            } = req.query != null ? req.query : {};

            // Obtención de parametros desde el queryString

            // Formacion del objeto query para perfeccionar la query.
            const query = {};

            const options = {
                limit,
                page,
                // TODO: Agregar algun sorting luego
            };

            // Llamada a la capa de negocio
            const managerOutput = await CartManager.getAll({
                host: req.get('host'),
                protocol: req.protocol,
                baseUrl: req.baseUrl,
                query,
                options
            });

            // Construir la respuesta JSON
            const response = {
                status: SUCCESS,
                Carts: managerOutput.carts,
                Query: managerOutput.pagination,
            };

            // Envío respuesta
            res.json({ message: "Lista de Carros:", response })

        } catch (error) {
            console.error(`Error loading carts: ${error}`, error);
            res.status(500).json({ error: 'Error retrieving carts' });
        }
    }

    static async add(req, res) {
        try {

            const parameterValidation = CartController.validateInsertion(req.body)

            if (!parameterValidation) {
                return res.status(400).json({
                    error: "Parametros inválidos"
                });
            }

            const newCart = await CartManager.add({
                ...req.body
            });

            return res.json({
                message: "Cart creado!!!",
                Cart: newCart,
            });

        } catch (err) {
            console.error("Error al guardar el Cart:", err);
            return res.status(500).json({
                error: "Error en la base de datos",
                details: err.message
            });
        }
    }

    static async update(req, res) {

        try {
            const id = req.params.cid

            const parameterValidation = CartController.validateUpdate(req.body)

            if (!parameterValidation) {
                return res.status(400).json({
                    error: "Parametros inválidos"
                });
            }

            const updatedCart = await CartManager.update({
                ...req.body,
                id
            })

            return res.json({
                message: "Cart actualizado!!!",
                Cart: updatedCart,
            });

        } catch (err) {
            console.error("Error al actualizar el Cart:", err);
            return res.status(500).json({
                error: "Error en la base de datos",
                details: err.message
            });
        }

    }

    static async delete(req, res) {
        try {
            const cartId = req.params.cid;

            const deletionOutput = await CartManager.delete(cartId);

            return res.json({
                message: "Operacion de carto procesada",
                output: deletionOutput, // INFO: Aca es 0 cuando borra algo, N cuando logra encontrar algo y borrarlo
                id: cartId,
            });

        } catch (error) {
            return res.status(500).json({
                error: "Error en la base de datos",
                details: err.message
            });
        }
    }

    static async updateProductQuantity(req, res) {
        
        const {
            cid: cartId,
            pid: productId
        } = req.params;

        const { quantity } = req.body

        try {
            const parameterValidation = CartController.validateProductInsertion({...req.query, ...req.body})

            if (!parameterValidation) {
                return res.status(400).json({
                    error: "Parametros inválidos"
                });
            }

            // TODO - Mover esta validacion al MANAGER.
            const cart = await CartManager.getOne(cartId)

            if (!cart) {
                return res.status(404).json({ error: 'Cart not found - We can not continue' });
            }

            const product = await ProductManager.getOne(productId)

            if (!product) {
                return res.status(404).json({ error: 'Product not found - We can not continue' });
            }

            const updatedCart = CartManager.updateProductQuantity({
                cartToUpdate: cart,
                id: cartId,
                product,
                newQuantity: quantity
            })

            return res.json({
                message: "Cart actualizado!!!",
                Cart: updatedCart,
            });

        } catch (error) {
            return res.status(500).json({
                error: "Error en la base de datos",
                details: error.message
            });
        }
    }

    static async removeProduct(req, res) {
        const {
            cid: cartId,
            pid: productId,
        } = req.params;

        try {

            const parameterValidation = CartController.validateProductInsertion(req.body)

            if (!parameterValidation) {
                return res.status(400).json({
                    error: "Parametros inválidos"
                });
            }

            const cart = await CartManager.getOne(cartId)

            if (!cart) {
                return res.status(404).json({ error: 'Cart not found - We can not continue' });
            }

            const product = await ProductManager.getOne(productId)

            if (!product) {
                return res.status(404).json({ error: 'Product not found - We can not continue' });
            }

            const updatedCart = CartManager.removeProductFromCart({
                cartToUpdate: cart,
                id: cartId,
                product
            })

            return res.json({
                message: "Cart actualizado!!!",
                Cart: updatedCart,
            });

        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /* Otros métodos controladores */

    /* Métodos internos - No expuestos en routes */
    // TODO - Completar.
    static validateInsertion = (body) => true

    static validateUpdate = (body) => true

    static validateProductInsertion = (body) => true

    static validateProductUpdate = (body) => true

    static validateProductDelete = (body) => true

}

export default CartController;
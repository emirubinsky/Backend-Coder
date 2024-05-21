import CartManager from '../managers/cart.manager.js'

const SUCCESS = 'success'

class CartController {

    static async getOne(req, res) {
        try {
            const id = req.params.cid

            const cart = await CartManager.getOne(id, true);

            if (cart) {
                console.log({ cart })
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
            console.log("Product Router > getAll", { dto: req.dto })

            // Llamada a la capa de negocio
            const managerOutput = await CartManager.getAll(req.dto);

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
            console.log("================= ADD ===============");

            const newCart = await CartManager.add(req.dto);

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

    static async initialize(req, res) {
        try {
            console.log("================= INITIALIZE ===============");

            const newCart = await CartManager.initialize(req.dto);

            return res.json({
                message: "Cart inicializado!!!",
                Cart: newCart,
            });

        } catch (err) {
            console.error("Error al inicializar el Cart:", err);
            return res.status(500).json({
                error: "Error en la base de datos",
                details: err.message
            });
        }
    }

    static async update(req, res) {

        try {
            console.log("================= UPDATE ===============");

            const updatedCart = await CartManager.update(req.dto)

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
                message: "Operacion de cart procesada",
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

        try {
            console.log("================= UPDATE QUANTITY ===============");

            const dto = req.dto

            const updatedCart = await CartManager.updateProductQuantity(dto)

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
        try {

            console.log("================= REMOVE PRODUCT ===============");

            const {
                cid: cartId,
                pid: productId,
            } = req.params;

            // TODO - Aca obtener el userId logueado

            const updatedCart = await CartManager.removeProductFromCart({
                cartId,
                productId,
                userId: "TODO: Mandarlo."
            })

            return res.json({
                message: "Cart actualizado!!!",
                Cart: updatedCart,
            });

        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}

export default CartController;
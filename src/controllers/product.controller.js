import ProductManager from '../managers/product.manager.js'

import { customLogger } from '../appHelpers/logger.helper.js';

const SUCCESS = 'success'

class ProductController {

    static async getOne(req, res) {
        try {
            const id = req.params.id

            const product = await ProductManager.getOne(id);

            if (product) {
                res.status(200).json({ product });
            } else {
                res.status(404).json({ error: `Product with ID: ${id} not found` });
            }
        } catch (error) {
            customLogger.error(`Error loading product: ${error}`, { ...error });
            res.status(500).json({ error: 'Error retrieving product' });
        }
    }

    static async getAll(req, res) {
        try {
            customLogger.info("Product Router > getAll", { dto: req.dto })

            // Llamada a la capa de negocio
            const managerOutput = await ProductManager.getAll(req.dto);

            // Construir la respuesta JSON
            // TODO: Debería ser un DTO de salida
            const response = {
                status: SUCCESS,
                Products: managerOutput.products,
                Query: managerOutput.pagination,
            };

            // Envío respuesta
            res.json({ message: "Lista de productos:", response })

        } catch (error) {
            customLogger.error(`Error loading products: ${error}`, { ...error });
            res.status(500).json({ error: 'Error retrieving products' });
        }
    }

    static async add(req, res) {
        try {
            customLogger.info("================= ADD ===============");

            req.dto.owner = req.session.userId;

            const newProduct = await ProductManager.add(req.dto);

            return res.json({
                message: "Producto creado!!!",
                Product: newProduct,
            });

        } catch (err) {
            customLogger.error("Error al guardar el Producto:", { ...err });
            return res.status(500).json({
                error: "Error en la base de datos",
                details: err.message
            });
        }
    }

    static async update(req, res) {

        try {
            customLogger.info("================= UPDATE ===============");

            const userId = req.session.userId;
            const userRole = req.session.user.role;

            const updatedProduct = await ProductManager.update(req.dto, userId, userRole)

            return res.json({
                message: "Producto actualizado!!!",
                Product: updatedProduct,
            });

        } catch (err) {
            customLogger.error("Error al actualizar el Producto:", { ...err });
            return res.status(500).json({
                error: "Error en la base de datos",
                details: err.message
            });
        }

    }

    static async delete(req, res) {
        try {
            const userId = req.session.userId;
            const userRole = req.session.user.role;

            const productId = req.params.id;

            const deletionOutput = await ProductManager.delete(productId, userId, userRole);

            return res.json({
                message: "Operacion de producto procesada",
                output: deletionOutput.deleteProduct, // INFO: Aca es 0 cuando borra algo, N cuando logra encontrar algo y borrarlo
                id: productId,
            });

        } catch (err) {
            customLogger.error("Error al actualizar el Producto:", { ...err });
            return res.status(500).json({
                error: "Error en la base de datos",
                details: err.message
            });
        }

    }

}

export default ProductController;
import ProductManager from '../managers/product.manager.js'

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
            console.error(`Error loading product: ${error}`, error);
            res.status(500).json({ error: 'Error retrieving product' });
        }
    }

    static async getAll(req, res) {
        try {
            console.log("Product Router > getAll", { dto: req.dto })
            
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
            console.error(`Error loading products: ${error}`, error);
            res.status(500).json({ error: 'Error retrieving products' });
        }
    }

    static async add(req, res) {
        try {
            console.log("================= ADD ===============");

            const newProduct = await ProductManager.add(req.dto);

            return res.json({
                message: "Producto creado!!!",
                Product: newProduct,
            });

        } catch (err) {
            console.error("Error al guardar el Producto:", err);
            return res.status(500).json({
                error: "Error en la base de datos",
                details: err.message
            });
        }
    }

    static async update(req, res) {

        try {
            console.log("================= UPDATE ===============");

            const updatedProduct = await ProductManager.update(req.dto)

            return res.json({
                message: "Producto actualizado!!!",
                Product: updatedProduct,
            });

        } catch (err) {
            console.error("Error al actualizar el Producto:", err);
            return res.status(500).json({
                error: "Error en la base de datos",
                details: err.message
            });
        }

    }

    static async delete(req, res) {
        try {
            const productId = req.params.id;

            const deletionOutput = await ProductManager.delete(productId);

            return res.json({
                message: "Operacion de producto procesada",
                output: deletionOutput, // INFO: Aca es 0 cuando borra algo, N cuando logra encontrar algo y borrarlo
                id: productId,
            });

        } catch (error) {
            return res.status(500).json({
                error: "Error en la base de datos",
                details: err.message
            });
        }

    }

}

export default ProductController;
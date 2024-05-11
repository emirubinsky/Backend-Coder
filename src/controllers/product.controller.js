import ProductManager from '../managers/product.manager.js'

const SUCCESS = 'success'

class ProductController {

    static async getOne (req, res) {
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

    static async getAll (req, res) {
        try {
            // Manipulacion de los parametros del <body> y del <queryString> => por seguridad.
            
            // Obtención de parametros desde el body.
            const { category, brand, sort } = req.query;

            const {
                limit = 5,
                page = 1,
            } = req.query != null ? req.query : {};

            // Obtención de parametros desde el queryString

            // Formacion del objeto query para perfeccionar la query.
            const query = {};

            if (category) {
                query.category = category;
            }

            if (brand) {
                query.brand = brand;
            }

            const options = {
                limit,
                page,
                sort: { price: sort === 'asc' ? 1 : -1 }
            };
            console.log({
                host: req.get('host'),
                protocol: req.protocol,
                baseUrl: req.baseUrl,
                options
              })
            // Llamada a la capa de negocio
            const managerOutput = await ProductManager.getAll({
                host: req.get('host'),
                protocol: req.protocol,
                baseUrl: req.baseUrl,
                query,
                options
            });

            // Construir la respuesta JSON
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

    static async add (req, res) {
        try {

            const parameterValidation = ProductController.validateInsertion(req.body)

            if (!parameterValidation) {
                return res.status(400).json({
                    error: "Parametros inválidos"
                });
            }

            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                return res.status(400).json({
                    error: 'No se proporcionó una imagen PRINCIPAL válida'
                });
            }

            const newProduct = await ProductManager.add({
                ...req.body,
                image: imageName,
            });

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

    static async update (req, res) {

        try {
            const id = req.params.id

            const parameterValidation = ProductController.validateUpdate(req.body)

            if (!parameterValidation) {
                return res.status(400).json({
                    error: "Parametros inválidos"
                });
            }

            const imageName = req.file ? req.file.filename : null;

            const updatedProduct = await ProductManager.update({
                ...req.body,
                id,
                image: imageName,
            })

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

    static async delete (req, res) {
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

    /* Otros métodos controladores */

    /* Métodos internos - No expuestos en routes */
    // TODO - Completar.
    static validateInsertion = (body) => true

    static validateUpdate = (body) => true

}

export default ProductController;
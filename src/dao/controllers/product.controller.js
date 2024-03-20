import mongoose from "mongoose";
import Product from "../models/product.model.js";

const productController = {
    getProducts: async (req, res) => {
        try {
            const products = await Product.find().lean();

            if (req.accepts('html')) {
                return res.render('realTimeProducts', { products });
            }
            return res.json(products);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    addProduct: async (req, res) => {
        const { title, brand, description, price, stock, category } = req.body;
        // Lógica para agregar un producto
    },

    deleteProduct: async (req, res) => {
        const productId = req.params.id;

        try {
            const deleteProduct = await Product.deleteOne({ _id: productId }).lean();

            const products = await Product.find().lean();

            if (deleteProduct.deletedCount === 0) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            return res.json({message: "Producto eliminado!", listProduct: products});
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    }
};

export default productController;

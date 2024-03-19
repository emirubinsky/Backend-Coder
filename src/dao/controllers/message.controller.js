import mongoose from "mongoose";
import Message from "../models/message.model.js";
import Product from "../models/product.model.js";

const messageController = {
    getMessages: async (req, res) => {
        try {
            const productId = req.params.productId; // Obtener el id del producto de los parámetros de la solicitud
            const product = await Product.findById(productId).exec(); // Buscar el producto por su id
            const messages = await Message.find({ product: productId }).lean(); // Obtener los mensajes relacionados con el producto

            // Verificar si el producto existe
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            
            // Si la solicitud acepta HTML, renderizar la vista 'chat' con los mensajes
            if (req.accepts('html')) {
                return res.render('chat', { messages });
            }
            
            // Si la solicitud no acepta HTML, devolver los mensajes en formato JSON
            res.json(messages);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    addMessage: async (req, res) => {
        const { text, productId, name } = req.body;
        
        try {
            const newMessage = new Message({
                text,
                product: productId,
                name
            });

            await newMessage.save();
            return res.json('Mensaje agregado');
        } catch (err) {
            console.error('Error al guardar el mensaje:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },

    updateMessage: async (req, res) => {
        const messageId = req.params.id;
        const { text } = req.body;
        
        try {
            const updatedMessage = await Message.findByIdAndUpdate(
                messageId,
                { text },
                { new: true }
            );

            if (!updatedMessage) {
                return res.status(404).json({ error: 'Mensaje no encontrado' });
            }
            
            return res.json('Mensaje actualizado');
        } catch (err) {
            console.error('Error en la actualización del mensaje:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },

    deleteMessage: async (req, res) => {
        const messageId = req.params.id;

        try {
            const deleteMessage = await Message.deleteOne({ _id: messageId });

            if (deleteMessage.deletedCount === 0) {
                return res.status(404).json({ error: 'Mensaje no encontrado' });
            }
            
            return res.json('Mensaje eliminado');
        } catch (err) {
            console.error('Error al eliminar el mensaje:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },

    respondMessage: async (req, res) => {
        const messageId = req.params.id;
        const { text, name } = req.body;

        try {
            const message = await Message.findById(messageId).exec();

            if (!message) {
                return res.status(404).json({ error: 'Mensaje no encontrado' });
            }

            const product = await Product.findById(message.product).exec();

            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            message.responses.push({
                text,
                name,
                productId: product._id,
                date: new Date()
            });

            await message.save();
            return res.json('Respuesta agregada al mensaje');
        } catch (err) {
            console.error('Error al responder al mensaje:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    }
};

export default messageController;
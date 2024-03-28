import Product from "../models/product.model.js";
import Message from "../models/message.model.js";

const messageController = {
  getMessages: async (req, res) => {
    try {
      const productId = req.params.productId; // Obtener el id del producto de los parámetros de la solicitud
      const product = await Product.findById(productId).exec(); // Buscar el producto por su id
      const messages = await Message.find({ product: productId }).lean(); // Obtener los mensajes relacionados con el producto

      // Verificar si el producto existe
      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      // Si la solicitud acepta HTML, renderizar la vista 'chat' con los mensajes
      if (req.accepts("html")) {
        return res.render("chat", { messages });
      }

      // Si la solicitud no acepta HTML, devolver los mensajes en formato JSON
      res.json(messages);
    } catch (err) {
      console.error("Error:", err);
      return res
        .status(500)
        .json({ error: "Error en la base de datos", details: err.message });
    }
  },

  addMessage: async (req, res) => {
    const { user, text } = req.body;

    try {
      const newMessage = new Message({
        user,
        text,
      });

      await newMessage.save();

      return res.json("Mensaje agregado");
    } catch (err) {
      console.error("Error al guardar el mensaje:", err);
      return res
        .status(500)
        .json({ error: "Error en la base de datos", details: err.message });
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
        return res.status(404).json({ error: "Mensaje no encontrado" });
      }

      return res.json({
        message: "Mensaje agregado",
      });
    } catch (err) {
      console.error("Error al guardar el mensaje:", err);
      return res
        .status(500)
        .json({ error: "Error en la base de datos", details: err.message });
    }
  },
};

export default messageController;

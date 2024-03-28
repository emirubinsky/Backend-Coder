import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

const cartController = {
  getCarts: async (req, res) => {
    try {
      const cart = await Cart.find()
        .populate({
          path: "product",
          model: "Product",
        })
        .lean();

      if (req.accepts("html")) {
        res.render("carts", { cart: cart });
      }

      return res.json(cart);
    } catch (err) {
      console.error("Error:", err);
      return res
        .status(500)
        .json({ error: "Error en la base de datos", details: err.message });
    }
  },

  getCartById: async (req, res) => {
    const cartId = req.params.id;

    try {
      const cart = await Cart.findById(cartId)
        .populate({
          path: "product",
          model: "Product",
        })
        .lean();

      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      if (req.accepts("html")) {
        return res.render("cart", { cart: cart });
      }

      return res.json(cart);
    } catch (error) {
      console.error("Error al obtener el carrito por ID:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  addProductToCart: async (req, res) => {
    const { productId } = req.body;
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      if (product.stock < 1) {
        return res.status(400).json({ error: "Producto fuera de stock" });
      }
      const cartItem = new Cart({
        product: productId,
        quantity: 1,
        total: product.price,
      });

      await cartItem.save();

      product.stock -= 1;
      await product.save();
      return res.json({
        message: "Producto agregado al carrito correctamente",
        cartItem,
      });
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ error: "Error en la base de datos", details: error.message });
    }
  },




};

export default cartController;

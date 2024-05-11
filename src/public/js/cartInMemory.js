// cart.js

const Cart = {
    // Initialize cart for a specific user from local storage
    initCartForUser(token) {
      const cartKey = `cart_${token}`;
      let cart = localStorage.getItem(cartKey);
      if (!cart) {
        cart = [];
        this.saveCartForUser(token, cart);
      } else {
        cart = JSON.parse(cart);
      }
      return cart;
    },
  
    // Save cart to local storage for a specific user
    saveCartForUser(token, cart) {
      const cartKey = `cart_${token}`;
      localStorage.setItem(cartKey, JSON.stringify(cart));
    },
  
    // Add item to cart for a specific user
    addItemForUser(token, product) {
      let cart = this.initCartForUser(token);
      const existingItem = cart.find(item => item.productId === product._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ productId: product._id, name: product.name, quantity: 1 });
      }
      this.saveCartForUser(token, cart);
    },
  
    // Remove item from cart for a specific user
    removeItemForUser(token, productId) {
      let cart = this.initCartForUser(token);
      cart = cart.filter(item => item.productId !== productId);
      this.saveCartForUser(token, cart);
    },
  
    // Update item quantity in cart for a specific user
    updateItemQuantityForUser(token, productId, newQuantity) {
      let cart = this.initCartForUser(token);
      const itemToUpdate = cart.find(item => item.productId === productId);
      if (itemToUpdate) {
        itemToUpdate.quantity = newQuantity;
        this.saveCartForUser(token, cart);
      }
    },
  
    // Get cart items for a specific user
    getCartItemsForUser(token) {
      return this.initCartForUser(token);
    },
  
    // Clear cart for a specific user
    clearCartForUser(token) {
      const cartKey = `cart_${token}`;
      localStorage.removeItem(cartKey);
    }
};
  
export default Cart;
  
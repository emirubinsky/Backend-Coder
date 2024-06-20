import CartProductDTO from './cart.product.dto.js';

class CartDTO {
    constructor({
        id,
        products,
        user
    }) {
        this.products = products.map(p => new CartProductDTO(p.product, p.quantity, p.price));
        this.user = user;
        
        if (id !== -1) {
            this.id = id
        }
    }
}

export default CartDTO;

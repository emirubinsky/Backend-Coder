export default class CartProductDTO {
    constructor(product, quantity, price) {
        this.product = product;
        this.quantity = quantity;
        this.price = price; // Optional
    }
}
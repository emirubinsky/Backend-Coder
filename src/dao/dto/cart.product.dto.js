export default class CartProductDTO {
    constructor(product, quantity, price, replace = false) {
        this.product = product;
        this.quantity = quantity;
        this.price = price; // Optional
        this.replace = replace
    }
}
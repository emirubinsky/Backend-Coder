// import CartProductDTO from './cart.product.dto.js';

export default class TicketDTO {

    constructor({
        id,
        // code,
        // purchase_datetime,
        // amount,
        purchaser,
        purchaserEmail,

        cart,

        user,
    }) {

        //this.code = code
        //this.purchase_datetime = purchase_datetime
        //this.amount = amount
        this.purchaser = purchaser
        this.purchaserEmail = purchaserEmail

        this.cart = cart

        this.user = user

        if (id !== -1) {
            this.id = id
        }
    }

}
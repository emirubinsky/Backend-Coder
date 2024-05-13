import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const MONGO_COLLECTIONS_NAME_USER = 'User' 
const MONGO_COLLECTIONS_NAME_PRODUCT = 'Product'
const MONGO_COLLECTIONS_NAME_CART = 'Cart'

/*
import {  
    MONGO_COLLECTIONS_NAME_USER,
    MONGO_COLLECTIONS_NAME_PRODUCT,
    MONGO_COLLECTIONS_NAME_CART,
} from 'modelDictionary'
*/

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: MONGO_COLLECTIONS_NAME_PRODUCT
        },
        quantity: {
            type: Number,
            require: true
        },
        // Props no especificadas en la clase.
        // Pero puede tener sentido para reflejar el precio total del momento
        price: {
            type: Number,
            require: false
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

cartSchema.plugin(mongoosePaginate);
const Cart = mongoose.model(MONGO_COLLECTIONS_NAME_CART, cartSchema);

export default Cart;
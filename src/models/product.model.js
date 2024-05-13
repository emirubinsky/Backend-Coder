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


const productSchema = new mongoose.Schema({
   
    title: {
        type: String,
        index: true,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    code: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    brand: {
        type: String
    },
    price: {
        type: Number,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    status: {
        type: Boolean,
        require: true,
        default: true
    },
    
    // Imagen principal
    image: String,

    // Array de imagenes, pedido en Clase 8
    // Campo NO obligatorio.
    thumbnails: {
        type: [String],
        require: true
    },

    /*
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MONGO_COLLECTIONS_NAME_CART
    },
    */
});
productSchema.plugin(mongoosePaginate);
const Product = mongoose.model(MONGO_COLLECTIONS_NAME_PRODUCT, productSchema);
export default Product;
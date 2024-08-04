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

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        index: true
    },
    last_name: String,
    email: {
        type: String,
        index: true
    },
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MONGO_COLLECTIONS_NAME_CART
    },
    role: { type: String, default: "user" }, // TODO: Evitar hard-code
    resetToken: String,
    resetTokenExpires: Date,
    profile: String,
    documents: [
        {
            name: { type: String, required: true },
            reference: { type: String, required: true }
        }
    ],
    last_connection: Date,
});

userSchema.plugin(mongoosePaginate);
const User = mongoose.model(MONGO_COLLECTIONS_NAME_USER, userSchema);

export default User;
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
//import deepPopulate from 'mongoose-deep-populate';
import { v4 as uuidv4 } from 'uuid';


const MONGO_COLLECTIONS_NAME_USER = 'User'
const MONGO_COLLECTIONS_NAME_PRODUCT = 'Product'
const MONGO_COLLECTIONS_NAME_CART = 'Cart'
const MONGO_COLLECTIONS_NAME_TICKET = 'Ticket'

/*
import {  
    MONGO_COLLECTIONS_NAME_USER,
    MONGO_COLLECTIONS_NAME_PRODUCT,
    MONGO_COLLECTIONS_NAME_CART,
    MONGO_COLLECTIONS_NAME_TICKET
} from 'modelDictionary'
*/

const ticketSchema = new mongoose.Schema({
    //_id (autogenerador por Mongo)
    code: {
        type: String,
        index: true,
        unique: true // Ensure uniqueness of the generated labels
    },

    purchase_datetime: {
        type: Date,
        require: true
    },
    amount: {
        type: Number,
        require: true
    }, // Monto total de la compra
    purchaser: {
        type: String,
        require: true
    }, // Correo del usuario asociado al carrito
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MONGO_COLLECTIONS_NAME_CART
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Define a pre-save hook to generate the <code> before saving
ticketSchema.pre('save', function (next) {
    // Generate a random <code> using UUID
    if (!this.code) {
        this.code = uuidv4(); // Generate a random UUID
    }
    next();
});

// Apply paginate to paginate properly
ticketSchema.plugin(mongoosePaginate);

// Apply deepPopulate plugin to the ticketSchema
// ticketSchema.plugin(deepPopulate);

const Ticket = mongoose.model(MONGO_COLLECTIONS_NAME_TICKET, ticketSchema);

export default Ticket;
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    user: String,
    message: String,
    date: {
        type: Date,
        default: Date.now,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    responses: [{
        user: String,
        message: String,
        date: {
            type: Date,
            default: Date.now,
        }
    }]
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
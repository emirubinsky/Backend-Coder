import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import Ticket from "../models/ticket.model.js";
import mongoose from "mongoose";

const model = Ticket


// TODO - Considerar usar el middleware de "pre" para alterar las salidas de ciertas operaciones.
// Clase: 16
// Peligro, hay que definirlo en el modelo, y es GLOBAL a todas las operaciones.
export async function getOne(id, populate = false) {

    const result = populate ?
        await model
            .findOne({ _id: id })
            .populate('cart')
            .lean()
            .then(async (ticket) => {
                if (ticket.cart && ticket.cart.products) {
                    // Extract product IDs from the cart
                    const productIds = ticket.cart.products.map(item => item.product);
        
                    // Retrieve all products using the Product model
                    const populatedProducts = await Product.find({ _id: { $in: productIds } });
        
                    // Map populated products back to the cart items
                    ticket.cart.products.forEach(item => {
                        const matchingProduct = populatedProducts.find(p => p._id.toString() === item.product.toString());
                        if (matchingProduct) {
                            item.product = matchingProduct; // Replace product ID with populated product
                        }
                    });
                }
                return ticket;
            })
             :
        await model
            .findOne({ _id: id })
            .lean()


    return result
}

export async function getAll({
    query = {},
    options = {
        page: 1,
        limit: 10
    }
}) {
    const entities = await model.paginate(query, options);

    // Extract all product IDs from the paginated entities
    const productIds = entities.docs.reduce((ids, entity) => {
        if (entity.cart && entity.cart.products) {
            entity.cart.products.forEach(item => {
                ids.push(item.product);
            });
        }
        return ids;
    }, []);

    // Retrieve all products using the Product model
    const populatedProducts = await Product.find({ _id: { $in: productIds } });

    // Map populated products back to each entity's cart
    entities.docs.forEach(entity => {
        if (entity.cart && entity.cart.products) {
            entity.cart.products.forEach(item => {
                const matchingProduct = populatedProducts.find(p => p._id.toString() === item.product.toString());
                if (matchingProduct) {
                    item.product = matchingProduct; // Replace product ID with populated product
                }
            });
        }
    });

    return entities
}

export async function insert({
    code,
    purchase_datetime,
    amount,
    purchaser,
    cart,
    user }) {

    const newEntity = new Ticket({
        code,
        purchase_datetime,
        amount,
        purchaser,
        cart,
        user
    });

    const newInsertedDoc = await newEntity.save()
    return newInsertedDoc;

}

export async function update(entityToUpdate) {

    const filter = {
        _id: entityToUpdate.id
    }
    console.log({ filter, entityToUpdate })

    const updatedDoc = await model.findOneAndUpdate(filter, entityToUpdate, {
        returnOriginal: false
    })

    return updatedDoc;
}

export async function deleteOne(id) {
    const deletedEntity = await model.deleteOne({ _id: id }).lean();

    return deletedEntity
}
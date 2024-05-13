import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const model = Cart


// TODO - Considerar usar el middleware de "pre" para alterar las salidas de ciertas operaciones.
// Clase: 16
// Peligro, hay que definirlo en el modelo, y es GLOBAL a todas las operaciones.
export async function getOne(id, populate = false) {

    const result = populate ?
        await model
        .findOne({ _id: id })
        .populate('products.product')
        .lean() :
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
    return entities;
}

export async function insert({ products, user }) {

    const newEntity = new Cart({
        products,
        user
    });

    const newInsertedDoc = await newEntity.save()
    return newInsertedDoc;

}

export async function update(entityToUpdate) {

    const filter = {
        _id: entityToUpdate.id
    }
    console.log({filter, entityToUpdate})
    
    const updatedDoc = await model.findOneAndUpdate(filter, entityToUpdate, {
        returnOriginal: false
    })

    return updatedDoc;
}

export async function deleteOne(id) {
    const deletedEntity = await model.deleteOne({ _id: id }).lean();

    return deletedEntity
}
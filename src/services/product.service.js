import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const model = Product

export async function getOne(id) {
  const product = await model.findOne({ _id: id }).lean();

  return product
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

export async function insert({ title, brand, description, code, price, stock, status, category, image }) {

    const newEntity = new Product({
        title,
        brand,
        description,
        code,
        price,
        stock,
        status,
        category,
        image,
      });

  const newInsertedDoc = await newEntity.save()
  return newInsertedDoc;

}

export async function update(entityToUpdate) {

  const filter = {
    _id: entityToUpdate.id
  }

  const updatedDoc = await model.findOneAndUpdate(filter, entityToUpdate, {
    returnOriginal: false
  })

  return updatedDoc;
}

export async function deleteOne(id) {
  const deletedEntity = await model.deleteOne({ _id: id }).lean();

  return deletedEntity
}
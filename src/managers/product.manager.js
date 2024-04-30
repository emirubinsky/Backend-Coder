import * as service from '../services/product.service.js'
import Product from "../models/product.model.js";

class ProductManager {
  static async getOne(id) {
    // Perform business logic operations
    // Nothing...

    // Call service layer for database interactions
    const result = await service.getOne(id);

    return result;

  }

  static async getAll({ host, protocol, baseUrl, query, options }) {

    const serviceOutput = await service.getAll({ query, options });

    const products = serviceOutput.docs.map(product => product.toObject());

    let prevLink = null;
    if (serviceOutput.hasPrevPage) {
      prevLink = `${protocol}://${host}${baseUrl}?page=${serviceOutput.prevPage}`;
    }

    // Determinar el link para la página siguiente
    let nextLink = null;
    if (serviceOutput.hasNextPage) {
      nextLink = `${protocol}://${host}${baseUrl}?page=${serviceOutput.nextPage}`;
    }

    return {
      products,
      pagination: {
        totalDocs: serviceOutput.totalDocs,
        limit: serviceOutput.limit,
        totalPages: serviceOutput.totalPages,
        page: serviceOutput.page,
        pagingCounter: serviceOutput.pagingCounter,
        hasPrevPage: serviceOutput.hasPrevPage,
        hasNextPage: serviceOutput.hasNextPage,
        prevPage: serviceOutput.prevPage,
        nextPage: serviceOutput.nextPage,
        prevLink,
        nextLink
      }
    }

  }

  static async add(newProductDetail) {

    const serviceOutput = await service.insert(newProductDetail);

    return serviceOutput
  }

  /**
   * El productToUpdate va a tener
   * - OBLIGATORIAMENTE el ID.
   * - Y un puñado de props para actualizar (opcional)
   */
  static async update(productToUpdate) {

    if (productToUpdate.image === null) {
      delete productToUpdate.image
    }
    console.log({ productToUpdate })
    const serviceOutput = await service.update(productToUpdate);

    return serviceOutput

  }

  static async delete(id) {
    return await service.deleteOne(id);
  }
}

export default ProductManager;
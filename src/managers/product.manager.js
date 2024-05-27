import { productService } from "../repositories/index.js";

class ProductManager {
  static async getOne(id) {
    // Perform business logic operations
    // Nothing...

    // Call service layer for database interactions
    const result = await productService.getOne(id);

    return result;

  }

  static async getAll(productQueryDTO) {

    const serviceOutput = await productService.getAll(productQueryDTO);

    return serviceOutput

  }

  static async add(productDTO) {
    const serviceOutput = await productService.insert(productDTO);

    return serviceOutput
  }

  /**
   * El productToUpdate va a tenerjajaj
   * - OBLIGATORIAMENTE el ID.
   * - Y un puñado de props para actualizar (opcional)
   */
  static async update(productDTO) {

    if (productDTO.image === null) {
      delete productDTO.image
    }

    const serviceOutput = await productService.update(productDTO);

    return serviceOutput

  }

  static async delete(id) {
    return await productService.deleteOne(id);
  }
}

export default ProductManager;
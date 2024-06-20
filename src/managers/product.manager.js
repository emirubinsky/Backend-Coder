import { productService, userService } from "../repositories/index.js";

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
  static async update(productDTO, userId, userRole) {

    if (productDTO.image === null) {
      delete productDTO.image
    }

    const productId = productDTO.id
    const product = await productService.getProductDetail(productId);

    try {
      const product = await productService.getOne(productId);
      const user = await userService.getOne(userId);

      /* Revisión de ownership */
      if (userRole === 'admin' || (userRole === 'premium' && user && user._id.toString() == product.owner._id.toString())) {
        return await productService.update(productDTO);

        // return res.json({ message: "Producto actualizado!", product: updatedProduct });
      } else {
        throw new Error('No tienes permiso para realizar esta acción');
      }
    } catch (err) {
      console.error('Error:', err);
      throw err
    }
  }

  static async delete(id, userId, userRole) {

    try {
      const productId = id
      const product = await productService.getOne(productId);
      const user = await userService.getOne(userId);

      /* Revisión de ownership */
      if (userRole === 'admin' || (userRole === 'premium' && user && user._id.toString() == product.owner._id.toString())) {

        return await productService.deleteOne(id);

        // return res.json({ message: "Producto actualizado!", product: updatedProduct });
      } else {
        throw new Error('No tienes permiso para realizar esta acción');
      }
    } catch (err) {
      console.error('Error:', err);
      throw err
    }

  }
}

export default ProductManager;
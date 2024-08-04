import { productService, userService } from "../repositories/index.js";
import messenger from "../appHelpers/messenger.js";

import {
  MAIL_USERNAME,
} from "../util.js";

import { customLogger } from '../appHelpers/logger.helper.js';

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

    try {
      // Ownership
      const user = await userService.getOne(productDTO.owner);

      // Si el usuario no esta logueado o registrado
      if (!user) {
        customLogger.error(`User no encontrado: ${owner}`);
        throw { code: 'USER_NOT_FOUND' };
      }

      const serviceOutput = await productService.insert(productDTO);

      return serviceOutput

    } catch (error) {
      console.log(`Error al agregar el producto - ${error.message}`);
      customLogger.error(`Error al agregar el producto - ${error.message}`);
      throw { code: 'PRODUCT_CREATION_FAILED', message: error.message };
    }
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
      const isAdmin = userRole === 'admin'
      const isPremium = userRole === 'premium'
      const isTheOwner = user._id.toString() == product.owner._id.toString()

      const isAllowedToUpdate = isAdmin || (isPremium && isTheOwner)

      /* Revisión de ownership */
      if (isAllowedToUpdate) {
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
      const isAdmin = userRole === 'admin'
      const isPremium = userRole === 'premium'
      const isTheOwner = user._id.toString() == product.owner._id.toString()

      const isAllowedToDelete = isAdmin || (isPremium && isTheOwner)

      if (isAllowedToDelete) {
        const deleteProduct = await productService.deleteOne(id);

        // Revisamos si el producto era de un Premium para avisarle.
        const productOwner = await userService.getOne(product.owner._id);
        if (productOwner.role === 'premium') {
          const mailOptions = {
            to: user.email,
            from: MAIL_USERNAME,
            subject: 'Eliminación de producto',
            text: `Está recibiendo este mensaje porque se ha eliminado su producto ${product.title}.`
          };

          customLogger.info("USER MANAGER > EMAIL > ", { mailOptions })
          const emailSent = await messenger.transport.sendMail(mailOptions)

          return emailSent
        }

        return {
          deleteProduct,
          emailSent
        }
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
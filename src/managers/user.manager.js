import { userService } from "../repositories/index.js";
import UserDTO from "../../src/dao/dto/user.dto.js"

class UserManager {
  static async getOne(id) {
    // Perform business logic operations
    // Nothing...

    // Call service layer for database interactions
    const result = await userService.getOne(id);

    return result;

  }

  static async getAll(userQueryDTO) {

    const serviceOutput = await userService.getAll(userQueryDTO);

    return serviceOutput

  }

  static async add(userDTO) {
    const serviceOutput = await userService.insert(userDTO);

    return serviceOutput
  }

  /**
   * El userToUpdate va a tenerjajaj
   * - OBLIGATORIAMENTE el ID.
   * - Y un puñado de props para actualizar (opcional)
   */
  static async update(userDTO) {

    if (userDTO.image === null) {
      delete userDTO.image
    }

    const serviceOutput = await userService.update(userDTO);

    return serviceOutput

  }

  static async delete(id) {
    return await userService.deleteOne(id);
  }


  static async changeToUserRole(userId) {
    const currentUser = await UserManager.getOne(userId)

    if (!user) {
      throw new Error("El usuario no existe");
    }

    if (user.role === "premium") {
      user.role = "user"
    } else {
      logger.warn("Acceso no autorizado");
      throw new Error("No se puede cambiar a otro rol si no es PREMIUM")
    }

    const userDTO = new UserDTO({ ...currentUser, role: user.role })

    const updatedUser = await UserManager.update(userDTO);

    return updatedUser
  }

  static async changeToPremiumRole(userId, files) {
    try {
      const user = await UserManager.getOne(userId);
      if (!user) {
        throw new Error("El usuario no existe");
      }

      if (user.role === "premium") {
        throw new Error("El usuario ya esta en premium ");
      }

      // TODO: Podríamos soportar otro role.

      if (user.role === "user") {
        // Verificar si todos los archivos requeridos están presentes
        if (!files || !files.identificacion || !files.comprobanteDomicilio || !files.comprobanteCuenta) {
          throw new Error("Se requiere la subida de documentación completa para cambiar el rol a premium");
        }

        // Procesar cada archivo de forma individual
        await UserManager.uploadDocs(userId, files.identificacion);
        await UserManager.uploadDocs(userId, files.comprobanteDomicilio);
        await UserManager.uploadDocs(userId, files.comprobanteCuenta);

        // Procesamos el cambio de role
        user.role = "premium"
        const userDTO = new UserDTO({ ...currentUser, role: user.role })

        const updatedUser = await UserManager.update(userDTO);

        return updatedUser
      }

      // Guardar los cambios en la base de datos
      await user.save();
      return user;
    } catch (error) {
      throw new Error("Error al cambiar el rol del usuario: " + error.message);
    }
  }

  static async uploadDocs(userId, documents) {
    try {
      const user = await userService.getOne(userId)
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      documents.forEach(doc => {
        user.documents.push({
          name: doc.originalname,
          reference: doc.path
        });
      });

      const userDTO = new UserDTO({ ...currentUser, documents })

      return await UserManager.update(userDTO);

    } catch (error) {
      throw new Error("Error al subir documentos: " + error.message);
    }
  }

}

export default UserManager;
import { userService } from "../repositories/index.js";
import UserDTO from "../../src/dao/dto/user.dto.js"

import messenger from "../appHelpers/messenger.js";

import {
  MAIL_USERNAME,
} from "../util.js";

import { customLogger } from '../appHelpers/logger.helper.js';

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

    if (userDTO.documents === null) {
      delete userDTO.documents
    }

    const serviceOutput = await userService.update(userDTO);

    return serviceOutput

  }

  static async delete(id) {
    return await userService.deleteOne(id);
  }


  static async changeToUserRole(userId) {
    const currentUser = await UserManager.getOne(userId)

    if (!currentUser) {
      throw new Error("El usuario no existe");
    }

    if (currentUser.role !== "premium") {
      customLogger.warning("Acceso no autorizado");
      throw new Error("No se puede cambiar a otro rol si no es PREMIUM")
    }

    const userDTO = new UserDTO({ ...currentUser, role: "user", id: userId })
    customLogger.info("changeToUserRole >>>", userDTO);

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
        const userDTO = new UserDTO({ ...user, role: "premium", id: userId })

        customLogger.info("changeToPremiumRole >>>", userDTO);

        const updatedUser = await UserManager.update(userDTO);

        return updatedUser
      }
      return user;
    } catch (error) {
      throw new Error("Error al cambiar el rol del usuario: " + error.message);
    }
  }

  static async swapUserRole(userId) {
    try {
      const user = await UserManager.getOne(userId);

      customLogger.info(`Cambiando rol de usuario ${userId}, con rol ${user.role}`);

      if (!user) {
        throw new Error("El usuario no existe");
      }

      let newRole = null
      if (user.role === "premium") {
        newRole = "user";
      } else if (user.role === "user") {
        newRole = "premium";
      } else if (user.role === "admin") {
        customLogger.warning("No se puede cambiar el rol de admin")
      } else {
        customLogger.warning("Acceso no autorizado");
      }

      if (newRole === null) {
        throw new Error("Error al cambiar el rol del usuario > accion no permitida")
      }

      // Procesamos el cambio de role
      const userDTO = new UserDTO({ ...user, role: newRole, id: userId })
      const updatedUser = await UserManager.update(userDTO);

      customLogger.info(`Cambio de rol de usuario exitoso: ${user.role}`);

      return updatedUser
    } catch (error) {
      customLogger.error(`Error al cambiar el rol del usuario: ${userId}`, error);
      throw new Error("Error interno del servidor > " + error.message);
    }
  }

  static async uploadDocs(userId, documents) {
    try {
      const user = await userService.getOne(userId)
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      if (typeof user.documents === 'undefined' || user.documents === null) {
        user.documents = []
      }

      documents.forEach(doc => {
        user.documents.push({
          name: doc.originalname,
          reference: doc.path
        });
      });

      const userDTO = new UserDTO({ ...user, documents })

      return await UserManager.update(userDTO);

    } catch (error) {
      throw new Error("Error al subir documentos: " + error.message);
    }
  }

  static async findAllInactiveUsers(minutes) {

    try {
      // Variable para eliminar los usuarios que tengan 2 dias seguidos sin conectarse
      const inactivityPeriod = minutes * 1000;

      /* Se encarga de buscar a los usuarios que cumplan con el parámetro de inactividad 
      y enviar el mensaje de usuario eliminado por inactividad */
      const inactiveUsers = await userService.findInactiveUsers(inactivityPeriod);

      return inactiveUsers

    } catch (error) {
      throw new Error("Error al ejecutar findAllInactiveUsers: " + error.message);
    }
  }

  static async deleteAllInactiveUsers() {

    try {
      // Variable para eliminar los usuarios que tengan 2 dias seguidos sin conectarse
      const inactivityPeriod = 2 * 24 * 60 * 60 * 1000;

      /* Se encarga de buscar a los usuarios que cumplan con el parámetro de inactividad 
      y enviar el mensaje de usuario eliminado por inactividad */
      const inactiveUsers = await userService.findInactiveUsers(inactivityPeriod);

      const results = inactiveUsers.map(async (inactiveUser) => {
        if (inactiveUser.role == "admin") {
          return res.status(404).json({ error: "No se puede eliminar el administrador" });
        }

        // Elimina a los usuarios inactivos
        const deleteInactiveUser = await userService.deleteInactiveUser(inactiveUser._id);

        if (!deleteInactiveUser) {
          return {
            user: inactiveUser.email,
            success: false,
            message: "No se ha podido eliminar el usuario inactivo"
          }
        }

        const mailOptions = {
          to: inactiveUser.email,
          from: MAIL_USERNAME,
          subject: 'Se le ha eliminado su cuenta por inactividad',
          text: `Está recibiendo este mensaje porque usted no se ha conectado en 2 dias seguidos y su cuenta ha sido eliminada por inactividad.`
        };

        await messenger.transport.sendMail(mailOptions)

        return {
          user: inactiveUser.email,
          success: true,
          message: 'Correo de aviso de eliminación de usuario enviado con éxito'
        }
      })

      return {
        message: 'Proceso de limpieza terminado',
        results
      };

    } catch (error) {
      console.error("Error en el proceso de limpieza", error);
      throw new Error("Error al ejecutar deleteAllInactiveUsers: " + error.message);
    }

  }

}

export default UserManager;
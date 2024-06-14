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

}

export default UserManager;
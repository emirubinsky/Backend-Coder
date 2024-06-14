// TODO: Configurar esto
//import { entorno } from "../config/config.js";
import mongoose from "mongoose";
import { MONGO_URL } from "../util.js";

import { customLogger } from '../appHelpers/logger.helper.js';
customLogger.info("DAO Factory > LISTO");

export let Users;
export let Products;
export let Carts;
export let Tickets;

const entorno = {
  persistence: "MONGO"
}

switch (entorno.persistence) {
  case "MONGO":
    mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const db = mongoose.connection;

    db.on("error", (err) => {
      customLogger.info("DAO Factory > Error de conexión a MongoDB:", err);
    });

    db.once("open", () => {
      customLogger.info("DAO Factory > Conexión a MongoDB exitosa");
    });

    const { default: UsersMongo } = await import("./mongo/services/user.service.js");
    const { default: ProductsMongo } = await import("./mongo/services/product.service.js");
    const { default: CartsMongo } = await import("./mongo/services/cart.service.js");
    const { default: TicketsMongo } = await import("./mongo/services/ticket.service.js");

    Users = UsersMongo
    Products = ProductsMongo
    Carts = CartsMongo
    Tickets = TicketsMongo

    customLogger.info("DAO Factory > FINALIZACION");
    break;
  case "MEMORY":
    const { default: UsersMemory } = await import("./memory/services/user.service.js.js");
    const { default: ProductsMemory } = await import("./memory/services/product.service.js.js");
    const { default: CartsMemory } = await import("./memory/services/cart.service.js.js");
    const { default: TicketsMemory } = await import("./memory/services/ticket.service.js.js");

    Users = UsersMemory
    Products = ProductsMemory
    Carts = CartsMemory
    Tickets = TicketsMemory
    break;
  case "MYSQL":
    break;
  case "FS":
    break;
  default:
    customLogger.info("FACTORY DAO > DEFAULT")
    break;
}

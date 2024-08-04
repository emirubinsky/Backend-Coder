import { customLogger } from '../appHelpers/logger.helper.js';

import {
    Users,
    Products,
    Carts,
    Tickets
} from '../dao/factory.js'

customLogger.info("Repository > LISTO");

import UserRepository from './user.repository.js'
customLogger.info("UserRepository > LISTO");

import ProductRepository from './product.repository.js'
customLogger.info("ProductRepository > LISTO");

import CartRepository from './cart.repository.js'
customLogger.info("CartRepository > LISTO");

import TicketRepository from './ticket.repository.js'
customLogger.info("TicketRepository > LISTO");


export const productService = new ProductRepository(new Products())
export const cartService = new CartRepository(new Carts())
export const ticketService = new TicketRepository(new Tickets())
export const userService = new UserRepository(new Users())

customLogger.info("Todos los servicios > LISTO");

// INFO. En la clase lo pusieron como "_____Service"
//export const contactService = new ContactRepository(new Contacts())
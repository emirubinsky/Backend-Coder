import {
    //Users,
    Products,
    Carts,
    Tickets,
} from '../dao/factory.js'

//import UserRepository from './user.repository.js'
import ProductRepository from './product.repository.js'
import CartRepository from './cart.repository.js'
import TicketRepository from './ticket.repository.js'

export const productService = new ProductRepository(new Products())
export const cartService = new CartRepository(new Carts())
export const ticketService = new TicketRepository(new Tickets())

// INFO. En la clase lo pusieron como "_____Service"
//export const contactService = new ContactRepository(new Contacts())
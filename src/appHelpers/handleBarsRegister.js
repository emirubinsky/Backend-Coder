
import Handlebars from "handlebars";
import moment from 'moment'

import { customLogger } from '../appHelpers/logger.helper.js';
customLogger.info("HandleBarsRegister > LISTO")

class HandleBarsRegister {

  static registerHelpers() {
    customLogger.info("HandleBarsRegister > REGISTRANDO")
    // Por ahora tenemos un solo Register asique lo dejamos aqui.
    // Si crecen entonces sería mejor derivar a muchos metodos.

    Handlebars.registerHelper('ifRole', function (role, ...args) {
      const options = args.pop();
      const roles = args;
      return roles.includes(role) ? options.fn(this) : options.inverse(this);
    });

    /* Esto es usado como una "directiva" especial
    * Ejemplo en donde se usa: realTimeProducts.handlebars
    */
    Handlebars.registerHelper('eq', function (a, b, options) {
      customLogger.debug("#eq", {
        a, b, options
      })
      console.log("#eq", {
        a, b, options
      })
      return a === b ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper("multiply", function (thing1, thing2) {
      return thing1 * thing2;
    });

    // Helpers for /tickets

    Handlebars.registerHelper('formatDate', function (dateToTransform) {
      customLogger.info("formatDate", dateToTransform)
      return moment(dateToTransform).format();
    });

    Handlebars.registerHelper('pricePerItem', function (price, quantity) {
      customLogger.info("pricePerItem", price, quantity)
      return (price * quantity).toFixed(2);
    });

    // Helper function to calculate total amount for a ticket's cart items
    Handlebars.registerHelper('calculateTotal', function (products) {


      let total = 0;

      products.forEach(productItem => {
        console.log("products.forEach(productItem", productItem)
        total += (productItem.product.price * productItem.quantity);
      });

      return total.toFixed(2);
    });

    // Helper function to calculate grand total amount for all tickets
    Handlebars.registerHelper('calculateGrandTotal', function (tickets) {
      customLogger.info("calculateGrandTotal", tickets)
      let grandTotal = 0;
      tickets.forEach(ticket => {
        ticket.products.forEach(product => {
          grandTotal += (product.price * product.quantity);
        });
      });
      return grandTotal.toFixed(2);
    });

    /*
    Handlebars.registerHelper('eq', function (v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    });
    */
  }

}

export default HandleBarsRegister
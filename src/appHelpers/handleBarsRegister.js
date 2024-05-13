
import Handlebars from "handlebars";
import moment from 'moment'

class HandleBarsRegister {

  static registerHelpers() {

    // Por ahora tenemos un solo Register asique lo dejamos aqui.
    // Si crecen entonces sería mejor derivar a muchos metodos.

    /* Esto es usado como una "directiva" especial
    * Ejemplo en donde se usa: realTimeProducts.handlebars
    */
    Handlebars.registerHelper('eq', function (a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper("multiply", function (thing1, thing2) {
      return thing1 * thing2;
    });

    // Helpers for /tickets

    Handlebars.registerHelper('formatDate', function (dateToTransform) {
      console.log("formatDate", dateToTransform)
      return moment(dateToTransform).format();
    });

    Handlebars.registerHelper('pricePerItem', function (price, quantity) {
      console.log("pricePerItem", price, quantity)
      return (price * quantity).toFixed(2);
    });

    // Helper function to calculate total amount for a ticket's cart items
    Handlebars.registerHelper('calculateTotal', function (products) {

      console.log("calculateTotal", products)

      let total = 0;
      products.forEach(product => {
        total += (product.price * product.quantity);
      });
      return total.toFixed(2);
    });

    // Helper function to calculate grand total amount for all tickets
    Handlebars.registerHelper('calculateGrandTotal', function (tickets) {
      console.log("calculateGrandTotal", tickets)
      let grandTotal = 0;
      tickets.forEach(ticket => {
        ticket.cart.products.forEach(product => {
          grandTotal += (product.price * product.quantity);
        });
      });
      return grandTotal.toFixed(2);
    });
  }

}

export default HandleBarsRegister
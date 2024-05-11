
import Handlebars from "handlebars";

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
  }

}

export default HandleBarsRegister
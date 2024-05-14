import { Router } from "express";
import { auth } from "../middlewares/auth.js";

import ProductManager from '../managers/product.manager.js'
import CartManager from '../managers/cart.manager.js'
import TicketManager from '../managers/ticket.manager.js'

const router = Router();

router.get("/register", (req, res) => {
  res.render("users_register");
});

router.get("/login", (req, res) => {
  res.render("users_login");
});

router.get("/profile", auth, (req, res) => {
  res.render("users_profile", {
    user: req.session.user,
  });
});

router.get("/", auth, (req, res) => {
  res.render("home", {
    user: req.session.user,
  });
});
router.get("/home", auth, (req, res) => {
  res.render("home", {
    user: req.session.user,
  });
});
//restaurar password
router.get("/restore", (req, res) => {
  res.render("users_restore");
});

/**
 * Rutas generales
 */

// Login

// Logout

// Perfil

// Registrar usuario

// Recuperar contraseña???

/***
 * Rutas de Productos
 */

// Obtener todos los productos para administrar
router.get("/products/list", auth, async (req, res) => {

  // TODO: esto debería estar en un viewController.js
  try {

    // Procesamos request-response
    // Obtención de parametros desde el body.
    const { category, brand, sort } = req.query;

    const {
      limit = 5,
      page = 1,
    } = req.query != null ? req.query : {};

    // Obtención de parametros desde el queryString

    // Formacion del objeto query para perfeccionar la query.
    const query = {};

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    const options = {
      limit,
      page,
      sort: { price: sort === 'asc' ? 1 : -1 }
    };
    console.log(options)

    // Llamamos a los managers > services para obtener datos
    // Llamada a la capa de negocio
    console.log({
      host: req.get('host'),
      protocol: req.protocol,
      baseUrl: req.baseUrl || "/products/list"
    })
    const managerOutput = await ProductManager.getAll({
      host: req.get('host'),
      protocol: req.protocol,
      baseUrl: req.baseUrl || "/products/list",
      query,
      options,
    });

    // Construir la respuesta JSON
    const response = {
      status: "SUCCESS",
      Products: managerOutput.products,
      Query: managerOutput.pagination,

    };

    console.log(response.Query)

    // Presentamos datos y los mandamos a traves del renderizado
    res.render("product_list", {
      response,
      // TODO cosas que faltan
      /**
       * user 
       * Carts
       */
    });

  } catch (error) {
    console.error(`Error loading product: ${error}`, error);
    res.status(500).json({ error: 'Error retrieving product' });
  }

});


// Obtener todos los productos para ir a comprar
router.get("/products", auth, async (req, res) => {

  // TODO: esto debería estar en un viewController.js
  try {

    // Procesamos request-response
    // Obtención de parametros desde el body.
    const { category, brand, sort } = req.query;

    const {
      limit = 5,
      page = 1,
    } = req.query != null ? req.query : {};

    // Obtención de parametros desde el queryString

    // Formacion del objeto query para perfeccionar la query.
    const query = {};

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    const options = {
      limit,
      page,
      sort: { price: sort === 'asc' ? 1 : -1 }
    };
    console.log(options)

    // Llamamos a los managers > services para obtener datos
    // Llamada a la capa de negocio
    console.log({
      host: req.get('host'),
      protocol: req.protocol,
      baseUrl: req.baseUrl || "/products"
    })
    const managerOutput = await ProductManager.getAll({
      host: req.get('host'),
      protocol: req.protocol,
      baseUrl: req.baseUrl || "/products",
      query,
      options,
    });

    // Construir la respuesta JSON
    const response = {
      status: "SUCCESS",
      Products: managerOutput.products,
      Query: managerOutput.pagination,

    };

    console.log(response.Query)

    // Presentamos datos y los mandamos a traves del renderizado
    res.render("product_shopping", {
      response,
      // TODO cosas que faltan
      /**
       * user 
       * Carts
       */
    });

  } catch (error) {
    console.error(`Error loading product: ${error}`, error);
    res.status(500).json({ error: 'Error retrieving product' });
  }

});

// Mostrar el detalle de un producto

router.get("/products/:id", auth, async (req, res) => {

  try {
    // Procesamos request-response
    // Obtención de parametros desde el body/query/url
    const id = req.params.id

    // Llamamos a los managers > services para obtener datos
    // Llamada a la capa de negocio
    const product = await ProductManager.getOne(id);

    // Construir la respuesta JSON
    const response = {
      status: "SUCCESS",
      Product: product
    };
    console.log(response)

    // Presentamos datos y los mandamos a traves del renderizado
    res.render("product_detail", {
      response,
      // TODO cosas que faltan
      /**
       * user 
       * Carts
       */
    });

  } catch (error) {
    console.error(`Error loading product: ${error}`, error);
    res.status(500).json({ error: 'Error retrieving product' });
  }

});

/**
 * Rutas administrativas => productos
 */
// TODO: por algun motivo si pongo "/products/add" me intercepta antes la ruta de arriba.
router.get("/product/add", auth, (req, res) => {
  try {

    // TODO: Solo debería estar habilitada para el ADMIN.

    // Procesamos request-response
    // Obtención de parametros desde el body.

    // Llamamos a los managers > services para obtener datos
    // Llamada a la capa de negocio

    // Construir la respuesta JSON

    // Presentamos datos y los mandamos a traves del renderizado
    res.render("product_add", { something: "foo" })

  } catch (error) {
    console.error(`Error loading product: ${error}`, error);
    res.status(500).json({ errorx: 'Error retrieving product', error });
  }
})

/**
 * Rutas de carrito
 */

// Ver Carrito

router.get("/cart/:id", auth, async (req, res) => {

  try {

    // TODO: Solo debería estar habilitada para el ADMIN.

    // Procesamos request-response
    // Obtención de parametros desde el body.

    const id = req.params.id

    if (id === -1) {
      res.render("cart", {
        useMemory: true
      })
    }

    // Llamamos a los managers > services para obtener datos
    // Llamada a la capa de negocio
    const populate = true
    const cart = await CartManager.getOne(id, populate);

    // Construir la respuesta JSON
    const response = {
      status: "SUCCESS",
      Cart: cart
    };
    console.log(response)

    // Presentamos datos y los mandamos a traves del renderizado
    res.render("cart", {
      cart
    })

  } catch (error) {
    console.error(`Error loading product: ${error}`, error);
    res.status(500).json({ errorx: 'Error retrieving product', error });
  }

})

router.get("/carts", auth, async (req, res) => {

  try {

    // TODO: Solo debería estar habilitada para el ADMIN.

    // Procesamos request-response
    // Obtención de parametros desde el body.

    // Llamamos a los managers > services para obtener datos
    // Llamada a la capa de negocio

    // const user = req.session.user;

    const {
      limit = 10,
      page = 1,
    } = req.query != null ? req.query : {};

    // Obtención de parametros desde el queryString

    // Formacion del objeto query para perfeccionar la query.
    const query = {
      user: req.session.userId
    };

    const options = {
      limit,
      page,
      populate: {
        path: 'products.product',
        select: 'title price'
      }
      // TODO: Agregar algun sorting luego
    };

    console.log("/carts > call manager", {
      host: req.get('host'),
      protocol: req.protocol,
      baseUrl: req.baseUrl,
      query,
      options
    })

    // Llamada a la capa de negocio
    const managerOutput = await CartManager.getAll({
      host: req.get('host'),
      protocol: req.protocol,
      baseUrl: req.baseUrl,
      query,
      options
    });

    // Construir la respuesta JSON
    const response = {
      status: "SUCCESS",
      Carts: managerOutput.carts,
      Query: managerOutput.pagination,
    };


    console.log("/carts > response", response)

    // Presentamos datos y los mandamos a traves del renderizado
    res.render("carts", {
      response
    })

  } catch (error) {
    console.error(`Error loading product: ${error}`, error);
    res.status(500).json({ errorx: 'Error retrieving product', error });
  }

})

/**
 * Finalizar compras
 */


/**
 * Rutas de Tickets
 */

router.get("/tickets", auth, async (req, res) => {
  try {

    // TODO: Solo debería estar habilitada para el ADMIN.

    // Procesamos request-response
    // Obtención de parametros desde el body.

    // Llamamos a los managers > services para obtener datos
    // Llamada a la capa de negocio

    // const user = req.session.user;

    const {
      limit = 10,
      page = 1,
    } = req.query != null ? req.query : {};

    // Obtención de parametros desde el queryString

    // Formacion del objeto query para perfeccionar la query.
    const query = {
      user: req.session.userId
    };

    const options = {
      limit,
      page,
      populate: {
        path: 'cart',
        select: 'products'
      }
      // TODO: Agregar algun sorting luego
    };

    console.log("/tickets > tickets manager", {
      host: req.get('host'),
      protocol: req.protocol,
      baseUrl: req.baseUrl,
      query,
      options
    })

    // Llamada a la capa de negocio
    const managerOutput = await TicketManager.getAll({
      host: req.get('host'),
      protocol: req.protocol,
      baseUrl: req.baseUrl,
      query,
      options
    });

    // Construir la respuesta JSON
    const response = {
      status: "SUCCESS",
      Tickets: managerOutput.tickets,
      Query: managerOutput.pagination,
    };


    console.log("/tickets > response", response)

    // Presentamos datos y los mandamos a traves del renderizado
    res.render("tickets", {
      response
    })

  } catch (error) {
    console.error(`Error loading product: ${error}`, error);
    res.status(500).json({ errorx: 'Error retrieving product', error });
  }
})


// ruta generica para copiar y pegar....
router.get("placeholder...", async (req, res) => {

  try {
    // Procesamos request-response
    // Obtención de parametros desde el body.

    // Llamamos a los managers > services para obtener datos
    // Llamada a la capa de negocio

    // Construir la respuesta JSON

    // Presentamos datos y los mandamos a traves del renderizado


  } catch (error) {
    console.error(`Error loading product: ${error}`, error);
    res.status(500).json({ error: 'Error retrieving product' });
  }

});

export default router;
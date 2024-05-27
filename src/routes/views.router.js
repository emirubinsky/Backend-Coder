import { Router } from "express";

import { auth, authToken, isUser, isAdmin } from "../middlewares/auth.js";
import { customLogger } from '../appHelpers/logger.helper.js';

import axios from 'axios'

const router = Router();

/*** Rutas generales ***/
// Login
router.get("/login", (req, res) => {
  res.render("users_login");
});

// Home
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

// Perfil
router.get("/profile", auth, (req, res) => {
  res.render("users_profile", {
    user: req.session.user,
  });
});

// Registrar usuario (localmente)
router.get("/register", (req, res) => {
  res.render("users_register");
});

// Recuperar contraseña??? (TODO: No terminada aún.)
router.get("/restore", (req, res) => {
  res.render("users_restore");
});

/*** PRODUCTOS ***/
// Obtener todos los productos para administrar
router.get("/products/list", auth, isAdmin, async (req, res) => {

  // TODO: esto debería estar en un viewController.js
  try {

    const apiClient = axios.create({ baseUrl: '/products/list' });
    // Make a request to the API route to get product data
    const queryParams = {
      ...req.query,
      view: true,
      adm: true
    };
    const axiosResponse = await apiClient.get('http://localhost:8080/api/products?',
      {
        // Forward the original request's cookies
        headers: {
          Cookie: req.headers.cookie
        },
        // Esto ayuda a hacer un carry over the credenciales.
        withCredentials: true,
        params: queryParams
      });
    const response = axiosResponse.data

    customLogger.info(response.Query)

    // Presentamos datos y los mandamos a traves del renderizado
    res.render("product_list", {
      response: response.response
    });

  } catch (error) {
    customLogger.error(`Error cargando /products/list: ${error}`, { ...error });
    res.status(500).json({ errorx: 'Error /products/list', errorMessage: error.message, stack: error.stack });
  }

});


// Obtener todos los productos para ir a comprar
router.get("/products", auth, isUser, async (req, res) => {

  // TODO: esto debería estar en un viewController.js
  try {
    const apiClient = axios.create({ baseUrl: '/products' });
    // Make a request to the API route to get product data
    const queryParams = {
      ...req.query,
      view: true
    };
    const axiosResponse = await apiClient.get('http://localhost:8080/api/products', {

      // Forward the original request's cookies
      headers: {
        Cookie: req.headers.cookie
      },
      // Esto ayuda a hacer un carry over the credenciales.
      withCredentials: true,

      params: queryParams
    });
    const response = axiosResponse.data

    customLogger.info("/products", response)

    // Presentamos datos y los mandamos a traves del renderizado
    res.render("product_shopping", {
      response: response.response
    });

  } catch (error) {
    customLogger.error(`Error loading /products: ${error}`, { ...error });
    res.status(500).json({ errorx: 'Error /products', errorMessage: error.message, stack: error.stack });
  }

});

// Mostrar el detalle de un producto
router.get("/products/:id", auth, async (req, res) => {

  try {
    // Procesamos request-response
    // Obtención de parametros desde el body/query/url
    const id = req.params.id
    const responseAPI = await axios.get(`http://localhost:8080/api/products/${id}`, {
      // Forward the original request's cookies
      headers: {
        Cookie: req.headers.cookie
      },
      // Esto ayuda a hacer un carry over the credenciales.
      withCredentials: true
    });

    // Construir la respuesta JSON
    const response = {
      status: "SUCCESS",
      Product: responseAPI.data.product
    };

    // Presentamos datos y los mandamos a traves del renderizado
    res.render("product_detail", {
      response
    });

  } catch (error) {
    customLogger.error(`Error loading /products/:id: ${error}`, { ...error });
    res.status(500).json({ errorx: 'Error /products/:id', errorMessage: error.message, stack: error.stack });
  }
});


router.get("/products/update/:id", auth, isAdmin, async (req, res) => {

  try {
    const id = req.params.id
    const responseAPI = await axios.get(`http://localhost:8080/api/products/${id}`, {
      // Forward the original request's cookies
      headers: {
        Cookie: req.headers.cookie
      },
      // Esto ayuda a hacer un carry over the credenciales.
      withCredentials: true
    });

    // Construir la respuesta JSON
    const response = {
      status: "SUCCESS",
      Product: responseAPI.data.product
    };

    // Presentamos datos y los mandamos a traves del renderizado
    res.render("product_update", {
      response
    });

  } catch (error) {
    customLogger.error(`Error loading /products/update/:id: ${error}`, { ...error });
    res.status(500).json({ errorx: 'Error /products/update/:id', errorMessage: error.message, stack: error.stack });
  }

});

/**
 * Rutas administrativas => productos
 */
// TODO: por algun motivo si pongo "/products/add" me intercepta antes la ruta de arriba.
router.get("/product/add", auth, isAdmin, (req, res) => {
  try {

    // TODO: Solo debería estar habilitada para el ADMIN.

    // Presentamos datos y los mandamos a traves del renderizado
    res.render("product_add", { something: "foo" })

  } catch (error) {
    customLogger.error(`Error loading /product/add: ${error}`, { ...error });
    res.status(500).json({ errorx: 'Error /product/add', errorMessage: error.message, stack: error.stack });
  }
})

/*** CARRITOS ***/
// Ver Carrito
router.get("/cart/:id", auth, isUser, async (req, res) => {

  try {
    customLogger.info("VIEWS > /cart/:id", req.params)

    const id = req.params.id
    const responseAPI = await axios.get(`http://localhost:8080/api/carts/${id}`,
      {
        // Forward the original request's cookies
        headers: {
          Cookie: req.headers.cookie
        },
        // Esto ayuda a hacer un carry over the credenciales.
        withCredentials: true
      }
    );

    // Construir la respuesta JSON
    const response = {
      status: "SUCCESS",
      Cart: responseAPI.data.cart
    };
    customLogger.info("/cart/:id", {
      response
    })
    // Presentamos datos y los mandamos a traves del renderizado
    // TODO: estandarizar
    res.render("cart", {
      response
    })

  } catch (error) {
    customLogger.error(`Error loading /cart/:id: ${error}`, { ...error });
    res.status(500).json({ errorx: 'Error /cart/:id', errorMessage: error.message, stack: error.stack });
  }
})

// Listar carritos
router.get("/carts", auth, isUser, async (req, res) => {

  try {

    const apiClient = axios.create({ baseUrl: '/carts' });

    // Make a request to the API route to get product data
    // Make a request to the API route to get product data
    const queryParams = {
      ...req.query,
      view: true
    };
    const axiosResponse = await apiClient.get('http://localhost:8080/api/carts',
      {
        // Forward the original request's cookies
        headers: {
          Cookie: req.headers.cookie
        },
        // Esto ayuda a hacer un carry over the credenciales.
        withCredentials: true,
        // Extra query params
        params: queryParams
      });
    const response = axiosResponse.data

    customLogger.info("/carts > response", response.response)

    // Presentamos datos y los mandamos a traves del renderizado
    res.render("carts", {
      response: response.response
    })

  } catch (error) {
    customLogger.error(`Error loading /carts: ${error}`, { ...error });
    res.status(500).json({ errorx: 'Error /carts', errorMessage: error.message, stack: error.stack });
  }

})

/*** TICKETS ***/
// Listar Tickets
router.get("/tickets", auth, isUser, async (req, res) => {
  try {

    const apiClient = axios.create({ baseUrl: '/tickets' });

    // Make a request to the API route to get product data
    const axiosResponse = await apiClient.get('http://localhost:8080/api/tickets',
      {
        // Forward the original request's cookies
        headers: {
          Cookie: req.headers.cookie
        },
        // Esto ayuda a hacer un carry over the credenciales.
        withCredentials: true
      });
    const response = axiosResponse.data

    customLogger.info("/tickets > response", response.response)

    // Presentamos datos y los mandamos a traves del renderizado
    res.render("tickets", {
      response: response.response
    })

  } catch (error) {
    customLogger.error(`Error loading /tickets: ${error}`, { ...error });
    res.status(500).json({ errorx: 'Error /tickets', errorMessage: error.message, stack: error.stack });
  }
})

export default router;
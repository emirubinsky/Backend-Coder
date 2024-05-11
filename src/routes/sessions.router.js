import { Router } from "express";
// import userService from "../models/Users.model.js";      // IMPORTANTE: El profe en clase22 no aloja controllers, managers y models adentro de DAO, lo deja afuera
// Nosotros tenemos que usarlo así
import User from "../models/user.model.js";

import { createHash, isValidPassword } from "../util.js";  // IMPORTANTE: El profe en clase22 no usa util.js sino utils.js (plural)

import passport from "passport";

const router = Router();

/* router.post("/register", async (req, res) => {
  //logica a implementar
  const { first_name, last_name, email, age, password } = req.body;
  //no olvidar validar
  const exist = await userModel.findOne({ email: email });
  if (exist) {
    return res
      .status(400)
      .send({ status: "error", error: "el correo ya existe" });
  }
  const user = {
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
  };
  const result = await userModel.create(user);
  console.log(result);
  res.status(201).send({ staus: "success", payload: result });
}); */

// Registrar usando passport
router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    res.status(201).send({ status: "success", message: "Usuario registrado" });
  }
);

router.get("/failregister", async (req, res) => {
  console.log("error");
  res.send({ error: "Falló" });
});

// Iniciar sesion usando de passport
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    if (!req.user) return res.status(400).send("error");
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
    };
    res.status(200).send({ status: "success", payload: req.user });
  }
);

router.get("/faillogin", async (req, res) => {
  console.log("error");
  res.send({ error: "Fallo" });
});

// Iniciar sesión usando Github
// ruta a la que nos dirigimos para iniciar sesión
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    console.log("Router Session > /github", { req, res })
    //podemos enviar una respuesta
  }
);
//ruta que nos lleva a github login
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    console.log("Router Session > githubcallback", { req, res })
    req.session.user = req.user;

    res.redirect("/"); //ruta a la que redirigimos luego de iniciar sesión
  }
);
// Restaurar contraseña
router.post("/restore", async (req, res) => {
  const { email, password } = req.body;
  //validar
  const user = await userModel.findOne({ email });
  console.log(user);
  if (!user)
    return res
      .status(400)
      .send({ status: "error", message: "No se encuentra el user" });
  const newPass = createHash(password);

  await userModel.updateOne({ _id: user._id }, { $set: { password: newPass } });

  res.send({ status: "success", message: "Password actualizado" });
});

export default router;
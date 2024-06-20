import express from "express";
import userController from "../controllers/user.controller.js";
import { authToken, isUserOrPremium } from "../middlewares/auth.js";

const userRouter = express.Router();
// Maneja la solicitud para cerrar la sesión del usuario
userRouter.get("/logout", userController.logOut);

// Maneja el renderizado del login
// userRouter.get("/login", userController.getLogin);

// Maneja el renderizado del register
userRouter.get("/register", userController.getRegister);

// Iniciar sesión con GitHub
userRouter.get("/github", userController.getGitHub);

// Callback de GitHub después de la autenticación
userRouter.get("/github/callback", userController.gitHubCallback, userController.handleGitHubCallback);

// Maneja la solicitud de login de usuarios
userRouter.post("/login", userController.login);

// Maneja la solicitud de registros de usuarios
userRouter.post("/register", userController.register);

// Maneja la solicitud de recuperar contraseña
userRouter.post("/requestPasswordReset", userController.requestPasswordReset);

// Maneja la solicitud para cambiar la contraseña del usuario
userRouter.post("/resetPassword/:token", userController.resetPassword);

// Maneja la solicitud para cambiar la contraseña del usuario
userRouter.put("/changePassword/:uid", authToken, userController.changePassword);

// Maneja la solicitud para cambiar el rol del usuario
userRouter.put("/premium/:uid", authToken, isUserOrPremium, userController.changeUserRole);

export default userRouter;
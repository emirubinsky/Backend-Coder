
//import User from "../models/user.model.js";
// TODO hacer todo el camino de mas elaborado...
import User from "../dao/mongo/models/user.model.js"
import UserManager from '../managers/user.manager.js'
import UserDTO from "../../src/dao/dto/user.dto.js"

import { customLogger } from '../appHelpers/logger.helper.js';

import crypto from "crypto";
import bcrypt from "bcrypt";
import passport from "passport";
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from "../util.js"

import messenger from "../appHelpers/messenger.js";

const userController = {
    /* Metodo para el proyecto en algun futuro
    getUserById: async (req, res) => {
        const userId = req.params.uid;

        try {
            const userDetail = await User.findOne({ _id: userId }).lean();

            if (req.accepts('html')) {
                return res.render('user', { user: userDetail });
            }

            res.json(userDetail);
        }
        catch (err) {
            customLogger.error("Error al ver los detalles:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },
    */

    getLogin: async (req, res) => {
        res.render("login");
    },

    login: async (req, res, next) => {
        const { email, password } = req.body;

        try {
            customLogger.info("login > ", { email, password })
            passport.authenticate("local", (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(401).json({ error: "Credenciales inválidas" });
                }
                if (email === "adminCoder@coder.com" && password === "adminCod3er123") {
                    user.role = "admin";
                }

                // Generar token JWT
                const access_token = generateAuthToken(user);

                req.session.email = email;
                req.session.userId = user._id;
                req.session.user = user;
                req.session.isAuthenticated = true;


                res.cookie("jwt", access_token, {
                    httpOnly: true,
                })


                customLogger.info("Datos del login:", user, "token:", access_token);

                res.json({ message: "Success", user, access_token });
            })(req, res, next);

        } catch (error) {
            customLogger.error("Error al iniciar sesión:", { ...error });
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getRegister: async (req, res) => {
        res.render("register");
    },

    register: async (req, res, next) => {
        const { first_name, last_name, email, age, password } = req.body;

        try {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ error: "El usuario ya existe" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const role = email.includes("admin") ? "admin" : "user";

            const newUser = new User({
                first_name: first_name,
                last_name: last_name,
                email: email,
                age: age,
                password: hashedPassword,
                role,
            });

            await newUser.save();

            const access_token = generateAuthToken(newUser);

            req.session.userId = newUser._id;

            req.session.user = newUser;

            req.session.isAuthenticated = true;

            customLogger.info("Datos del registro:", newUser, "token:", access_token);

            res.json({ message: "Success", newUser, access_token });

        } catch (error) {
            customLogger.error("Error al registrar usuario:", { ...error });
            next(error);
        }
    },

    getGitHub: passport.authenticate("github", { scope: ["user:email"] }),

    gitHubCallback: passport.authenticate("github", { failureRedirect: "/login" }),

    // Redirige al usuario a la página de inicio después de iniciar sesión con GitHub
    handleGitHubCallback: async (req, res) => {
        try {
            // customLogger.info("handleGitHubCallback > inicio", { req, res })

            // Genera el token de acceso
            const access_token = generateAuthToken(req.user);

            customLogger.info("handleGitHubCallback > access_token listo")

            // Establece la sesión del usuario
            req.session.email = req.user.email;
            req.session.token = access_token;
            req.session.userId = req.user._id;
            req.session.user = req.user;
            req.session.isAuthenticated = true;

            customLogger.info("Token login github:", access_token);

            //res.cookie('jwt', access_token); // Set JWT token in cookie

            // TODO: luego
            res.cookie("jwt", access_token, {
                httpOnly: true,
            })

            // INFO: Prohibido esto, sino mandamos como una doble respuesta y da problemas
            /*
            .send({
                status: "Success",
                message: req.user,
                access_token,
                userId: req.user._id
            });
            */

            // Envia la respuesta con el token de acceso al frontend
            res.redirect("/home");

        } catch (error) {
            customLogger.info('Error en el callback de GitHub:', { ...error });
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    logOut: async (req, res) => {
        try {
            req.session.userId = null;
            req.session.user = null;
            req.session.isAuthenticated = false;

            res.clearCookie('jwt');

            return res.render("users_login")

            //res.json({ message: "Logout funciona" });
        } catch (error) {
            customLogger.error("Error al cerrar sesión:", { ...error });
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    requestPasswordReset: async (req, res) => {
        const { email } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            const resetToken = crypto.randomBytes(20).toString('hex');
            const resetTokenExpires = Date.now() + 3600000;

            const userId = user._id
            const updateData = { resetToken, resetTokenExpires }
            await User.findByIdAndUpdate(userId, updateData, { new: true })

            const resetUrl = `http://${req.headers.host}/api/sessions/resetPassword/${resetToken}`;
            const mailOptions = {
                to: user.email,
                from: EMAIL_USERNAME,
                subject: 'Restablecimiento de contraseña',
                text: `Está recibiendo esto porque usted (o alguien más) ha solicitado el restablecimiento de la contraseña de su cuenta.\n\n
                Haga clic en el siguiente enlace, o péguelo en su navegador para completar el proceso:\n\n
                ${resetUrl}\n\n
                Si no solicitó esto, ignore este correo y su contraseña permanecerá sin cambios.\n`
            };

            customLogger.info("USER MANAGER > EMAIL > ", { mailOptions })
            await messenger.transport.sendMail(mailOptions)

            res.status(200).json({ message: 'Correo de restablecimiento de contraseña enviado con éxito' });
        } catch (error) {
            console.error("Error al solicitar restablecimiento de contraseña:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    resetPassword: async (req, res) => {
        const { token } = req.params;
        const { newPassword } = req.body;
        const userId = req.session.userId;

        try {
            const user = await User.findOne({ token });
            //userService.getUserByResetToken(token);

            if (!user || user.resetTokenExpires < Date.now()) {
                return res.status(400).json({ error: "Token de restablecimiento inválido o expirado" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const updateDataPwd = { password: hashedPassword }
            await User.findByIdAndUpdate(userId, updateDataPwd, { new: true })
            // userService.updatePassword(userId, newPassword);

            const updateDataToken = { resetToken: null, resetTokenExpires: null }
            await User.findByIdAndUpdate(userId, updateDataToken, { new: true })
            // userService.clearPasswordResetToken(userId);

            res.status(200).json({ message: "Contraseña restablecida con éxito" });
        } catch (error) {
            console.error("Error al restablecer la contraseña:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    changePassword: async (req, res) => {
        const userId = req.params.uid;
        const { oldPassword, newPassword } = req.body;

        try {
            // const changedPassword = await userService.changePassword(userId, oldPassword, newPassword);
            // res.json(changedPassword);

            logger.info(`Cambiando las contraseña del user: ${userId}`);
            const existingUser = await User.findOne({userId}) //userRepository.findUser(userId);
            if (!existingUser) {
                logger.warn(`User no encontrado: ${userId}`);
                throw new Error("El usuario no existe");
            }

            const isPasswordValid = await bcrypt.compare(oldPassword, existingUser.password);
            if (!isPasswordValid) {
                logger.warn(`Contraseña antigua no válida para user: ${userId}`);
                throw new Error("La contraseña antigua es incorrecta");
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            existingUser.password = hashedPassword;

            await existingUser.save();
            logger.info(`La contraseña cambió exitosamente para el user: ${userId}`);
            return { message: "Contraseña actualizada correctamente" };
        }
        catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    changeUserRole: async (req, res) => {
        const userId = req.params.uid;
        const { newRole } = req.body;

        try {
            const currentUser = await UserManager.getOne(userId)

            const userDTO = new UserDTO(...currentUser, role = newRole)
            
            const updatedUser = await UserManager.update(userDTO);
            
            res.json(updatedUser);
        } catch (error) {
            console.error("Error al cambiar el rol del usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },  
}

export default userController;

export const generateAuthToken = (user) => {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    //const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    return token;
};
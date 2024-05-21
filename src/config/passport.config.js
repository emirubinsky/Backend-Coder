import passport from "passport";
import local from "passport-local"; //estrategia local
import * as _GitHubStrategy from "passport-github2"; //estrategia github
import jwt from "passport-jwt"; ////estrategia de jwt

// import userService from "../models/Users.model.js";      // IMPORTANTE: El profe en clase22 no aloja controllers, managers y models adentro de DAO, lo deja afuera
// Nosotros tenemos que usarlo así
// TODO hacer todo el camino de mas elaborado...
import User from "../dao/mongo/models/user.model.js"

import { createHash, isValidPassword } from "../util.js";  // IMPORTANTE: El profe en clase22 no usa util.js sino utils.js (plural)

const LocalStrategy = local.Strategy; //estrategia local
const JWTStrategy = jwt.Strategy; //estrategia jwt
const ExtracJWT = jwt.ExtractJwt; //Extractor de jwt de los headers, de las cookies

console.log("_GitHubStrategy", Object.keys(_GitHubStrategy))
const GitHubStrategy = _GitHubStrategy.Strategy

import { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL, JWT_SECRET } from "../util.js";

console.log("passport.config.js", {
    CLIENT_ID, CLIENT_SECRET, CALLBACK_URL, JWT_SECRET
})

//función que extrae las cookies
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookie'];
    }
    return token;
};

const initializePassport = () => {

    //Serializar y deserializar usuario
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    //Registrar ususario localmente
    passport.use(
        "register",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {
                const { first_name, last_name, email, age } = req.body;

                try {
                    const user = await User.findOne({ email: username });
                    if (user) {
                        console.log("el usuario ya existe");
                        return done(null, false); // Indica que el usuario existe (sin error)
                    }

                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password), // Hashear la contraseña
                        type: "LOCAL"
                    };

                    // Guardar el usuario
                    const result = await User.create(newUser); // TODO: esto no debería consumir el modelo directo...


                    return done(null, result); // Pasar el usuario creado al éxito
                } catch (error) {
                    return done(error); // Pasar el error si hay alguno
                }
            }
        )
    );


    //estrategia local para iniciar sesión
    passport.use(
        "local",
        new LocalStrategy(
            { usernameField: "email" },
            async (username, password, done) => {
                try {
                    const user = await User.findOne({ email: username });
                    if (!user) return done(null, false);
                    const valid = isValidPassword(user, password);
                    if (!valid) return done(null, false);

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );


    //Estrategia para iniciar sesión con github
    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: CLIENT_ID,                      //clientID: "Iv1.f60f672a1689aa16",//id de la app en github 
                clientSecret: CLIENT_SECRET,               // clientSecret: "8b94a8adb2d9d006e9c23221eec10749f43918094",//clave secreta de github
                callbackURL: CALLBACK_URL,                 //callbackURL: "http://localhost:8080/users/githubcallback",//url callback de github
            },
            async (accessToken, refreshToken, profile, done) => {
                // console.log("GitHubStrategy", { accessToken, refreshToken, profile }); 
                try {
                    console.log("GitHubStrategy", { accessToken, refreshToken, profile }); //obtenemos el objeto del perfil
                    //buscamos en la db el email
                    const user = await User.findOne({
                        email: profile._json.email,
                    });
                    //si no existe lo creamos
                    if (!user) {
                        //contruimos el objeto según el modelo (los datos no pertenecientes al modelo lo seteamos por default)
                        const newUser = {
                            first_name: profile._json.name,
                            last_name: "",
                            age: 20,
                            email: profile._json.email,
                            password: "",
                            type: "GITHUB"
                        };
                        //guardamos el usuario en la database
                        let createdUser = await User.create(newUser);// TODO: esto no debería consumir el modelo directo...
                        
                        done(null, createdUser);
                    } else {
                        done(null, user);
                    }
                } catch (error) {
                    console.log(error)
                    return done(error);
                }
            }
        )
    );

    //Estrategia para jwt
    passport.use(
        "jwt",
        new JWTStrategy(
            {
                jwtFromRequest: ExtracJWT.fromExtractors([cookieExtractor]), //cookieExtractor es una función que nosotros creamos
                secretOrKey: JWT_SECRET, //misma que en app
            },
            async (jwt_payload, done) => {
                try {
                    return done(null, jwt_payload);
                } catch (error) {
                    console.log(error)
                    return done(error);
                }
            }
        )
    );
};



export default initializePassport;
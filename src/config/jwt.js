import passport from "passport";
import passportJWT from "passport-jwt";
import config from "./config.js";

const ExtractJWT = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
};

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, done) => {
    try {
        if (jwt_payload) {
            return done(null, jwt_payload);
        } else {
            return done(null, false);
        }
    } catch (error) {
        console.error('Error en el middleware de Passport JWT:', error);
        return done(error, false);
    }
});

passport.use(strategy);

export default passport;
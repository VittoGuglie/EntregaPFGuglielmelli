const passport = require('passport');
const local = require('passport-local');
const userService = require('../dao/models/Users.model');
const { createHash, isValidPassword } = require('../utils/cryptPassword.utils');
const GithubStrategy = require('passport-github2');
const { generateToken, verifyToken } = require('../utils/jwt.utils');
const { secret_key } = require('../config/app.config');
const cookieExtractor = require('../utils/cookieExtractor.utils');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const localStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                let user = await userService.findOne({ email: username });
                if (user) {
                    console.log('El usuario ya existe.');
                    return done(null, false);
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                };

                let result = await userService.create(newUser);
                return done(null, result);
            } catch (error) {
                return done(`Error al obtener el usuario: ${error}`);
            }
        }
    ));

    passport.use('login', new localStrategy({ usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await userService.findOne({ email: username });
                if (!user) {
                    console.log('El usuario no existe.');
                    return done(null, false);
                }
                if (!isValidPassword(user, password)) return done(null, false);

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.59174e6ff11cf59e',
        clientSecret: 'b16f0d0881dc031b280bd837521ebfe5e9de251a',
        callbackURL: 'http://localhost:8080/auth/githubcallback'
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);
                const user = await userService.findOne({ email: profile._json.email });

                if (!user) {
                    const newUserInfo = {
                        first_name: profile._json.name,
                        last_name: '',
                        age: 18,
                        email: profile._json.email,
                        password: '',
                    };
                    const newUser = await userService.create(newUserInfo);
                    return done(null, newUser);
                }

                done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: secret_key,
        },
        async (jwt_payload, done) => {
            try {
                done(null, jwt_payload);
            } catch (error) {
                done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userService.findById(id);
        done(null, user);
    });
};

module.exports = initializePassport;


const passport = require("passport");
const passportLocal = require("passport-local");

const passportHttp = require("passport-http");

const User = require("../models/user");

const validateUser = (username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            done(err);
        }
        if (!user || !user.isValidPassword(password)) {
            return done(null, false, { errors: { "login or password": "is invalid" } });
        }
        return done(null, user);
    });
};

passport.use(new passportLocal.Strategy(validateUser));
passport.use(new passportHttp.BasicStrategy(validateUser));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, (err, user) => {
        if (err) {
            done(err);
        }
        if (user) {
            done(null, {
                id: user._id,
                username: user.username,
                password: user.password
            });
        } else {
            done({
                msg: "Nieznany ID"
            });
        }
    });
});

module.exports = passport;

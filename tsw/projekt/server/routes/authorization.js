const express = require("express");
const router = express.Router();
const HttpStatus = require("http-status-codes");
const User = require("../models/user");
const passport = require("../passport");
const bcrypt = require("../bcrypt");
const { check, validationResult } = require("express-validator");

const rejectMethod = (_req, res, _next) => {
    res.sendStatus(HttpStatus.METHOD_NOT_ALLOWED);
};

router.post("/login", [
    check("username").exists().isString().isLength(1).withMessage("User name is required."),
    check("password").exists().isString().isLength(1).withMessage("Password name is required.")
]
, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }
    passport.authenticate("local", (err, passportUser, info) => {
        if (err) {
            return next(err);
        }
        if (!passportUser) {
            return res.status(HttpStatus.UNAUTHORIZED)
                .json("Wrong password or login!");
        }
        req.logIn(passportUser, function (err) {
            if (err) {
                return next(err);
            }
            return res.status(HttpStatus.OK).json({
                isLogged: true,
                username: passportUser.username
            });
        });
    })(req, res, next);
}).all(rejectMethod);

router
    .route("/isLogged")
    .get((req, res) => {
        if (req.user) {
            return res.json(true);
        } else {
            return res.json(false);
        }
    })
    .all(rejectMethod);

router
    .route("/userState")
    .get((req, res) => {
        if (req.user) {
            return res.json({
                username: req.user.username,
                authenticated: true
            });
        } else {
            return res.json({
                username: "",
                authenticated: false
            });
        }
    })
    .all(rejectMethod);

router
    .route("/logout")
    .get((req, res) => {
        req.logout();
        res.sendStatus(HttpStatus.OK);
    })
    .all(rejectMethod);

router
    .route("/register")
    .post([
        check("username").isString().withMessage("User name is required."),
        check("password").isString().withMessage("Password name is required.")
    ], async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
            }
            const passwordHash = bcrypt.hash(req.body.password);
            const user = new User({
                username: req.body.username,
                password: passwordHash
            });
            await user.save();
            res.sendStatus(HttpStatus.OK);
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                ErrorMessage: err.message
            });
        }
    })
    .all(rejectMethod);

module.exports.router = router;

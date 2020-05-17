const express = require("express");
const router = express.Router();
const HttpStatus = require("http-status-codes");
const User = require("../models/user");
const passport = require("../passport");
const bcrypt = require("../bcrypt");

const rejectMethod = (_req, res, _next) => {
    res.sendStatus(HttpStatus.METHOD_NOT_ALLOWED);
};

router.post("/login", (req, res, next) => {
    const user = req.body;
    if (!user.username) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
            errors: {
                username: "is required"
            }
        });
    }

    if (!user.password) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
            errors: {
                password: "is required"
            }
        });
    }
    passport.authenticate("local", (err, passportUser, info) => {
        if (err) {
            return next(err);
        }
        if (!passportUser) {
            return res.status(HttpStatus.UNAUTHORIZED).json("Wrong password or login!");
        }
        req.logIn(passportUser, function (err) {
            if (err) {
                return next(err);
            }
            return res.sendStatus(HttpStatus.OK);
        });
        console.log("ZALOGOWANO");
    })(req, res, next);
}).all(rejectMethod);
/*
router
  .route('/login')
  .post((req, res, next) => {
  passport.authenticate('local',
    (err, user, info) => {
      if (err) {
        return res.json({
            ErrorMessage: err.msg
        })
      }
      req.logIn(user,(err) => {
        if (err) {
           res.status(HttpStatus.BAD_REQUEST);
        }
        return res.status(HttpStatus.OK).json(user);
      });
    })(req, res, next);
  })
  .all(rejectMethod);
/*
router
    .route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post(passport.authenticate("local"), async (req, res) => {
        await res.status(HttpStatus.OK);
    })
    .all(rejectMethod);
*/

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
    .route("/logout")
    .get((req, res) => {
        req.logout();
        res.sendStatus(HttpStatus.OK);
    })
    .all(rejectMethod);

router
    .route("/register")
    .post(async (req, res) => {
        try {
            const passwordHash = bcrypt.hash(req.body.password);
            const user = new User({
                username: req.body.username,
                password: passwordHash
            });
            await user.save();
            res.sendStatus(HttpStatus.OK);
        } catch (err) {
            if (!req.body.password) {
                res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
                    password: "Error – password must not be empty!"
                });
            } else if (!req.body.username) {
                res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
                    username: "Error – username must not be empty!"
                });
            } else {
                res.status(HttpStatus.BAD_REQUEST).json({
                    ErrorMessage: err
                });
            }
        }
    })
    .all(rejectMethod);

module.exports.router = router;

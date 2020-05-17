const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const User = require("../models/user");
const passport = require("../passport");
const bcrypt = require("../bcrypt");


const rejectMethod = (_req, res, _next) => {
  res.sendStatus(HttpStatus.METHOD_NOT_ALLOWED);
};

/* GET users listing. */
router
  .route('/login')
  .post((req, res, next) => {
  passport.authenticate('local',
    (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
         res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          ErrorMessage: "Login and password is required."
        });
      }
      req.logIn(user,(err) => {
        if (err) {
           res.status(HttpStatus.BAD_REQUEST).json({
            ErrorMessage: err
          });
        }
        return res.sendStatus(HttpStatus.OK);
      });
    })(req, res, next);
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
      let passwordHash = bcrypt.hash(req.body.password);
      let user = new User({
        username: req.body.username,
        password: passwordHash
      });
      let doc = await user.save();
      res.sendStatus(HttpStatus.OK);
    } catch (err) {
      if (!req.body.password) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          password: "Error – password must not be empty!"
        });
      } else if (!req.body.username) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          username: "Error – username must not be empty!"
        })
      } else {
         res.status(HttpStatus.BAD_REQUEST).json({
          ErrorMessage: err
        });
      }
    }
  })
  .all(rejectMethod);


module.exports.router = router;

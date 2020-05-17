"use strict";

// Sugestia – funkcję oceniającą ruchy najlepiej
// umieścić w osobnym module, a poniżej jedynie z niej
// skorzystać.

const Game = require("./../game.js");
const express = require("express");
const router = express.Router();
const uuid = require("uuidv4").uuid;
const checkUserResult =  require("./../services/checkUserResult.js");
const getRandomResultArray = require("./../services/getRandomResultArray.js");
const getDefaultGameOptions = require("./../services/getDefaultGameOptions.js");
const gameCookiesService = require("./../services/gameCookiesService.js");

const User = require("../model/index.js");
const GameSaved =  require("./../model/gamesSaved.js");

// Passport.js i narzędzie do szyfrowania haseł
const passport = require("../passport");
const bcrypt = require("../bcrypt");

const socketio = require("socket.io");
const io = socketio.listen(httpServer);


const rejectMethod = (_req, res, _next) => {
    // Method Not Allowed
    res.sendStatus(405);
};




io
    .of("/chat")
    .on("connect", (socket) => {
        console.log("Uruchomiłem kanał „/chat”");
        socket.on("message", (data) => {
            console.log(`/chat: ${data}`);
            socket.emit("message", `/chat: ${data}`);
        });
    });

io
    .of("/news")
    .on("connect", (socket) => {
        console.log("Uruchomiłem kanał „/news”");
        socket.on("message", (data) => {
            console.log(`/news: ${data}`);
            socket.emit("message", `/news: ${data}`);
        });
    });

router
    .route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post(passport.authenticate("local"), async (req, res) => {
        await res.redirect("/");
    })
    .all(rejectMethod);

router
    .route("/logout")
    .get((req, res) => {
        req.logout();
        res.redirect("/");
    })
    .all(rejectMethod);

router
    .route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post(async (req, res) => {
        try {
            let passwordHash = bcrypt.hash(req.body.password);
            let user = new User({
                username: req.body.username,
                password: passwordHash
            });
            let doc = await user.save();
            res.redirect('/');
        } catch (err) {
            if (!req.body.password) {
                // Unprocessable Entity
                res.status(422).json({
                    password: "Error – password must not be empty!"
                });
            } else {
                res.redirect('/');
                //res.status(422).json(User.processErrors(err));
            }
        }
    })
    .all(rejectMethod);

module.exports = router;

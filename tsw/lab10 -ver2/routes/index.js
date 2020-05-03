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


const rejectMethod = (_req, res, _next) => {
    // Method Not Allowed
    res.sendStatus(405);
};


router.route("/")
    .post((req, res) => {
        console.log(req.user);
        const reqBody =  req.body;
        let options = getDefaultGameOptions();
        if(reqBody.size) {
            options.size = parseInt(reqBody.size);
        }
        if(reqBody.dim) {
           options.dim = parseInt(reqBody.dim);
        }
        if(reqBody.max) {
            options.max = parseInt(reqBody.max); 
        }
        let solution = getRandomResultArray(options);
        let userGame = new Game(options,solution,options.max);
        req.session.id = uuid();
        gameCookiesService.addUserGameToCookies(req,userGame,req.session.id);
        let rtn = {
            game: options,
            uuid: req.session.id
        }
        res.json(rtn); 
    })
    .patch((req, res) => {
        gameCookiesService.addNewMoveToUserGame(req);
        let game = gameCookiesService.getUserGameFromCookies(req);
        let comp = checkUserResult(req,game);
        let movesLeft = game.movesLetf;
        console.log(game);
        if(comp===true) {
            gameCookiesService.removeUserGame(req);
            if(req.user) {
                let doc =  saveGameToDb(game,req);
            }
            
        }
        else if(comp===false) {
            gameCookiesService.removeUserGame(req);
            if(req.user) {
                let doc = saveGameToDb(game,req);
            }
        }
        res.json({
            movesLeft: movesLeft,
            comp: comp
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

       router
       .route("/games")
       .get((req, res) => {
            if(!req.user) {
                res.redirect('/login');
            }
            GameSaved.find({ "userName": { $eq: req.user.username}}, (err, data) => {
               if (err) {
                   res.code(500);
               } else {
                    console.log(data);
                   res.render("games", {
                       isAuthenticated: req.user,
                       user: req.user,
                       data: data
                    });
               }
           });
       })
       .all(rejectMethod);


     async  function saveGameToDb(game,req) {
        const userN = req.user.username;
        let gameToSave = new GameSaved({
            userName: userN,
            size: game.options.size,
            dim: game.options.dim,
            max: game.options.max,
            solution: game.solution,
            result: game.result,
            moves: game.moves,
            movesLeft: game.movesLetf
        });
       console.log(req.user);
        let doc = await gameToSave.save();
        return doc;
    }


    

module.exports = router;

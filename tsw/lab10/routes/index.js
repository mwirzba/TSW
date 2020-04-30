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

router.route("/")
    .post((req, res) => {
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
        }
        res.json({
            movesLeft: movesLeft,
            comp: comp
        });
    });

    

module.exports = router;

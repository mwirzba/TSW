"use strict";

// Sugestia – funkcję oceniającą ruchy najlepiej
// umieścić w osobnym module, a poniżej jedynie z niej
// skorzystać.

const gameFile = require("./../game");
const express = require("express");
const router = express.Router();
const game = new gameFile.Game();
const uuid = require("uuidv4").uuid;


router.route("/")
    .post((req, res) => {
        const reqBody =  req.body;
        if(reqBody.size !== undefined) {
            game.options.size = reqBody.size;
        }
        if(reqBody.dim !== undefined) {
            game.options.dim = reqBody.dim;
        }
        if(reqBody.max !== undefined) {
            game.options.max = reqBody.max; 
        }
        req.session.id = uuid;
        let rtn = {
            game: game.options,
            uuid: uuid()
        }
        res.json(rtn); 
    })
    .patch((req, res) => {
        let ruch = req.body;
        // oceniamy ruch
        res.json({
            msg: "ocena ruchu",
            ruch
        });
    });

    

module.exports = router;

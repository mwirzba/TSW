"use strict";

// Sugestia – funkcję oceniającą ruchy najlepiej
// umieścić w osobnym module, a poniżej jedynie z niej
// skorzystać.

const gameFile = require("./../game");
const express = require("express");
const router = express.Router();

router.route("/")
    .post((req, res) => {

    })
    .patch((req, res) => {
    });

    

module.exports = router;

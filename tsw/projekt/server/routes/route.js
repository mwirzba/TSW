const express = require("express");
const router = express.Router();

router.route("/")
      .get((req,res) => {
          res.json("WITAM")
      });


router.use('/authorization',require('./authorization').router);



module.exports.router = router;

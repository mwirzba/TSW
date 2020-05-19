const express = require("express");
const router = express.Router();

router.route("/home")
    .get((req, res) => {
        var status = req.isAuthenticated() ? "logged in" : "logged out";
        return res.json(status);
    });

router.use("/authorization", require("./authorization").router);
router.use("/auction", require("./auction").router);

module.exports.router = router;

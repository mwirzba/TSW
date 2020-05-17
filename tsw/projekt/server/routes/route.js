const express = require("express");
const router = express.Router();

router.route("/home")
    .get((req, res) => {
        console.log(req.user);
        var status = req.isAuthenticated() ? "logged in" : "logged out";
        /* console.log(
            "status:", status, "\n",
            req.sessionStore,
            req.sessionID,
            req.session); */
        return res.json(status);
    });

router.use("/authorization", require("./authorization").router);

module.exports.router = router;

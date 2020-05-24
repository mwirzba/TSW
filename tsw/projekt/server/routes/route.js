const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.route("/home")
    .get((req, res) => {
        var status = req.isAuthenticated() ? "logged in" : "logged out";
        return res.json(status);
    });

router
    .route("/addObservedAuctionToUser")
    .put(async (req, res) => {
        if (req.user) {
            const editUser = await User.findOne({ username: req.user.username });
            if (!editUser.observedAuctions.find(a => a === req.body.auctionId)) {
                console.log("DODANo");
                editUser.observedAuctions.push(req.body.auctionId);
                await editUser.save();
            }
            res.sendStatus(200);
        } else {
            return res.sendStatus(400);
        }
    });

router.use("/authorization", require("./authorization").router);
router.use("/auction", require("./auction").router);
router.use("/chat", require("./chat").router);

module.exports.router = router;

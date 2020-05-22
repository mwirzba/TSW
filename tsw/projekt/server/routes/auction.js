const express = require("express");
const router = express.Router();
const HttpStatus = require("http-status-codes");
const User = require("../models/user");
const Auction = require("../models/auction");
const { check, validationResult, body } = require("express-validator");

const rejectMethod = (_req, res, _next) => {
    res.sendStatus(HttpStatus.METHOD_NOT_ALLOWED);
};

const today = new Date();
const todayDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

router
    .route("/")
    .get(async (req, res) => {
        const rtn = await Auction.find({});
        return res.json(rtn);
    });

router
    .route("/pagination/:page")
    .get(async (req, res) => {
        const pageSize = 9;
        let page = req.params.page || 1;
        if (page < 1) {
            page = 1;
        }
        page = parseInt(page);
        const auctions = await Auction.find({})
            .skip((pageSize * page) - pageSize)
            .limit(pageSize);
        const numberOfItems = await Auction.countDocuments();
        const totalPages = Math.ceil(numberOfItems / pageSize);
        if (page > totalPages) {
            page = 1;
        }
        const rtn = {
            auctions: auctions,
            paginationInfo: {
                numberOfItems: numberOfItems,
                currentPage: page,
                totalPages: totalPages,
                hasPrevious: page !== 1,
                hasNext: page < totalPages
            }
        };
        return res.json(rtn);
    });

router
    .route("/yourAuctions/auctions/:page")
    .get(async (req, res) => {
        if (!req.user) {
            return res.status(HttpStatus.UNAUTHORIZED).json("You must be logged to see your auctions");
        }
        const pageSize = 9;
        let page = req.params.page || 1;
        if (page < 1) {
            page = 1;
        }
        page = parseInt(page);
        const auctions = await Auction.find({ auctionOwner: req.user.username })
            .skip((pageSize * page) - pageSize)
            .limit(pageSize);
        const numberOfItems = await Auction.countDocuments({ auctionOwner: req.user.username });
        const totalPages = Math.ceil(numberOfItems / pageSize);
        if (page > totalPages) {
            page = 1;
        }
        const rtn = {
            auctions: auctions,
            paginationInfo: {
                numberOfItems: numberOfItems,
                currentPage: page,
                totalPages: totalPages,
                hasPrevious: page !== 1,
                hasNext: page < totalPages
            }
        };
        return res.json(rtn);
    });

router
    .route("/observedAuctions")
    .get(async (req, res) => {
        if (!req.user) {
            return res.status(HttpStatus.UNAUTHORIZED).json("You must be logged to see your observed auctions");
        }
        const observedAuctions = [];
        const usr = await User.findOne({ username: req.user.username });
        if (usr.observedAuctions) {
            for (const id of usr.observedAuctions) {
                const auction = await Auction.findById(id);
                observedAuctions.push(auction);
            }
        }
        return res.json(observedAuctions);
    });

function CheckDateErrors (startDate, endDate, auctionToUpdate) {
    const errors = [];
    if (!Date.parse(startDate)) {
        errors.push({
            msg: "Wrong date format!",
            param: "startDate",
            location: "body"
        });
    }

    if (!Date.parse(endDate)) {
        errors.push({
            msg: "Wrong date format!",
            param: "endDate",
            location: "body"
        });
    }

    if (endDate < startDate) {
        errors.push({
            msg: "End date must be later than start date.",
            param: "endDate",
            location: "body"
        });
    }

    if (auctionToUpdate && auctionToUpdate.startDate < todayDate) {
        errors.push({
            msg: "You cant edit this auction anymore",
            param: "startDate",
            location: "body"
        });
    }
    return errors;
}

router
    .route("/")
    .post([
        check("currentPrice").exists().withMessage("Price is required."),
        check("currentPrice").isNumeric().withMessage("Price must be a number."),
        check("endDate").exists(),
        check("auctionName").exists().isString().isLength(1).withMessage("Auction name is required."),
        check("auctionOwner").exists().isString().isLength(1),
        check("startDate").isAfter(todayDate).withMessage("Start date must be later than today.")
    ], (req, res) => {
        try {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
            }

            const { auctionOwner, currentPrice, auctionName, startDate, endDate } = req.body;
            const newAuctionObj = { auctionOwner, currentPrice, auctionName, startDate, endDate };
            errors = CheckDateErrors(startDate, endDate);
            if (errors.length > 0) {
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors });
            }

            const newAuction = new Auction(newAuctionObj);
            newAuction.save((err, auction) => {
                if (err) {
                    return console.log(err);
                }
                return res.status(HttpStatus.CREATED).json(auction);
            });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json(e.message);
        }
    });

router
    .route("/:auctionId")
    .put([
        check("currentPrice").exists().withMessage("Price is required."),
        check("currentPrice").isNumeric().withMessage("Price must be a number."),
        check("endDate").exists(),
        check("auctionName").exists().isString().isLength(1).withMessage("Auction name is required."),
        check("auctionOwner").exists().isString().isLength(1),
        check("startDate").isAfter(todayDate).withMessage("Start date must be later than today.")
    ],
    (req, res) => {
        try {
            let errors = validationResult(req);
            console.log(errors);
            if (!errors.isEmpty()) {
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
            }
            const body = req.body;
            let auctionToUpdate;
            if (!req.params.auctionId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(
                    {
                        errors: {
                            msg: "Wrong id",
                            param: "startDate",
                            location: "body"
                        }
                    });
            }
            Auction.findById(req.params.auctionId).then(rtn => {
                auctionToUpdate = rtn;
                if (auctionToUpdate) {
                    errors = CheckDateErrors(body.startDate, body.endDate, auctionToUpdate);
                    if (errors.length > 0) {
                        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({ errors: errors });
                    }
                    auctionToUpdate.auctionName = body.auctionName;
                    auctionToUpdate.currentPrice = body.currentPrice;
                    auctionToUpdate.endDate = body.endDate;
                    auctionToUpdate.startDate = body.startDate;
                    auctionToUpdate.endDate = body.endDate;
                    auctionToUpdate.save((err, auction) => {
                        if (err) {
                            return res.json(err);
                        }
                        return res.json(auction);
                    });
                } else {
                    return res.status(HttpStatus.NOT_FOUND).json("NIE ZNALEZIONO");
                }
            }
            );
        } catch (e) {
            return res.json(e.message);
        }
    });

router
    .route("/:auctionId")
    .get(async (req, res) => {
        console.log(req.params.auctionId);
        let rtn;
        if (req.params.auctionId.match(/^[0-9a-fA-F]{24}$/)) {
            rtn = await Auction.findById(req.params.auctionId);
        } else {
            return res.sendStatus(HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (rtn) {
            return res.json(rtn);
        } else {
            return res.sendStatus(HttpStatus.NOT_FOUND);
        }
    });

module.exports.router = router;

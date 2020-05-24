const express = require("express");
const router = express.Router();
const HttpStatus = require("http-status-codes");
const User = require("../models/user");
const Auction = require("../models/auction");
const { check, validationResult } = require("express-validator");

const today = new Date();
const todayDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

function CheckDateErrors (endDate, auctionToUpdate) {
    const errors = [];
    if (!Date.parse(endDate)) {
        errors.push({
            msg: "Wrong date format!",
            param: "endDate",
            location: "body"
        });
    }
    if (Date.parse(endDate) < Date.now()) {
        errors.push({
            msg: "End date cannot be before than today's date!",
            param: "endDate",
            location: "body"
        });
    }

    if (auctionToUpdate && auctionToUpdate.userPrice && auctionToUpdate.userPrice.length) {
        errors.push({
            msg: "You can't edit this auction anymore",
            param: "userPrice",
            location: "body"
        });
    }
    return errors;
}

router
    .route("/pagination/:page")
    .get(async (req, res) => {
        const pageSize = 9;
        let page = req.params.page || 1;
        if (page < 1) {
            page = 1;
        }
        page = parseInt(page);
        let auctions = await Auction
            .find({ archived: false })
            .skip((pageSize * page) - pageSize)
            .limit(pageSize);

        for (const a of auctions) {
            if (a.endDate < Date.now()) {
                a.archived = true;
                a.auctionBuyer = a.userPrice[a.userPrice.length - 1].user;
                await a.save();
            }
        }

        auctions = auctions.filter(a => !a.archived);

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
            return res.status(HttpStatus.UNAUTHORIZED)
                .json("You must be logged to see your auctions");
        }
        const pageSize = 9;
        let page = req.params.page || 1;
        if (page < 1) {
            page = 1;
        }
        page = parseInt(page);
        const auctions = await Auction
            .find({ auctionOwner: req.user.username })
            .skip((pageSize * page) - pageSize)
            .limit(pageSize);

        const numberOfItems = await Auction
            .countDocuments({ auctionOwner: req.user.username });

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
            return res.status(HttpStatus.UNAUTHORIZED)
                .json("You must be logged to see your observed auctions");
        }
        const observedAuctions = [];
        const usr = await User.findOne({ username: req.user.username });
        if (usr.observedAuctions) {
            for (const id of usr.observedAuctions) {
                const auction = await Auction
                    .find({ $and: [{ _id: id }, { archived: false }, { buyNow: false }] });
                observedAuctions.push(auction);
            }
        }
        return res.json(observedAuctions);
    });

router
    .route("/auctionHistory")
    .get(async (req, res) => {
        if (!req.user) {
            return res.status(HttpStatus.UNAUTHORIZED)
                .json("You must be logged to see your auctions histories");
        }
        let auctions = await Auction.find({});
        auctions = auctions.filter(a => {
            return a.auctionBuyer === req.user.username ||
                a.userPrice.find(u => u.user === req.user.username) !==
                undefined;
        });
        return res.json(auctions);
    });

router
    .route("/buyNow/:auctionId")
    .get(async (req, res) => {
        if (!req.user) {
            return res.status(HttpStatus.UNAUTHORIZED)
                .json("You must be logged to buy product on auction");
        }
        if (!req.params.auctionId) {
            return res.sendStatus(HttpStatus.BAD_REQUEST);
        }
        if (!req.params.auctionId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(
                {
                    errors: {
                        msg: "Wrong id",
                        param: "id",
                        location: "body"
                    }
                });
        }
        const auction = await Auction.findById(req.params.auctionId);
        if (auction.auctionOwner === req.user.username) {
            res.status(HttpStatus.UNAUTHORIZED).json("You can not buy your own auction product.");
        }
        if (auction.archived === true) {
            res.status(HttpStatus.UNAUTHORIZED).json("That auction is no longer available.");
        }
        if (auction && auction.buyNow === true) {
            auction.archived = true;
            auction.auctionBuyer = req.user.username;
            await auction.save();
            return res.sendStatus(HttpStatus.OK);
        } else {
            return res.sendStatus(HttpStatus.NOT_FOUND);
        }
    });

router
    .route("/")
    .post([
        check("currentPrice").exists().withMessage("Price is required."),
        check("currentPrice").isNumeric().withMessage("Price must be a number."),
        check("currentPrice").custom((value) => value > 0).withMessage("Price must be greater than zero."),
        check("buyNow").exists().isBoolean().withMessage("Buy now must be boolean type."),
        check("auctionName").exists().isString().isLength(1).withMessage("Auction name is required.")
    ], async (req, res) => {
        try {
            if (!req.user) {
                return res.sendStatus(HttpStatus.UNAUTHORIZED);
            }
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .json({ errors: errors.array() });
            }
            const { currentPrice, auctionName, endDate, buyNow, description } = req.body;
            const auctionOwner = req.user.username;
            let newAuction;
            if (buyNow === "true" || buyNow === true) {
                newAuction = new Auction({
                    auctionName: auctionName,
                    auctionOwner: auctionOwner,
                    currentPrice: currentPrice,
                    description: description,
                    buyNow: true,
                    archived: false
                });
            } else {
                newAuction = new Auction({
                    auctionName: auctionName,
                    auctionOwner: auctionOwner,
                    currentPrice: currentPrice,
                    description: description,
                    endDate: endDate,
                    buyNow: false,
                    archived: false,
                    userPrice: []
                });
            }
            if (!buyNow) {
                errors = CheckDateErrors(endDate);
            }
            if (errors.length > 0) {
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .json({ errors: errors });
            }
            const auctionSaved = await newAuction.save();
            return res.status(HttpStatus.CREATED).json(auctionSaved);
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json(e.message);
        }
    });

router
    .route("/:auctionId")
    .put([
        check("currentPrice").isNumeric().withMessage("Price must be a number."),
        check("currentPrice").custom((value) => value > 0).withMessage("Price must be greater than zero."),
        check("description").exists().isString().isLength(1),
        check("endDate").exists(),
        check("auctionName").exists().isString().isLength(1).withMessage("Auction name is required.")
    ],
        (req, res) => {
        try {
            if (!req.user) {
                return res.sendStatus(HttpStatus.UNAUTHORIZED);
            }
            if (!req.params.auctionId) {
                return res.sendStatus(HttpStatus.BAD_REQUEST);
            }
            let errors = validationResult(req);
            console.log(errors);
            if (!errors.isEmpty()) {
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
            }
            if (req.currentPrice <= 0) {
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: "Price must be greater than zero" });
            }
            const body = req.body;
            let auctionToUpdate;
            if (!req.params.auctionId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(
                    {
                        errors: {
                            msg: "Wrong id",
                            param: "id",
                            location: "body"
                        }
                    });
            }
            Auction.findById(req.params.auctionId).then(rtn => {
                auctionToUpdate = rtn;
                if (auctionToUpdate) {
                    if (!body.buyNow) {
                        errors = CheckDateErrors(body.endDate, auctionToUpdate);
                    }
                    if (errors.length > 0) {
                        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors });
                    }
                    if (auctionToUpdate.auctionOwner !== req.user.username) {
                        return res.sendStatus(HttpStatus.UNAUTHORIZED);
                    }
                    auctionToUpdate.auctionName = body.auctionName;
                    auctionToUpdate.description = body.description;
                    auctionToUpdate.currentPrice = body.currentPrice;
                    if (body.buyNow === false) {
                        auctionToUpdate.endDate = body.endDate;
                    }
                    auctionToUpdate.save((err, auction) => {
                        if (err) {
                            return res.json(err);
                        }
                        return res.json(auction);
                    });
                } else {
                    return res.sendStatus(HttpStatus.NOT_FOUND);
                }
            });
        } catch (e) {
            return res.json(e.message);
        }
    });

router
    .route("/:auctionId")
    .get(async (req, res) => {
        try {
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
        } catch (e) {
            console.log(e);
        }
    });

module.exports.router = router;

const express = require("express");
const router = express.Router();
const HttpStatus = require("http-status-codes");
const User = require("../models/user");
const Auction = require("../models/auction");
const { check, validationResult } = require("express-validator");

const checkDateErrors = (endDate, auctionToUpdate) => {
    const errors = [];
    if (!Date.parse(endDate)) {
        errors.push({
            msg: "Wrong date format!",
            param: "endDate",
            location: "body"
        });
    }
    if (new Date(endDate).toISOString() < new Date().toISOString()) {
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
};

const checkAuctionData = async (auctions) => {
    for (const a of auctions) {
        console.log(a.auctionName + " :: " + a.endDate + "::" + a.archived);
        if (!a.buyNow && a.endDate.toISOString() < new Date().toISOString() && !a.archived) {
            a.archived = true;
            await a.save();
        }
    }
    return auctions;
};

router
    .route("/pagination/:page")
    .get(async (req, res) => {
        try {
            const pageSize = 10;
            let page = req.params.page || 1;
            if (page < 1) {
                page = 1;
            }
            page = parseInt(page);
            let auctions = await Auction
                .find({ archived: false })
                .skip((pageSize * page) - pageSize)
                .limit(pageSize);

            auctions = await checkAuctionData(auctions);

            auctions.filter(a => !a.archived);

            const numberOfItems = await Auction.countDocuments({ archived: false });
            console.log("AUKCJE ILOSC" + numberOfItems);
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
        } catch (e) {
            console.log(e.message);
        }
    });

router
    .route("/yourAuctions/auctions/:page")
    .get(async (req, res) => {
        try {
            console.log("YOUT AUCTIONS");
            if (!req.user) {
                return res.status(HttpStatus.UNAUTHORIZED)
                    .json("You must be logged to see your auctions");
            }
            const pageSize = 10;
            let page = req.params.page || 1;
            if (page < 1) {
                page = 1;
            }
            page = parseInt(page);
            let auctions = await Auction
                .find({ auctionOwner: req.user.username })
                .skip((pageSize * page) - pageSize)
                .limit(pageSize);

            auctions = await checkAuctionData(auctions);

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
        } catch (e) {
            console.log(e.message);
        }
    });

router
    .route("/observedAuctions")
    .get(async (req, res) => {
        console.log("OBSERVED AUTCION");
        if (!req.user) {
            return res.status(HttpStatus.UNAUTHORIZED)
                .json("You must be logged to see your observed auctions");
        }
        const observedAuctions = [];
        const usr = await User.findOne({ username: req.user.username });
        if (usr.observedAuctions) {
            for (const id of usr.observedAuctions) {
                const auction = await Auction.findOne({ $and: [{ _id: id }, { archived: false }, { buyNow: false }] });
                if (auction && !auction.buyNow && auction.endDate.toISOString() < new Date().toISOString() && !auction.archived) {
                    auction.archived = true;
                    await auction.save();
                } else if (auction) {
                    observedAuctions.push(auction);
                }
            }
        }
        return res.json(observedAuctions);
    });

router
    .route("/auctionHistory/:page")
    .get(async (req, res) => {
        console.log("HISTORIA");
        if (!req.user) {
            return res.status(HttpStatus.UNAUTHORIZED)
                .json("You must be logged to see your auctions histories");
        }
        const pageSize = 10;
        let page = req.params.page || 1;
        if (page < 1) {
            page = 1;
        }
        page = parseInt(page);
        let auctions = await Auction.find({ archived: true });

        auctions = await checkAuctionData(auctions);

        console.log("WSZYSTKIE");
        auctions.forEach(a => console.log(a.auctionName + "::" + a.endDate));
        console.log("WSZYSTKIE");

        auctions = auctions.filter(a => {
            return a.auctionBuyer === req.user.username ||
                a.userPrice.find(u => u.user === req.user.username) !== undefined;
        });

        console.log("WSZYSTKIE2");
        auctions.forEach(a => console.log(a.auctionName + "::" + a.endDate));
        const numberOfItems = auctions.length;
        console.log("WSZYSTKIE2");

        auctions = auctions.slice((pageSize * page) - pageSize);
        auctions = auctions.slice(0, pageSize);

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
        console.log(rtn);
        return res.json(rtn);
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
                    auctionBuyer: "",
                    buyNow: true,
                    archived: false
                });
            } else {
                console.log(endDate);
                newAuction = new Auction({
                    auctionName: auctionName,
                    auctionOwner: auctionOwner,
                    currentPrice: currentPrice,
                    description: description,
                    endDate: new Date(endDate).toISOString(),
                    buyNow: false,
                    auctionBuyer: "",
                    archived: false,
                    userPrice: []
                });
            }
            if (!buyNow) {
                errors = checkDateErrors(endDate);
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
        check("auctionName").exists().isString().isLength(1).withMessage("Auction name is required.")
    ],
    async (req, res) => {
        try {
            if (!req.user) {
                return res.sendStatus(HttpStatus.UNAUTHORIZED);
            }
            if (!req.params.auctionId) {
                return res.sendStatus(HttpStatus.BAD_REQUEST);
            }
            const errors = validationResult(req);
            console.log(errors);
            if (!errors.isEmpty()) {
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
            }
            if (req.currentPrice <= 0) {
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: "Price must be greater than zero" });
            }
            const body = req.body;
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
            const auctionToUpdate = await Auction.findById(req.params.auctionId);
            if (auctionToUpdate) {
                if (errors.length > 0) {
                    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors });
                }
                if (auctionToUpdate.auctionOwner !== req.user.username) {
                    return res.sendStatus(HttpStatus.UNAUTHORIZED);
                }
                auctionToUpdate.auctionName = body.auctionName;
                auctionToUpdate.description = body.description;
                auctionToUpdate.currentPrice = body.currentPrice;
                const auctionInDb = await auctionToUpdate.save();
                return res.json(auctionInDb);
            } else {
                return res.sendStatus(HttpStatus.NOT_FOUND);
            }
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
                if (!rtn.buyNow && rtn.endDate.toISOString() < new Date().toISOString() && !rtn.archived) {
                    console.log(rtn.endDate);
                    rtn.archived = true;
                    await rtn.save();
                }
                return res.json(rtn);
            } else {
                return res.sendStatus(HttpStatus.NOT_FOUND);
            }
        } catch (e) {
            return res.json(e.message);
        }
    });

module.exports.router = router;

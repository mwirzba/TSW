const express = require("express");
const router = express.Router();
const HttpStatus = require("http-status-codes");
const User = require("../models/user");
const Auction = require("../models/auction");
const { check, validationResult } = require("express-validator");

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
    .route("/")
    .post([
        check("currentPrice").exists().withMessage("price is required"),
        check("currentPrice").isNumeric().withMessage("Price must be a number."),
        check("endDate").isAfter("startDate").withMessage("End date must be later than today's"),
        check("auctionName").exists().isString().withMessage("Auction name is requied."),
        check("auctionOwner").exists().isString(),
        check("startDate").isAfter(todayDate).withMessage("Start date must be later than today")
    ], async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.json({ errors: errors.array() });
            }
            const { auctionOwner, currentPrice, auctionName, startDate, endDate } = req.body;
            const newAuctionObj = { auctionOwner, currentPrice, auctionName, startDate, endDate };
            const newAuction = new Auction(newAuctionObj);
            newAuction.save((err, auction) => {
                if (err) {
                    return next(err);
                }
                console.log("TUTAJK3");
                return res.status(HttpStatus.CREATED).json(auction);
            });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json(e.message);
        }
    });

router
    .route("/:auctionName")
    .put([
        check("startDate").isBefore(todayDate).withMessage("You cant edit this auction anymore"),
        check("currentPrice").exists().withMessage("price is required"),
        check("currentPrice").isNumeric().withMessage("Price must be a number."),
        check("endDate").isAfter("startDate").withMessage("End date must be later than today's"),
        check("auctionName").exists().isString().withMessage("Auction name is requied."),
        check("auctionOwner").exists().isString(),
        check("startDate").isBefore("endDate").withMessage("Start date must be before end date")
    ],
    async (req, res) => {
        try {
            const body = req.body;
            const auctionToUpdate = await Auction.find({ auctionName: req.params.auctionName });
            if (!body) {
                return res.sendStatus(HttpStatus.BAD_REQUEST);
            }
            if (auctionToUpdate && auctionToUpdate.startDate < Date.now) {
                return res.sendStatus(HttpStatus.BAD_REQUEST).json("Wrong auction start date");
            }
            if (auctionToUpdate) {
                auctionToUpdate.auctionName = body.auctionName;
                auctionToUpdate.currentPrice = body.currentPrice;
                auctionToUpdate.endDate = body.endDate;
                auctionToUpdate.startDate = body.startDate;
                auctionToUpdate.endDate = body.endDate;
                auctionToUpdate.save((err, auction) => {
                    if (err) {
                        return next(err);
                    }
                    return res.json(HttpStatus.OK, auction);
                });
                return res.json(auctionToUpdate);
            } else {
                return res.sendStatus(HttpStatus.NOT_FOUND);
            }
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json(e.message);
        }
    });

router
    .route("/:auctionName")
    .get(async (req, res) => {
        const rtn = await Auction.find({ auctionName: req.params.auctionName });
        if (rtn) {
            return res.json(rtn);
        } else {
            return res.sendStatus(HttpStatus.NOT_FOUND);
        }
    });

module.exports.router = router;

const express = require("express");
const router = express.Router();
const HttpStatus = require("http-status-codes");
const User = require("../models/user");
const Auction = require("../models/auction");
const Validator = require("../validator/validate");

const rejectMethod = (_req, res, _next) => {
    res.sendStatus(HttpStatus.METHOD_NOT_ALLOWED);
};

router
    .route("/")
    .get(async (req, res) => {
        const rtn = await Auction.find({});
        return res.json(rtn);
    });

router
    .route("/")
    .post(async (req, res) => {
        try {
            const valRule = {
                currentPrice: "required|number",
                endDate: "required|date|after:" + Date.now(),
                auctionName: "required|string",
                auctionOwner: "required|string"
            };

            /*
            Validator(req.body, valRule, {}, (err, status) => {
                if (!status) {
                    res.status(HttpStatus.PRECONDITION_FAILED)
                        .send({
                            success: false,
                            message: "Validation failed",
                            data: err
                        });
                } else {
                    next();
                }
            });*/

            const body = req.body;
            console.log(body);
            const newAuction = new Auction({
                auctionOwner: body.auctionOwner,
                currentPrice: body.currentPrice,
                auctionName: body.auctionName,
                startDate: Date.now(),
                endDate: body.endDate
            });
            newAuction.save((err, auction) => {
                if (err) {
                    return next(err);
                }
                return res.json(HttpStatus.CREATED, auction);
            });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json(e);
        }
    });

router
    .route("/:auctionName")
    .put(async (req, res) => {
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

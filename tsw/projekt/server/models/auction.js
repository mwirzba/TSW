const mongoose = require("../mongoose/index");
const Schema = mongoose.Schema;

const userPriceSchema = new Schema({
    user: { type: String, required: true },
    price: { type: Number, required: true }
});

const auctionSchema = new Schema({
    auctionName: { type: String, required: true },
    auctionOwner: { type: String, required: true },
    auctionBuyer: { type: String, required: false },
    currentPrice: { type: Number, required: true },
    description: { type: String, references: true },
    endDate: { type: Date, required: false },
    buyNow: { type: Boolean, required: true },
    archived: { type: Boolean, required: true },
    userPrice: [userPriceSchema]
});

const Auction = mongoose.model("Auction", auctionSchema);

module.exports = Auction;

const mongoose = require("../mongoose/index");
const Schema = mongoose.Schema;

const auctionSchema = new Schema({
    auctionName: { type: String, required: true },
    auctionOwner: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: true }
});

const Auction = mongoose.model("Auction", auctionSchema);

module.exports = Auction;

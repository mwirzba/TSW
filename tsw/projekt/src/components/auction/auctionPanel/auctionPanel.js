import io from "socket.io-client";
// import _ from "lodash";

export default {
    name: "auctionPanel",
    data () {
        return {
            auctions: [],
            newPrice: null,
            isLogged: this.$store.state.userData.authenticated
        };
    },
    created () {
        this.socket = io("http://localhost:8080", { reconnection: false });
    },
    mounted () {
        if (this.isLogged) {
            this.fetchData();
            this.socket.on("auction", (data) => {
                this.auctions.forEach(a => {
                    if (data.auctionId === a.id) {
                        a.currentPrice = data.newPrice;
                        a.errorPrice = false;
                    }
                });
            });
        }
    },
    methods: {
        fetchData () {
            this.axios.get("http://localhost:8080/auction/observedAuctions")
                .then(rsp => {
                    const data = rsp.data;
                    console.log(data);
                    for (let i = 0; i < data.length; i++) {
                        const auction = {
                            auctionOwner: data[i].auctionOwner,
                            auctionName: data[i].auctionName,
                            currentPrice: data[i].currentPrice,
                            endDate: data[i].endDate,
                            id: data[i]._id,
                            userPrice: data[i].userPrice,
                            description: data[i].description,
                            buyNow: data[i].buyNow,
                            archived: data[i].archived,
                            newPrice: null,
                            errorPrice: false
                        };
                        console.log("auction");
                        this.auctions.push(auction);
                    }
                    console.log(this.auctions);
                })
                .catch(error => {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    }
                });
        },
        onSubmit: function (auction, index) {
            this.auctions[index].errorPrice = !this.isValidPrice(auction.newPrice, auction.currentPrice);
            if (!this.auctions[index].errorPrice) {
                this.socket.emit("auction", {
                    auctionId: auction.id,
                    newPrice: auction.newPrice
                });
            }
        },
        isValidPrice: function (price, currentPrice) {
            return !isNaN(parseFloat(price)) && !isNaN(price - 0) && price > currentPrice;
        },
        beforeDestroy () {
            this.socket.off("auction");
        }
    }
};

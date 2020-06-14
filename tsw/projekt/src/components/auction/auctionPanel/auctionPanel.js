import io from "socket.io-client";
// import _ from "lodash";

export default {
    name: "auctionPanel",
    data () {
        return {
            auctions: [],
            isLogged: this.$store.state.userData.authenticated,
            currentTime: new Date()
        };
    },
    created () {
        this.socket = io("", { reconnection: false });
        setInterval(() => {
            this.currentTime = new Date();
        }, 10000);
    },
    mounted () {
        if (this.$store.state.userData.authenticated) {
            this.fetchData();
            this.socket.on("auction", (data) => {
                this.auctions.forEach(a => {
                    if (data.auctionId === a.id) {
                        if (data.error) {
                            a.errorMsg = true;
                        } else {
                            a.auctionBuyer = data.auctionBuyer;
                            a.currentPrice = data.newPrice;
                            a.errorPrice = false;
                            a.newPrice = parseInt(a.currentPrice) + 1;
                            if (a.auctionBuyer === this.$store.state.userData.username) {
                                a.newPrice = a.currentPrice;
                            }
                        }
                    }
                });
            });
        }
    },
    methods: {
        fetchData () {
            this.axios.get("/auction/observedAuctions")
                .then(rsp => {
                    const data = rsp.data;
                    for (let i = 0; i < data.length; i++) {
                        let userPrice = parseInt(data[i].currentPrice) + 1;
                        let userBid = false;
                        if (data[i].userPrice.filter(u => u.user === this.$store.state.userData.username).length > 0) {
                            userBid = true;
                        }
                        if (data[i].auctionBuyer === this.$store.state.userData.username) {
                            userPrice = data[i].currentPrice;
                        }
                        const auction = {
                            auctionOwner: data[i].auctionOwner,
                            auctionName: data[i].auctionName,
                            auctionBuyer: data[i].auctionBuyer,
                            currentPrice: data[i].currentPrice,
                            endDate: data[i].endDate,
                            id: data[i]._id,
                            description: data[i].description,
                            buyNow: data[i].buyNow,
                            archived: data[i].archived,
                            newPrice: userPrice,
                            errorPrice: false,
                            errorMsg: null,
                            userBid: userBid,
                            endViewDate: this.getDate(data[i].endDate)
                        };
                        this.auctions.push(auction);
                    }
                })
                .catch(error => {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    }
                });
        },
        auctionArchived (endDate) {
            return new Date(endDate) <= this.currentTime;
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
        getDate: function (dateToFormat) {
            const date = new Date(dateToFormat);
            let day = date.getDate();
            if (day < 10) {
                day = "0" + day;
            }
            let month = date.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            let hour = date.getHours();
            if (hour < 10) {
                hour = "0" + hour;
            }
            let minute = date.getMinutes();
            if (minute < 10) {
                minute = "0" + minute;
            }
            const year = date.getFullYear();
            const dateString = day + "/" + month + "/" + year;

            return {
                date: dateString,
                hour: hour,
                minute: minute
            };
        }
    },
    beforeDestroy () {
        this.socket.off("auction");
        this.socket.disconnect();
    },
    computed: {
        userName () {
            return this.$store.state.userData.username;
        }
    }
};

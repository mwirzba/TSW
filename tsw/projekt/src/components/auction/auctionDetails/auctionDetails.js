import io from "socket.io-client";

export default {
    name: "auctionDetails",
    data () {
        return {
            auction: Object,
            newPrice: 0,
            submitted: false,
            errorMess: null,
            userBid: false
        };
    },
    created () {
        this.socket = io("http://localhost:8080", { reconnection: false });
    },
    mounted () {
        if (this.$route.params.id) {
            this.fetchData();
        }
        if (this.$store.state.userData.authenticated) {
            this.socket.on("auction", (data) => {
                if (data.auctionId === this.auction.id) {
                    if (data.error) {
                        this.errorMess = true;
                    } else {
                        this.auction.currentPrice = data.newPrice;
                        this.auction.auctionBuyer = data.auctionBuyer;
                        this.newPrice = this.auction.currentPrice + 1;
                        if (this.auction.auctionBuyer === this.$store.state.userPrice.username) {
                            this.newPrice = this.auction.currentPrice;
                        }
                        this.submitted = false;
                    }
                }
            });
        }
    },
    methods: {
        fetchData () {
            this.axios.get("http://localhost:8080/auction/" + this.$route.params.id)
                .then((rsp) => {
                    this.auction = this.getAuctionData(rsp.data);
                    this.newPrice = this.auction.currentPrice + 1;
                    console.log(this.auction);
                    if (!this.auction.buyNow && this.auction.userPrice.filter(u => u.user === this.$store.state.userData.username).length > 0) {
                        this.userBid = true;
                        this.newPrice = this.auction.currentPrice;
                    }
                }).catch(err => {
                    console.log(err);
                });
        },
        onSubmit () {
            this.submitted = true;
            if (this.auction.buyNow) {
                this.axios.get("http://localhost:8080/auction/buyNow/" + this.auction.id)
                    .then(rsp => {
                        console.log(rsp);
                        this.$router.push({ name: "auctionHistory", params: { page: "1" } }).then();
                    }).catch(err => {
                        console.log(err);
                    });
            } else {
                this.socket.emit("auction", {
                    auctionId: this.auction.id,
                    newPrice: this.newPrice
                });
                this.axios.put("http://localhost:8080/addObservedAuctionToUser",
                    {
                        auctionId: this.auction.id
                    }
                ).then(rsp => {
                }).catch(err => {
                    console.log(err);
                });
            }
        },
        getAuctionData (data) {
            let auction;
            if (data.buyNow) {
                auction = {
                    auctionOwner: data.auctionOwner,
                    auctionName: data.auctionName,
                    currentPrice: data.currentPrice,
                    description: data.description,
                    buyNow: data.buyNow,
                    archived: data.archived,
                    id: data._id
                };
            } else {
                auction = {
                    auctionOwner: data.auctionOwner,
                    auctionName: data.auctionName,
                    currentPrice: data.currentPrice,
                    description: data.description,
                    auctionBuyer: data.auctionBuyer,
                    userPrice: data.userPrice,
                    buyNow: data.buyNow,
                    archived: data.archived,
                    endDate: data.endDate,
                    id: data._id,
                    endViewDate: this.getDate(data.endDate)
                };
            }
            return auction;
        },
        getDate: (dateToFormat) => {
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
        },
        beforeDestroy () {
            this.socket.off("auction");
            this.socket.disconnect();
        }
    },
    computed: {
        inputValid () {
            return !isNaN(parseFloat(this.newPrice)) && !isNaN(this.newPrice - 0) && this.newPrice > this.auction.currentPrice;
        }
    }
};

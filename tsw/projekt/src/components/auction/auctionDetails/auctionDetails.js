import io from "socket.io-client";

export default {
    name: "auctionDetails",
    data () {
        return {
            auction: Object,
            newPrice: 0
        };
    },
    created () {
        this.socket = io("http://localhost:8080");
    },
    mounted () {
        if (this.$route.params.id) {
            this.fetchData();
        }
        if (this.$store.state.userData.authenticated) {
            this.socket.on("auction", (data) => {
                if (data.auctionId === this.$route.params.id) {
                    this.auction.currentPrice = data.newPrice;
                }
            });
        }
    },
    methods: {
        fetchData () {
            this.axios.get("http://localhost:8080/auction/" + this.$route.params.id)
                .then((rsp) => {
                    console.log(rsp.data);
                    this.auction = this.getAuctionData(rsp.data);
                    this.newPrice = this.auction.currentPrice + 1;
                }).catch(err => {
                    console.log(err);
                });
        },
        onSubmit () {
            this.socket.emit("auction", {
                auctionId: this.auctionId,
                newPrice: this.newPrice
            });
            this.axios.put("http://localhost:8080/addObservedAuctionToUser",
                {
                    auctionId: this.auctionId
                }
            )
                .then(rsp => {
                    console.log(rsp);
                }).catch(err => {
                    console.log(err);
                });
        },
        getAuctionData (data) {
            return {
                auctionOwner: data.auctionOwner,
                auctionName: data.auctionName,
                currentPrice: data.currentPrice,
                endDate: data.endDate,
                startDate: data.startDate,
                id: data._id,
                startViewDate: this.getDate(data.startDate),
                endViewDate: this.getDate(data.endDate)
            };
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
        }
    }

};

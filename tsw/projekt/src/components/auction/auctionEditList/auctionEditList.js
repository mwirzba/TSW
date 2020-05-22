export default {
    name: "auctionList",
    data () {
        return {
            auctions: [],
            logged: this.$store.state.logged
        };
    },
    mounted () {
        if (this.logged) {
            this.axios.get("http://localhost:8080/auction/yourAuctions/auctions")
                .then(rsp => {
                    console.log(rsp);
                    for (let i = 0; i < rsp.data.length; i++) {
                        console.log("DAWAJ");
                        const auction = {
                            auctionOwner: rsp.data[i].auctionOwner,
                            auctionName: rsp.data[i].auctionName,
                            currentPrice: rsp.data[i].currentPrice,
                            endDate: rsp.data[i].endDate,
                            startDate: rsp.data[i].startDate,
                            id: rsp.data[i]._id,
                            startViewDate: this.getDate(rsp.data[i].startDate),
                            endViewDate: this.getDate(rsp.data[i].endDate)
                        };
                        this.auctions.push(auction);
                    }
                }).catch(error => {
                    console.log(JSON.stringify(error));
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    }
                    return Promise.reject(error.response);
                });
        }
    },
    methods: {
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

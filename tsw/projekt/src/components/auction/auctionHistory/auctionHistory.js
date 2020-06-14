export default {
    name: "auctionHistory",
    data () {
        return {
            auctions: [],
            paginationInfo: Object,
            userLogin: this.$store.state.userData.username
        };
    },
    mounted () {
        const reqPath = "/auction/auctionHistory/" + this.$router.currentRoute.params.page;
        try {
            this.axios.get(reqPath)
                .then(rsp => {
                    const data = rsp.data;
                    for (let i = 0; i < data.auctions.length; i++) {
                        const auction = {
                            auctionOwner: data.auctions[i].auctionOwner,
                            auctionName: data.auctions[i].auctionName,
                            currentPrice: data.auctions[i].currentPrice,
                            endDate: data.auctions[i].endDate,
                            id: data.auctions[i]._id,
                            endViewDate: this.getDate(data.auctions[i].endDate),
                            userPrice: data.auctions[i].userPrice,
                            description: data.auctions[i].description,
                            buyNow: data.auctions[i].buyNow,
                            archived: data.auctions[i].archived,
                            auctionBuyer: data.auctions[i].auctionBuyer
                        };
                        this.auctions.push(auction);
                    }
                    this.paginationInfo = data.paginationInfo;
                }).catch(error => {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    }
                    console.log(error);
                });
        } catch (e) {
            console.log(e);
        }
    },
    methods: {
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
        },
        onNextPage () {
            if (this.paginationInfo.hasNext !== false) {
                const num = (this.paginationInfo.currentPage + 1).toString();
                const name = "auctionHistory";
                this.$router.push({ name: name, params: { page: num } }).then();
            }
        },
        onPrevPage () {
            if (this.paginationInfo.hasPrevious !== false) {
                const num = (this.paginationInfo.currentPage - 1).toString();
                const name = "auctionHistory";
                this.$router.push({ name: name, params: { page: num } }).then();
            }
        },
        onPageNumber (pageNumber) {
            const name = "auctionHistory";
            if (pageNumber !== this.paginationInfo.currentPage) {
                this.$router.push({ name: name, params: { page: pageNumber } }).then();
            }
        }
    }
};

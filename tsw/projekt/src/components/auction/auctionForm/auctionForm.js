
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export default {
    name: "auctionForm",
    data () {
        return {
            auctionName: null,
            endDate: tomorrow,
            currentPrice: null,
            buyNow: true,
            description: null,
            logged: this.$store.state.userData.authenticated,
            submitted: false
        };
    },
    mounted () {
        if (this.$route.params.id) {
            this.fetchData();
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.auctionName = "";
        this.endDate = tomorrow;
        this.currentPrice = 0;
        next();
    },
    methods: {
        onsubmit: function () {
            const req = this.getReq();
            try {
                this.submitted = true;
                const formValid = this.auctionNameValid && this.descriptionValid && this.currentPriceValid && this.endDateValid;
                if (formValid) {
                    if (this.$route.params.id) {
                        console.log("PUT");
                        this.axios.put("http://localhost:8080/auction/" + this.$route.params.id, req)
                            .then(response => {
                                this.$router.push({ name: "yourAuctions", params: { page: "1" } }).then();
                                console.log(response);
                            })
                            .catch(error => {
                                console.log(error.response);
                            });
                    } else {
                        this.axios.post("http://localhost:8080/auction/", req)
                            .then(response => {
                                this.$router.push({ name: "yourAuctions", params: { page: "1" } }).then();
                                console.log(response);
                            })
                            .catch(error => {
                                console.log(error.response);
                            });
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        fetchData () {
            this.axios.get("http://localhost:8080/auction/" + this.$route.params.id)
                .then((rsp) => {
                    const endDate = Date.parse(rsp.data.endDate);
                    this.auctionName = rsp.data.auctionName;
                    this.currentPrice = rsp.data.currentPrice;
                    this.description = rsp.data.description;
                    this.buyNow = rsp.data.buyNow;
                    if (!this.buyNow) {
                        this.endDate = new Date(endDate);
                    }
                }).catch(err => {
                    console.log(err);
                });
        },
        getReq: function () {
            if (this.buyNow) {
                return {
                    auctionName: this.auctionName,
                    currentPrice: this.currentPrice,
                    buyNow: this.buyNow,
                    description: this.description
                };
            }
            return {
                auctionName: this.auctionName,
                endDate: this.endDate,
                currentPrice: this.currentPrice,
                description: this.description,
                buyNow: this.buyNow
            };
        }
    },
    computed: {
        auctionNameValid () {
            return !!this.auctionName;
        },
        descriptionValid () {
            return !!this.description;
        },
        currentPriceValid () {
            return !isNaN(parseFloat(this.currentPrice)) && !isNaN(this.currentPrice - 0) && this.currentPrice > 0;
        },
        endDateValid () {
            return Date.parse(this.endDate) > Date.now() && !this.$route.params.id;
        }
    }
};

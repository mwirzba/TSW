export default {
    name: "auctionForm",
    data () {
        return {
            auctionName: "",
            auctionOwner: "",
            startDate: new Date(),
            startHour: "",
            startMinute: "",
            endDate: new Date(Date.now()),
            endHour: "",
            endMinute: "",
            currentPrice: 0,
            logged: this.$store.state.logged
        };
    },
    props: {
        id: ""
    },
    created () {
        console.log("elo");
        /* this.auctionName = "";
        this.auctionOwner = "";
        this.startDate = "";
        this.currentPrice = 0;
        this.endDate = ""; */
        if (this.$route.params.id) {
            this.fetchData();
        }
    },
    beforeRouteUpdate (to, from, next) {
        console.log("bofore");
        this.auctionName = "";
        this.auctionOwner = "";
        this.startDate = new Date();
        this.endDate = new Date(Date.now());
        this.currentPrice = 0;
        next();
    },
    methods: {
        onsubmit: function () {
            const req = {
                auctionName: this.auctionName,
                auctionOwner: this.auctionOwner,
                startDate: this.startDate,
                endDate: this.endDate,
                currentPrice: this.currentPrice
            };
            console.log("CLINTED");
            try {
                if (this.$route.params.id) {
                    console.log("PUT");
                    this.axios.put("http://localhost:8080/auction/" + this.$route.params.id, req)
                        .then(response => {
                            console.log(response);
                        })
                        .catch(error => {
                            console.log(error.response);
                        });
                } else {
                    this.axios.post("http://localhost:8080/auction/", req)
                        .then(response => {
                            console.log(response);
                        })
                        .catch(error => {
                            console.log(error.response);
                        });
                }
            } catch (error) {
                console.log(error);
            }
        },
        fetchData () {
            this.axios.get("http://localhost:8080/auction/" + this.id)
                .then((rsp) => {
                    console.log("TUTAJ");
                    const startDate = rsp.data.startDate;
                    const endDate = rsp.data.endDate;
                    this.auctionName = rsp.data.auctionName;
                    this.auctionOwner = rsp.data.auctionOwner;
                    this.currentPrice = rsp.data.currentPrice;
                    this.startDate = new Date(startDate);
                    this.endDate = new Date(endDate);
                    this.startHour = this.startDate.getHours();
                    this.startMinute = this.startDate.getMinutes();
                    this.endHour = this.endDate.getHours();
                    this.endMinute = this.endDate.getMinutes();
                    console.log(this.startDate);
                }).catch(err => {
                    console.log(err);
                });
        }
    }
};

import io from "socket.io-client";
// import _ from "lodash";

export default {
    name: "auctionPanel",
    data () {
        return {
            auctions: [],
            newPrice: "",
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
                    console.log("WOWOWOLANIE");
                    if (data.auctionId === a._id) {
                        a.currentPrice = data.newPrice;
                    }
                });
            });
        }
    },
    methods: {
        fetchData () {
            this.axios.get("http://localhost:8080/auction/observedAuctions")
                .then(rsp => {
                    console.log(rsp);
                    this.auctions = rsp.data;
                })
                .catch(error => {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    }
                });
        },
        onSubmit: function (id) {
            this.socket.emit("auction", {
                auctionId: id,
                newPrice: this.newPrice
            });
        },
        beforeDestroy () {
            this.socket.off("auction");
        }
    }
};

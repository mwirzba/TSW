import io from "socket.io-client";

export default {
    name: "auctionDetails",
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
            auctionId: "",
            newPrice: ""
        };
    },
    created () {
        this.socket = io("http://localhost:8080");
    },
    mounted () {
        if (this.$route.params.id) {
            this.fetchData();
        }
        if (this.$store.state.logged) {
            this.socket.on("auction", (data) => {
                if (data.auctionId === this.$route.params.id) {
                    this.currentPrice = data.newPrice;
                }
            });
        }
    },
    methods: {
        fetchData () {
            this.axios.get("http://localhost:8080/auction/" + this.$route.params.id)
                .then((rsp) => {
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
                    this.auctionId = rsp.data._id;
                    this.newPrice = this.currentPrice + 1;
                    console.log(this.startDate);
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
        }
    }

};

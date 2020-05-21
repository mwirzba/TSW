export default {
    name: "auctionForm",
    data () {
        return {
            auctionName: "",
            auctionOwner: "",
            startDate: "",
            endDate: "",
            currentPrice: 0,
            logged: this.$store.state.logged
        };
    },
    props: {
        editMode: false,
        auctionId: ""
    },
    mounted () {
        if (this.editMode) {
            this.axios.get("http://localhost:8080/auction/" + this.auctionId)
                .then(function (rsp) {
                    this.auctionName = rsp.auctionName;
                    this.auctionOwner = rsp.auctionOwner;
                    this.startDate = rsp.startDate;
                    console.log(rsp.data.errors);
                }).catch(err => {
                    console.log(err);
                });
        }
    },
    methods: {
        onsubmit: async function () {
            const req = {
                auctionName: this.auctionName,
                auctionOwner: this.auctionOwner,
                startDate: this.startDate,
                endDate: this.endDate,
                currentPrice: this.currentPrice
            };
            console.log("CLINTED");
            try {
                const rsp = await this.axios.post("http://localhost:8080/auction/", req);
                console.log(rsp);
            } catch (error) {
                console.log(error);
            }
        }
    }
};

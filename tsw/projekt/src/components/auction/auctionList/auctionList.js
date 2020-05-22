export default {
    name: "auctionList",
    data () {
        return {
            auctions: []
        };
    },
    mounted () {
        this.axios.get("http://localhost:8080/auction")
            .then(rsp => {
                console.log(rsp.data);
                for (let i = 0; i < rsp.data.length; i++) {
                    console.log("DAWAJ");
                    const auction = {
                        auctionOwner: rsp.data[i].auctionOwner,
                        currentPrice: rsp.data[i].currentPrice,
                        endDate: this.getDate(rsp.data[i].endDate),
                        startDate: this.getDate(rsp.data[i].startDate)
                    };
                    this.auctions.push(auction);
                }
            }).catch(error => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
                return Promise.reject(error.response);
            });
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
            const year = date.getFullYear();
            return day + "/" + month + "/" + year;
        }
    }
};

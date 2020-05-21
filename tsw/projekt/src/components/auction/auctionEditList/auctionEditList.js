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
            this.axios.get("http://localhost:8080/auction/yourAuctions")
                .then(rsp => {
                    console.log(rsp);
                    this.auctions = rsp.data;
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
    }
};

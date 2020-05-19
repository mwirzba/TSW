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
                // console.log(rsp);
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
};

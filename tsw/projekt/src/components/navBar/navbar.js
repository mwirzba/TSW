import io from "socket.io-client";

export default {
    name: "Navbar",
    created () {
        this.socket = io("http://localhost:8080");
    },
    mounted () {
        this.loginMode = this.axios.get("http://localhost:8080/authorization/isLogged")
            .then(res => {
                this.$store.state.logged = res.data;
                console.log();
            }).catch(err => {
                console.log("Error:" + err);
            });
    },
    methods: {
        logOut: function () {
            this.socket.emit("exitFromChat", {
                left: true
            });
            this.axios.get("http://localhost:8080/authorization/logout").then((resp) => {
                this.$store.state.logged = false;
                this.$store.state.currentUserName = "";
                if (this.$route.name !== "auctions") {
                    this.$router.push({ name: "auctions", query: { redirect: "/auctions" } }).then();
                }
            }).catch(err => {
                console.log(err);
            });
        }
    },
    computed: {
        logged: {
            get () {
                return this.$store.state.logged;
            },
            set (newValue) {
                return newValue;
            }
        }
    }
};

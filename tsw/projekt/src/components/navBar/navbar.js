import io from "socket.io-client";

export default {
    name: "Navbar",
    created () {
        this.socket = io("http://localhost:8080", { reconnection: false });
        this.$store.commit("retrieveUserData");
    },
    mounted () {
        this.axios.get("http://localhost:8080/authorization/isLogged")
            .then(res => {
                this.$store.state.userData.authenticated = res.data;
                console.log();
            }).catch(err => {
                console.log("Error:" + err);
            });
    },
    methods: {
        logOut: function () {
            this.socket.emit("usersList", {
                left: true,
                username: this.$store.state.userData.username
            });
            this.axios.get("http://localhost:8080/authorization/logout").then((resp) => {
                const userData = {
                    authenticated: false,
                    username: ""
                };
                this.$store.commit("setUserData", userData);
                if (this.$route.name !== "auctionsByPage") {
                    this.$router.push({ name: "auctionsByPage", params: { page: "1" } }).then();
                }
            }).catch(err => {
                console.log(err);
            });
        },
        toogleNavbar: function () {
            const x = document.getElementById("navbar-container");
            if (x.className === "navbar-container") {
                x.className += " responsive";
            } else {
                x.className = "navbar-container";
            }
        }
    },
    computed: {
        logged: {
            get () {
                return this.$store.state.userData.authenticated;
            },
            set (newValue) {
                return newValue;
            }
        }
    }
};

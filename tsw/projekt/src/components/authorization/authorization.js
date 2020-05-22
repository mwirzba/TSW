
export default {
    name: "authorization",
    data () {
        return {
            username: "",
            password: "",
            logged: this.$store.state.logged,
            loginMode: true
        };
    },
    mounted () {
        console.log("MOUNTED");
        this.loginMode = this.$router.currentRoute.name === "login";
    },
    methods: {
        onLogin: function () {
            const req = {
                username: this.username,
                password: this.password
            };
            console.log(req);

            this.axios.post("http://localhost:8080/authorization/login", req)
                .then(response => {
                    console.log(response);
                    this.$store.state.logged = response.data.isLogged;
                    this.$store.state.currentUserName = response.data.username;
                    this.$router.push({ name: "auctions", query: { redirect: "/auctions" } });
                })
                .catch(error => {
                    console.log(error.response);
                });
        },
        onRegister: function () {
            const req = {
                username: this.username,
                password: this.password
            };
            console.log(req);

            this.axios.post("http://localhost:8080/authorization/register", req)
                .then(response => {
                    console.log(response);
                    this.$router.push({ name: "login", query: { redirect: "/login" } });
                })
                .catch(error => {
                    console.log(error.response);
                });
        },
        onsubmit: function () {
            const self = this;
            if (this.$router.currentRoute.name === "login") {
                self.onLogin();
            } else {
                self.onRegister();
            }
            console.log("KLIKNIETO");
        },
        onSend: function () {
            this.axios.get("http://localhost:8080/home").then((rsp) => {
                console.log(rsp);
            });
        }
    }
};

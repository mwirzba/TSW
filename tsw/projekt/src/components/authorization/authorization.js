
export default {
    name: "authorization",
    data () {
        return {
            username: "",
            password: "",
            logged: this.$store.state.userData.authenticated,
            loginMode: true,
            submitted: false,
            wrongLogin: false
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
            this.axios.post("http://localhost:8080/authorization/login", req)
                .then(response => {
                    console.log(response);
                    const userData = {
                        authenticated: response.data.isLogged,
                        username: response.data.username
                    };
                    this.$store.commit("setUserData", userData);
                    this.$router.push({ name: "auctionsByPage", params: { page: "1" } }).then();
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
            this.axios.post("http://localhost:8080/authorization/register", req)
                .then(response => {
                    console.log(response);
                    this.$router.push({ name: "login", query: { redirect: "/login" } });
                })
                .catch(error => {
                    console.log(error.response);
                    if (error.status === 401) {
                        this.wrongLogin = true;
                    }
                });
        },
        onsubmit: function () {
            this.submitted = true;
            const formIsValid = this.loginValid && this.passwordValid;
            if (formIsValid) {
                const self = this;
                if (this.$router.currentRoute.name === "login") {
                    self.onLogin();
                } else {
                    self.onRegister();
                }
            }
        },
        onSend: function () {
            this.axios.get("http://localhost:8080/home").then((rsp) => {
                console.log(rsp);
            });
        }
    },
    computed: {
        loginValid () {
            return !!this.username;
        },
        passwordValid () {
            return !!this.password;
        },
        loginDataValid () {
            return this.wrongLogin && !this.passwordValid && !this.loginValid;
        }
    }
};

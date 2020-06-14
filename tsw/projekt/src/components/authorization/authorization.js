
export default {
    name: "authorization",
    data () {
        return {
            username: "",
            password: "",
            logged: this.$store.state.userData.authenticated,
            loginMode: true,
            submitted: false,
            invalidLogin: false,
            errorMsg: ""
        };
    },
    mounted () {
        this.loginMode = this.$router.currentRoute.name === "login";
    },
    methods: {
        onLogin: function () {
            const req = {
                username: this.username,
                password: this.password
            };
            this.axios.post("/authorization/login", req)
                .then(response => {
                    const userData = {
                        authenticated: response.data.isLogged,
                        username: response.data.username
                    };
                    this.$store.commit("setUserData", userData);
                    this.$router.push({ name: "auctionsByPage", params: { page: "1" } }).then();
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        this.errorMsg = "Zły login albo hasło.";
                        this.invalidLogin = true;
                    }
                });
        },
        onRegister: function () {
            const req = {
                username: this.username,
                password: this.password
            };
            this.axios.post("/authorization/register", req)
                .then(response => {
                    this.$router.push({ name: "login", query: { redirect: "/login" } });
                })
                .catch(error => {
                    console.log(error.response);
                    if (error.response.status === 400) {
                        this.invalidLogin = true;
                        this.errorMsg = "Login jest już używany.";
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
            this.axios.get("/home").then((rsp) => {
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
            return !this.invalidLogin;
        }
    }
};

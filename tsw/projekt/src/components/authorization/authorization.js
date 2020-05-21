
export default {
    name: "authorization",
    props: {
        loginMode: true
    },
    data () {
        return {
            username: "",
            password: "",
            logged: this.$store.state.logged
        };
    },
    mounted () {
        console.log(this.loginMode);
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
                    this.$store.state.logged = true;
                    this.$store.state.currentUserName = req.username;
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
                })
                .catch(error => {
                    console.log(error.response);
                });
        },
        onsubmit: function () {
            const self = this;
            if (self.loginMode === true) {
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


export default {
    name: "authorization",
    props: {
        loginMode: true
    },
    data () {
        return {
            username: "",
            password: ""
        };
    },
    created () {
        /* this.loginMode = this.axios.get("http://localhost:8080/authorization/isLogged")
            .then(res => {
                this.loginMode = res;
            }).catch(err => {
                console.log(err);
            }); */
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
                })
                .catch(error => {
                    console.log(error.response);
                });
        },
        onRegister () {
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
        onsubmit () {
            const self = this;
            if (self.loginMode === true) {
                self.onLogin();
            } else {
                self.onRegister();
            }
            console.log("KLIKNIETO");
        },
        onSend () {
            this.axios.get("http://localhost:8080/home").then((rsp) => {
                console.log(rsp);
            });
        }
    }
};

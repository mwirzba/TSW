export default {
    name: "Navbar",
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
        logOut () {
            this.axios.get("http://localhost:8080/authorization/logout").then((resp) => {
                this.$store.state.logged = false;
                this.$store.state.currentUserName = "";
            }
            ).catch(err => {
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

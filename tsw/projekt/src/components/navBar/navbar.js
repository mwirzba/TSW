export default {
    name: "Navbar",
    mounted () {
        console.log("TUTAJ");
        this.loginMode = this.axios.get("http://localhost:8080/authorization/isLogged")
            .then(res => {
                this.$store.state.logged = res;
                console.log();
            }).catch(err => {
                console.log("bald" + err);
            });
    },
    methods: {
        logOut () {
            this.axios.get("http://localhost:8080/authorization/logout").then((resp) => {
                this.$store.state.logged = false;
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

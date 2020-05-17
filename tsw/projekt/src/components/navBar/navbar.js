export default {
    name: "Navbar",
    data () {
        return {
            loginMode: true
        };
    },
    created () {
        console.log("TUTAJ");
        this.loginMode = this.axios.get("http://localhost:8080/authorization/isLogged")
            .then(res => {
                this.loginMode = res;
            }).catch(err => {
                console.log(err);
            });
    }
};

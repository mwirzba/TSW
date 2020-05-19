import io from "socket.io-client";
export default {

    name: "chat",
    data () {
        return {
            message: "",
            userToSend: "",
            messages: []
        };
    },
    created () {
        this.socket = io("http://localhost:8080");
    },
    methods: {
        onSend () {
            console.log("ELO");
            this.socket.emit("chat", {
                destinationUser: this.userToSend,
                message: this.message
            });
            this.message = "";
        }
    },
    mounted () {
        this.socket.on("chat", (msg) => {
            this.messages.push(msg);
        });
    }
};

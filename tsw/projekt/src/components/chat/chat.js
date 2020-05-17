
export default {
    name: "chat",
    data () {
        return {
            message: "",
            messages: []
        };
    },
    sockets: {
        connect () {
            console.log("socket-connected");
        }
    },
    methods: {
        onSend () {
            this.$socket.client.emit("chat", this.message);
            this.message = "";
        }
    },
    mounted () {
        this.$socket.client.on("chat", (msg) => {
            this.messages.push(msg);
        });
    }
};

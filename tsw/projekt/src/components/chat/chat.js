
import io from "socket.io-client";

export default {
    name: "chat",
    data () {
        return {
            message: "",
            userToSend: "",
            messages: [],
            usersList: [],
            newMessages: [],
            selectUserIndex: ""
        };
    },
    created () {
        this.socket = io.connect("");
    },
    mounted () {
        this.socket.on("usersList", (users) => {
            this.usersList = users.filter(u => u.username !== this.$store.state.userData.username);
        });
        this.socket.on("chat", (msg) => {
            this.messages.push(msg);
            this.scrollToEnd();
        });
        this.socket.on("userJoined", () => {
            this.socket.emit("usersList");
        });
        this.socket.on("userLeft", () => {
            this.socket.emit("usersList");
        });
        this.socket.emit("userJoined");
        this.axios.put("/chat/newMessages")
            .then(messages => {
                this.messages = messages.data;
            }).catch(err => console.log(err));
    },
    methods: {
        onSend: function () {
            if (this.message !== "" && this.userToSend !== "") {
                this.socket.emit("chat", {
                    destinationUser: this.userToSend,
                    message: this.message
                });
                this.messages.push({
                    sendingUser: this.$store.state.userData.username,
                    message: this.message
                });
                this.scrollToEnd();
                this.message = "";
            }
        },
        scrollToEnd () {
            setTimeout(() => {
                const container = this.$el.querySelector(".chat");
                if (container !== null) {
                    container.scrollTop = container.scrollHeight;
                }
            }, 200);
        },
        onUserSelected: function (event) {
            this.userToSend = event.target.value;
            this.axios.get("/chat/" + this.userToSend).then(chats => {
                this.messages = [];
                if (chats.data) {
                    chats.data.messages.forEach(m => {
                        this.messages.push({
                            sendingUser: m.sendingUser,
                            message: m.message
                        });
                    });
                    this.scrollToEnd();
                }
            }).catch(err => console.log(err));
        }
    },
    beforeDestroy () {
        this.socket.off("usersList");
        this.socket.off("chat");
        this.socket.emit("userLeft");
        // this.socket.emit("usersList");
        this.socket.disconnect();
    }
};

// import io from "socket.io-client";
// import Vue from "vue";

import io from "socket.io-client";
// const socket = io.connect("http://localhost:8080");

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
        this.socket = io.connect("http://localhost:8080", { reconnection: false });
    },
    methods: {
        onSend: function () {
            console.log("ELO");
            if (this.message !== "") {
                this.socket.emit("chat", {
                    destinationUser: this.userToSend,
                    message: this.message
                });
                console.log(this.$store.state.username);
                this.messages.push({
                    sendingUser: this.$store.state.userData.username,
                    message: this.message
                });
                this.scrollToEnd();
                this.message = "";
            }
        },
        scrollToEnd () {
            const container = document.querySelector(".chat-list");
            if (container !== null) {
                container.scrollTop = container.scrollHeight;
            }
        },
        onUserSelected: function (event) {
            console.log("WYWOwolano");
            // this.userToSend = this.usersList[index].username;
            this.userToSend = event.target.value;
            this.axios.get("http://localhost:8080/chat/" + this.userToSend).then(chats => {
                console.log(chats);
                this.messages = [];
                chats.data.messages.forEach(m => {
                    this.messages.push({
                        sendingUser: m.sendingUser,
                        message: m.message
                    });
                });
                console.log(this.messages);
            }).catch(err => console.log(err));
        }
    },
    mounted () {
        this.socket.on("usersList", (users) => {
            console.log(users);
            this.usersList = users.filter(u => u.username !== this.$store.state.userData.username);
        });
        this.socket.on("chat", (msg) => {
            this.messages.push(msg);
            this.scrollToEnd();
        });
        this.socket.emit("usersList", {
            left: false
        });
        this.axios.put("http://localhost:8080/chat/newMessages")
            .then(messages => {
                console.log("nowe wiadomosci");
                console.log(messages.data);
                console.log(messages.data.length);
                this.messages = messages.data;
            }).catch(err => console.log(err));
    },
    beforeDestroy () {
        console.log("DESTROYED");
        this.socket.off("usersList");
        this.socket.off("chat");
        this.socket.emit("usersList", {
            left: true,
            username: this.$store.state.userData.username
        });
    }
};

import io from "socket.io-client";
// import Vue from "vue";

export default {

    name: "chat",
    data () {
        return {
            message: "",
            userToSend: "",
            messages: [],
            usersList: [],
            selectUserIndex: ""
        };
    },
    created () {
        console.log("STWORZONO");
        this.socket = io("http://localhost:8080");
        this.socket.on("chat", (msg) => {
            console.log("DOSZLA");
            this.messages.push(msg);
        });
        this.socket.on("usersList", (users) => {
            console.log(this.$store.state.currentUserName);
            console.log("ODSWIERZONO LISTE");
            this.usersList = users.filter(u => u.username !== this.$store.state.currentUserName);
        });
        /* this.socket.on("newMessages", (res) => {
            res.forEach(msg => {
                const index = this.usersList.findIndex(u => u.username === msg.username);
                if (index !== -1) {
                    this.usersList[index].newMessages = msg.newMessages;
                }
            });
        }); */
    },
    methods: {
        onSend: function () {
            console.log("ELO");
            if (this.message !== "") {
                this.socket.emit("chat", {
                    destinationUser: this.userToSend,
                    message: this.message
                });
                this.message = "";
            }
        },

        onUserSelected: async function (index) {
            this.userToSend = this.usersList[index].username;
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
        this.socket.emit("usersList", {
            left: false
        });
    },
    beforeDestroy () {
        this.socket.emit("usersList", {
            left: true,
            username: this.$store.state.currentUserName
        });
    },
    computed: {
        changedColor: function () {
            return this.width;
        }
    }

    /*
    computed: {
        usersListComputed: {
            get: function () {
                return this.usersList;
            },
            set: function (newValue) {
                this.usersList = newValue;
                console.log(this.usersList);
            }
        }
    } */
};

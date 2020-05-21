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
            this.usersList = users;
        });
        /*
        this.socket.on("chatSelected", (chats) => {
            this.messages = [];
            chats.messages.forEach(c => {
                this.messages.push([c.sendingUser + ":" + c.message]);
            });
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
            this.axios.get("http://localhost:8080/chat/").then(chats => {
                this.messages = [];
                chats.data.messages.forEach(c => {
                    this.messages.push([c.sendingUser + ":" + c.message]);
                });
                this.userToSend = this.usersList[index].username;
                console.log("SKONCZONO");
            }).catch(err => console.log(err));
        }
    },
    mounted () {
        this.socket.emit("usersList");
    },
    computed: {
        changedColor: function () {
            return this.width;
        }
    },
    beforeDestroy () {
        this.socket.emit("disconnect");
        //  this.socket.emit("usersList");
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

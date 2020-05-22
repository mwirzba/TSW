import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import { store } from "./store/store";
// import VueSocketIO from "vue-socket.io";
// import SocketIO from "socket.io-client";

// export const SocketInstance = SocketIO("http://localhost:8080");

// Vue.use(VueSocketIO, SocketInstance);

const axiosOpt = axios.create({
    withCredentials: true
});

Vue.use(VueAxios, axiosOpt);
Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: function (h) {
        return h(App);
    }
}).$mount("#app");

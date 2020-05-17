import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";
import { store } from "./store/store";

const socket = io("http://localhost:8080");

Vue.use(VueSocketIOExt, socket);

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

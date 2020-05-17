import Vue from "vue";
import VueRouter from "vue-router";
import Authorization from "../components/authorization/authorization.vue";
import Chat from "../components/chat/chat.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/about",
        name: "About",
        component: function () {
            return import(/* webpackChunkName: "about" */ "../views/About.vue");
        }
    },
    {
        path: "/login",
        name: "login",
        props: true,
        component: Authorization
    },
    {
        path: "/register",
        name: "register",
        props: true,
        component: Authorization
    },
    {
        path: "/chat",
        name: "chat",
        component: Chat
    }
];

const router = new VueRouter({
    routes
});

export default router;

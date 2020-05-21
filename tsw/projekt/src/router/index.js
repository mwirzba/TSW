import Vue from "vue";
import VueRouter from "vue-router";
import Authorization from "../components/authorization/authorization.vue";
import Chat from "../components/chat/chat.vue";
import AutionList from "../components/auction/auctionList/auctionList.vue";
import AutionForm from "../components/auction/auctionForm/auctionForm.vue";
import AutionEditList from "../components/auction/auctionEditList/auctionEditList.vue";

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
    },
    {
        path: "/auctions",
        name: "auctions",
        component: AutionList
    },
    {
        path: "/auctions/new",
        name: "newAuction",
        component: AutionForm
    },
    {
        path: "/auctions/yourAuctions",
        name: "yourAuctions",
        component: AutionEditList
    },
    {
        path: "/auctions/yourAuctions/:id",
        name: "editAuction",
        component: AutionForm,
        props: true
    }
];

const router = new VueRouter({
    routes
});

export default router;

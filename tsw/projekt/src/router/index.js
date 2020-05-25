import Vue from "vue";
import VueRouter from "vue-router";
import Authorization from "../components/authorization/authorization.vue";
import Chat from "../components/chat/chat.vue";
import AutionList from "../components/auction/auctionList/auctionList.vue";
import AutionForm from "../components/auction/auctionForm/auctionForm.vue";
import AuctionDetails from "../components/auction/auctionDetails/auctionDetails.vue";
import AuctionPanel from "../components/auction/auctionPanel/auctionPanel.vue";
import AuctionHistory from "../components/auction/auctionHistory/auctionHistory.vue";

import { store } from "../store/store";

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
        component: Chat,
        meta: { requiresLogin: true }
    },
    {
        path: "/auctions",
        name: "auctions",
        component: AutionList
    },
    {
        path: "/auctions/new",
        name: "newAuction",
        component: AutionForm,
        meta: { requiresLogin: true }
    },
    {
        path: "/auctions/yourAuctions/pagination/:page",
        name: "yourAuctions",
        component: AutionList,
        meta: { requiresLogin: true }
    },
    {
        path: "/auctions/yourAuctions/:id",
        name: "editAuction",
        component: AutionForm,
        meta: { requiresLogin: true }
    },
    {
        path: "/auctions/:id",
        name: "auctionDetails",
        component: AuctionDetails
    },
    {
        path: "/auctions/pagination/:page",
        name: "auctionsByPage",
        component: AutionList
    },
    {
        path: "/auctions/auctionsPanel",
        name: "auctionsPanel",
        component: AuctionPanel,
        meta: { requiresLogin: true }
    },
    {
        path: "/auctions/auctionHistory/:page",
        name: "auctionHistory",
        component: AuctionHistory,
        meta: { requiresLogin: true }
    }
];

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    store.commit("retrieveUserData");
    if (to.matched.some(record => record.meta.requiresLogin)) {
        console.log(store.state.userData);
        console.log("TUTAJ ROUTE");
        if (store.state.userData.authenticated === false) {
            next({
                path: "/login",
                query: { redirect: to.fullPath }
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        userData: {
            authenticated: false,
            username: ""
        }
    },
    mutations: {
        setUserData (state, userData) {
            state.userData = userData;
        }
    },
    getters: {

    },
    actions: {
        async retrieveUserData (context) {
            try {
                const rsp = await Vue.axios.get("http://localhost:8080/authorization/userState");
                const userData = rsp.data;
                context.commit("setUserData", userData);
            } catch (e) {
                console.log(e.message);
            }
        }
    }
});

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
        },
        retrieveUserData (state) {
            if (localStorage.getItem("store")) {
                Vue.axios.get("http://localhost:8080/authorization/userState")
                    .then(rsp => {
                        state.userData = rsp.data;
                    });
            }
        }
    },
    getters: {

    }
});

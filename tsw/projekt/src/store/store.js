import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        userData: {
            authenticated: false,
            currentUserName: ""
        }
    },
    mutations: {
        setUserData (state, userData) {
            state.userData = userData;
            localStorage.setItem("store", JSON.stringify(state));
        },
        retrieveUserData (state) {
            console.log("PROBA WCZYTANIA");
            if (localStorage.getItem("store")) {
                this.replaceState(
                    Object.assign(state, JSON.parse(localStorage.getItem("store")))
                );
            }
        }
    },
    getters: {

    }
});

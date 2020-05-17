import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        logged: false
    },
    getters: {
        logged: (state) => {
            return state.logged;
        }
    }
});

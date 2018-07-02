import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
/* eslint-disable comma-dangle */
const store = {
  modules: {
    splitter: {
      namespaced: true,
      state: {
        open: false
      },
      mutations: {
        /* eslint-disable no-param-reassign */
        toggle(state, shouldOpen) {
          if (typeof shouldOpen === 'boolean') {
            state.open = shouldOpen;
          } else {
            state.open = !state.open;
          }
        }
      }
    }
  }
};
export default new Vuex.Store(store);

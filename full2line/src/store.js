import Vue from 'vue';
import Vuex from 'vuex';
import { Mute, Getter } from '@/modules/mutation';

Vue.use(Vuex);
export default new Vuex.Store({
  /**
   * interface : 通信I/F
   * sensor : Aセンサ
   * lint : 系統
   * item : 器具
   */
  state: {
    current: {},
    interfaces: [],
  },
  mutations: {
    ...Mute,
  },
  getters: {
    ...Getter,
  },
});

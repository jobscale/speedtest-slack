import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  /**
   * interface : 通信I/F
   * sensor : Aセンサ
   * lint : 系統
   * item : 器具
   */
  state: {
    interfaces: [ // max ?
      {
        name: 'interface',
        sensors: [ // max ?
          {
            name: 'sensor',
            lines: [ // const 4
              {
                items: [ // max 64
                  {
                    name: 'item',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  /* eslint no-param-reassign: ["error", { "props": false }] */
  mutations: {
    clear(state) {
      state.interfaces = [];
    },
    addInterface(state, id, name) {
      state.interfaces[id] = {
        name,
        sensors: [],
      };
    },
    addSensor(state, params) {
      state.interfaces[params.id].sensors[params.sensor] = {
        name,
        lines: [
          { items: [] },
        ],
      };
    },
    addItem(state, params) {
      if (state.interfaces[params.id].sensors[params.sensor].lines[params.line].items.length > 63) {
        throw new Error('items over 64');
      }
      state.interfaces[params.id].sensors[params.sensor].lines[params.line].items[params.item] = {
        name: params.name,
      };
    },
    removeItem(state, params) {
      delete
      state.interfaces[params.id].sensors[params.sensor].lines[params.line].items[params.item];
    },
  },
});

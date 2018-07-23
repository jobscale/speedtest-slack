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
  mutations: {
    clear() {
      this.state = {
        interfaces: [],
      };
    },
    addInterface(id, name) {
      this.state.interfaces[id] = {
        name,
        sensors: [],
      };
    },
    addSensor(id, sensor, name) {
      this.state.interfaces[id].sensors[sensor] = {
        name,
        lines: [
          { items: [] },
          { items: [] },
          { items: [] },
          { items: [] },
        ],
      };
    },
    addItem(id, sensor, line, item, name) {
      if (this.state.interfaces[id].sensors[sensor].lines[line].items.length > 63) {
        throw new Error('items over 64');
      }
      this.state.interfaces[id].sensors[sensor].lines[line].items[item] = {
        name,
      };
    },
    removeItem(id, sensor, line, item) {
      if (this.state.interfaces[id].sensors[sensor].lines[line].items.length > 63) {
        throw new Error('items over 64');
      }
      delete this.state.interfaces[id].sensors[sensor].lines[line].items[item];
    },
  },
});

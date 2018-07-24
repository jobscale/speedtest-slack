import Vue from 'vue';
import Vuex from 'vuex';
import { Mute } from '@/modules/mutation';

Vue.use(Vuex);
export default new Vuex.Store({
  /**
   * interface : 通信I/F
   * sensor : Aセンサ
   * lint : 系統
   * item : 器具
   */
  state: {
    interfaces: [ // maxInterface
      {
        id: 1,
        name: 'interface',
        sensors: [ // maxSensor
          {
            id: 1,
            name: 'sensor',
            lines: [ // maxLine
              {
                id: 1,
                items: [ // maxItem
                  {
                    id: 1,
                    name: 'item',
                    macAddress: 'm-a-c-a-d-d-r-e-s-s',
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
    ...Mute,
  },
});

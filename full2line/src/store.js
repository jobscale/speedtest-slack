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
    current: {
      idInterface: 1,
      idSensor: 1,
      idLine: 1,
      nameCSV: 'Aチーム用',
    },
    interfaces: [ // maxInterface
      {
        id: 1,
        name: 'interface',
        macAddress: 'm-a-c-a-d-d-r-e-s-s',
        sensors: [ // maxSensor
          {
            lux: 1000, // 輝度計測
            id: 1,
            name: 'sensor',
            lines: [ // maxLine
              {
                torque: { // 出力輝度設定
                  set: 700,
                  min: 20,
                  max: 80,
                },
                color: 90,
                id: 1,
                circuit: 1, // 調光回路ID
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
  getters: {
    ...Getter,
  },
});

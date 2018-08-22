import { Util as u, mixin } from '@/modules/util';

export default {
  mixins: [mixin],
  data() {
    return {
      sensors: [],
      isProcessing: false,
      isTips: false,
    };
  },
  created() {
    this.findingSensor();
  },
  methods: {
    findingSensor() {
      this.isTips = true;
      u.blue.findingSensor()
      .then(sensor => this.foundSensor(sensor));
    },
    stopFind() {
      u.blue.cancelFindingSensor();
      this.isTips = false;
    },
    foundSensor(sensor) {
      u.logger.info('found sensor', sensor);
      this.sensors.length = 0;
      this.sensors.push(sensor);
      const sensors = this.$store.getters.getData.sensors;
      let obj;
      this.$store.commit('setSensor', obj = {
        idSensor: sensors.length + 1,
        freqCh: sensor.freqCh,
        macAddress: sensor.id,
      });
      u.logger.info(obj);
      this.isTips = false;
      this.$emit('push-page', 'Sensor');
    },
  },
};

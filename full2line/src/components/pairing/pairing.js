import { Util as u } from '@/modules/util';

export default {
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
    translate: u.translate,
    close() {
      this.$emit('pop-page');
    },
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
      this.isTips = false;
    },
  },
};

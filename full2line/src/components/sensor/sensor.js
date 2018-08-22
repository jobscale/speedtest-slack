import { mixin } from '@/modules/util';

export default {
  mixins: [mixin],
  data() {
    return {
      sensor: {},
    };
  },
  created() {
    const sensors = this.$store.getters.getData.sensors;
    this.sensor = sensors[sensors.length - 1];
  },
};

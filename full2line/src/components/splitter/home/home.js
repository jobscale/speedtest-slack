import { Util as u } from '@/modules/util';

export default {
  props: ['toggle'],
  data() {
    return {
      status: u.blue.status,
      interface: this.$store.getters.getInterface,
    };
  },
  created() {
    this.$emit('push-page', 'Wizard');
  },
  methods: {
    translate: u.translate,
  },
};

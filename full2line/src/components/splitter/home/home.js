import { Util as u } from '@/modules/util';

export default {
  props: ['toggle'],
  created() {
    this.$emit('push-page', 'Wizard');
  },
  methods: {
    translate: u.translate,
  },
};

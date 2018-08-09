import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      visible: true,
    };
  },
  props: ['callback', 'text'],
  methods: {
    translate: u.translate,
  },
};

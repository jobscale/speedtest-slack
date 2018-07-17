import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      pageStack: [u.components.Splitter],
      animation: ['slide', 'lift', 'fade', 'none'][0],
    };
  },
  methods: {
    translate: u.translate,
  },
};

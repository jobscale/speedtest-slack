import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      pageStack: ['Splitter'],
      animation: ['slide', 'lift', 'fade', 'none'][3],
    };
  },
  methods: {
    translate: u.translate,
  },
};

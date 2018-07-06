import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      isFirst: false,
      isToolbar: true,
      pageStack: [u.components.SplitterHomePage],
      animation: 'fade',
    };
  },
  props: ['toggleMenu'],
  methods: {
    translate: u.translate,
  },
};

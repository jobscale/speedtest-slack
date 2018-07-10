import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      pageStack: [u.components.Splitter],
      animation: 'fade',
    };
  },
  props: ['toggleMenu'],
  created() {
    u.navigator = this;
  },
  methods: {
    translate: u.translate,
    push(component) {
      this.pageStack.push(component);
    },
    pop() {
      this.pageStack.pop();
    },
  },
};

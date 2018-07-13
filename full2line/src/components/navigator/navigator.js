import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      pageStack: [u.components.Splitter],
      animation: ['slide', 'lift', 'fade', 'none'][0],
    };
  },
  props: ['toggleMenu'],
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

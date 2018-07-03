import util from '@/modules/util';
import Tips from './tips';

export default {
  data() {
    return {
      modalVisible: false,
      timeoutID: 0,
    };
  },
  created() {
    this.$emit('change-animation', 'fade');
    this.$root.$children[0].pageStack.push(Tips);
  },
  methods: {
    push() {
      util.logging('push');
      this.$root.$children[0].pageStack.push(Tips);
    },
    onClickClose() {
      util.logging('close');
      let self;
      for (self = this.$parent; !self.current; self = self.$parent);
      self.current = 'SplitterPageHome';
    },
    onClickFinding() {
      this.modalVisible = true;
      clearTimeout(this.timeoutID);
      /* eslint-disable no-return-assign */
      this.timeoutID = setTimeout(() => this.modalVisible = false, 6000);
    },
  },
};

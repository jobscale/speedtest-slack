import { Util as u } from '@/modules/util';
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
    translate: u.translate,
    push() {
      u.logger.log('push');
      this.$root.$children[0].pageStack.push(Tips);
    },
    onClickClose() {
      u.logger.log('close');
      let self;
      for (self = this.$parent; !self.current; self = self.$parent);
      self.current = 'SplitterHome';
    },
    onClickFinding() {
      this.modalVisible = true;
      clearTimeout(this.timeoutID);
      /* eslint-disable no-return-assign */
      this.timeoutID = setTimeout(() => this.modalVisible = false, 6000);
    },
  },
};

import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
    };
  },
  props: ['toggleMenu'],
  methods: {
    translate: u.translate,
    parent() {
      let self;
      for (self = this.$parent; !self.current; self = self.$parent);
      return self;
    },
    openChannel() {
      u.logger.log('openChannel');
      this.parent().current = 'Channel';
    },
    openPairing() {
      u.logger.log('openPairing');
      this.parent().current = 'Pairing';
    },
    openCoverPage() {
      u.logger.log('openCoverPage');
      this.parent().current = 'CoverPage';
      setTimeout(() => {
        this.parent().current = 'SplitterHome';
      }, 2000);
    },
  },
};

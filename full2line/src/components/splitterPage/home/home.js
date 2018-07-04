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
    openFindSite() {
      u.logger.log('openFindSite');
      this.parent().current = 'FindSite';
    },
    openPairing() {
      u.logger.log('openPairing');
      this.parent().current = 'Pairing';
    },
    openCoverPage() {
      u.logger.log('openCoverPage');
      this.parent().current = 'CoverPage';
      setTimeout(() => {
        this.parent().current = 'SplitterPageHome';
      }, 2000);
    },
  },
};

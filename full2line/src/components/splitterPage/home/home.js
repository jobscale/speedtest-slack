import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      translate: u.translate,
    };
  },
  props: ['toggleMenu'],
  methods: {
    openFindSite() {
      u.logger.log('openFindSite');
      let self;
      for (self = this.$parent; !self.current; self = self.$parent);
      self.current = 'FindSite';
    },
  },
};

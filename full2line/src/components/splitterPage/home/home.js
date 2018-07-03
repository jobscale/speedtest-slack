import { logging } from '@/modules/logging';

export default {
  props: ['toggleMenu'],
  methods: {
    openFindSite() {
      logging('openFindSite');
      let self;
      for (self = this.$parent; !self.current; self = self.$parent);
      self.current = 'FindSite';
    },
  },
};

import util from '@/modules/util';

export default {
  data() {
    return {
      translate: util.translate,
    };
  },
  props: ['toggleMenu'],
  methods: {
    openFindSite() {
      util.logging('openFindSite');
      let self;
      for (self = this.$parent; !self.current; self = self.$parent);
      self.current = 'FindSite';
    },
  },
};

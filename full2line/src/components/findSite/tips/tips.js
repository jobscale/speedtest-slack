import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      carouselIndex: 0,
      tips: u.translate('findSite.tips.text'),
      dots: {
        textAlign: 'center',
        fontSize: '180%',
        color: '#0076ff',
        position: 'absolute',
        bottom: '0%',
        left: 0,
        right: 0,
      },
    };
  },
  methods: {
    translate: u.translate,
    onClickClose() {
      this.$root.$children[0].pageStack.pop();
    },
  },
};

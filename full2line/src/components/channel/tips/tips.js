import { mixin } from '@/modules/util';

export default {
  mixins: [mixin],
  data() {
    return {
      carouselIndex: 0,
      tips: this.translate('channel.tips.text'),
      dots: {
        textAlign: 'center',
        fontSize: '10vw',
        position: 'absolute',
        bottom: '0vh',
        left: 0,
        right: 0,
      },
    };
  },
  props: ['callback'],
};

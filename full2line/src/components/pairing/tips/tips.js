import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      carouselIndex: 0,
      tips: u.translate('pairing.tips.text'),
      dots: {
        textAlign: 'center',
        fontSize: '10vw',
        color: '#0076ff',
        position: 'absolute',
        bottom: '0vh',
        left: 0,
        right: 0,
      },
    };
  },
  props: ['visible', 'close'],
  methods: {
    translate: u.translate,
  },
};

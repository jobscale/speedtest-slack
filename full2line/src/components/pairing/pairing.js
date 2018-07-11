import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      isTips: true,
      carouselIndex: 0,
      tips: u.translate('pairing.tips.text'),
      dots: {
        textAlign: 'center',
        fontSize: '180%',
        color: '#0076ff',
        position: 'absolute',
        bottom: '0%',
        left: 0,
        right: 0,
      },
      modalVisible: false,
    };
  },
  methods: {
    translate: u.translate,
    close() {
      this.$emit('pop-page');
    },
    onClickFinding() {
      this.modalVisible = true;
      setTimeout(() => this.modalVisible = false, 3000);
    },
  },
};

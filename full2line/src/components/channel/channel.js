import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      isTips: true,
      carouselIndex: 0,
      tips: u.translate('channel.tips.text'),
      dots: {
        textAlign: 'center',
        fontSize: '10vw',
        color: '#0076ff',
        position: 'absolute',
        bottom: '0vh',
      },
      modalVisible: false,
    };
  },
  methods: {
    translate: u.translate,
    close() {
      u.splitter.$emit('pop-page');
    },
    onClickFinding() {
      this.modalVisible = true;
      setTimeout(() => this.modalVisible = false, 3000);
    },
  },
};

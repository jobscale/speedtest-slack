import SplitterPage from '@/components/splitterPage';
import CoverPage from '@/components/coverPage';

export default {
  data() {
    return {
      isFirst: false,
      pageStack: [
        SplitterPage,
      ],
      animation: 'fade',
    };
  },
  created() {
    if (this.isFirst/* TODO: 最初のとき */) {
      this.pageStack.push(CoverPage);
    }
  },
  beforeMount() {
    const html = document.documentElement;
    if (this.$ons.platform.isIPhoneX()) {
      html.setAttribute('onsflag-iphonex-portrait', '');
      html.setAttribute('onsflag-iphonex-landscape', '');
    }
  },
};

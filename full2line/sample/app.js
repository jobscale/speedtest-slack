import TabsPage from '@/components/tabsPage/TabsPage';
import CoverPage from '@/components/coverPage/CoverPage';

export default {
  data() {
    return {
      pageStack: [
        TabsPage,
        CoverPage,
      ],
      animation: 'fade',
    };
  },
  beforeMount() {
    const html = document.documentElement;
    if (this.$ons.platform.isIPhoneX()) {
      html.setAttribute('onsflag-iphonex-portrait', '');
      html.setAttribute('onsflag-iphonex-landscape', '');
    }
  },
};

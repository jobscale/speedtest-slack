import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      current: 'SplitterHome',
      pages: [{
        caption: u.translate('common.home'),
        name: 'SplitterHome',
      }, {
        caption: 'News',
        name: 'SplitterNews',
      }, {
        caption: 'Settings',
        name: 'SplitterSettings',
      }],
      openSide: false,
    };
  },
  beforeMount() {
    const html = document.documentElement;
    if (this.$ons.platform.isIPhoneX()) {
      html.setAttribute('onsflag-iphonex-portrait', '');
      html.setAttribute('onsflag-iphonex-landscape', '');
    }
  },
  methods: {
    translate: u.translate,
  },
};

import HomePageA from '@/components/homePage/HomePageA';
import MainNavigatorA from '@/components/mainNavigator/AppMainNavigator';
import MainMenu from '@/components/mainMenu/AppMainMenu';
export default {
  name: 'app',
  data() {
    return {
      nextPage: ''
    };
  },
  computed: {
    menuIsOpen: {
      get () {
        return this.$store.state.splitter.open
      },
      set (newValue) {
        this.$store.commit('splitter/toggle', newValue)
      }
    }
  },
  methods: {
    clickMenuItem(page) {
      console.log(page);
      this.nextPage = page;
    }
  },
  components: {
    MainNavigatorA,
    MainMenu,
    HomePageA
  },
  beforeMount() {
    const html = document.documentElement;
    if (this.$ons.platform.isIPhoneX()) {
      html.setAttribute('onsflag-iphonex-portrait', '');
      html.setAttribute('onsflag-iphonex-landscape', '');
    }
  },
};

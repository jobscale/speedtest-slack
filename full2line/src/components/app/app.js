import HomePageA from '../homePage/HomePageA';
import MainNavigatorA from '../mainNavigator/AppMainNavigator';
import MainMenu from '../mainMenu/AppMainMenu';
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
  }
};

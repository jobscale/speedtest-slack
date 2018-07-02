import HomePage from './home';
import NewsPage from './news';
import SettingsPage from './settings';

export default {
  data() {
    return {
      current: (() => {
        const page = this.$parent.$parent.$parent.current;
        /* eslint-disable no-unneeded-ternary */
        return page ? page : 'home';
      })(),
      pages: ['home', 'news', 'settings'],
      openSide: false,
    };
  },
  components: {
    home: HomePage,
    news: NewsPage,
    settings: SettingsPage,
  },
};

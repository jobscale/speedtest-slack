import HomePage from './home/Home.vue';
import NewsPage from './news/News.vue';
import SettingsPage from './settings/Settings.vue';

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

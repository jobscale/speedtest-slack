import homePage from './home/Home';
import newsPage from './news/News';
import settingsPage from './settings/Settings';

export default {
  data() {
    return {
      current: (() => {
        const page = this.$parent.$parent.$parent.current;
        return page ? page : 'home';
      })(),
      pages: ['home', 'news', 'settings'],
      openSide: false
    };
  },
  components: {
    home: homePage,
    news: newsPage,
    settings: settingsPage,
  },
};

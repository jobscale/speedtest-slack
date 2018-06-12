import pageTestHome from '../pageTestHome/TestPageHome';
export default {
  name: 'MainNavigator',
  props: ['nextPage'],
  data() {
    return {
      pageStack: [pageTestHome]
    }
  },
  methods: {
  },
  watch: {
    nextPage(newVal, oldVal) { // watch it
      this.pageStack.push(newVal)
    }
  },
  components: {
    pageTestHome
  }
};

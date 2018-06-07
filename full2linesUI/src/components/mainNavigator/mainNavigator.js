// import pageTest1 from '../pageTestHome/TestPageHome'
import pageTest1 from '../HomePage/HomePageA'

export default {
  name: 'MainNavigator',
  props: ['nextPage'],
  data () {
    return {
    pageStack: [pageTest1]
    }
  },
  methods: {
  },
  watch: {
    nextPage: function (newVal, oldVal) { // watch it
      this.pageStack.push(newVal)
    }
  },
  components: {
    pageTest1
  }
}

export default {
  data() {
    return {
      carouselIndex: 0,
      items: {
        BLUE: '#085078',
        DARK: '#373B44',
        ORANGE: '#D38312',
      },
      dots: {
        textAlign: 'center',
        fontSize: '420%',
        color: '#fff',
        position: 'absolute',
        bottom: '8%',
        left: 0,
        right: 0,
      },
    };
  },
  methods: {
    onClickClose() {
      this.$root.$children[0].pageStack.pop();
    },
  },
};

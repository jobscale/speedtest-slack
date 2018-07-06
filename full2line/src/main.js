// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import Vue from 'vue';
import VueOnsen from 'vue-onsenui';
import store from './store';
import App from './components/splitter';
import { Util as u } from './modules/util';

const app = {
  registerComponent(name, componentConfig) {
    const config = u.assignIn({ key: u.key }, componentConfig.default || componentConfig);
    u.logger.info(name, JSON.stringify(config));
    // コンポーネントをグローバル登録する
    Vue.component(name, config);
  },
  initialize() {
    const requireComponent = require.context('./components', true, /\w+\.vue$/);
    requireComponent.keys().forEach(fileName => {
      // コンポーネント名をパスカルケース (PascalCase) で取得する
      const componentName = u.upperFirst(u.camelCase(fileName.replace(/^\.\/(.*)index\.\w+$/, '$1')));
      // コンポーネント設定を取得する
      const componentConfig = requireComponent(fileName);
      this.registerComponent(componentName, componentConfig);
    });
    u.components = Vue.options.components;
    Vue.config.productionTip = false;
    Vue.use(VueOnsen);
  },
  run() {
    return new Vue({
      el: '#app',
      store,
      template: '<App/>',
      components: { App },
    });
  },
};
app.initialize();
app.run();

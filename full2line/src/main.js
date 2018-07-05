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
  registerComponent(componentName, componentConfig) {
    u.logger.info(componentName);
    // コンポーネントをグローバル登録する
    Vue.component(
      componentName,
      // `export default` を使ってコンポーネントがエクスポートされた場合に存在する
      // `.default` でコンポーネントオプションを期待していて
      // 存在しない場合にはモジュールのルートにフォールバックします。
      componentConfig.default || componentConfig,
    );
  },
  initialize() {
    const requireComponent = require.context('./components', true, /\w+\.vue$/);
    requireComponent.keys().forEach(fileName => {
      // コンポーネント設定を取得する
      const componentConfig = requireComponent(fileName);
      // コンポーネント名をパスカルケース (PascalCase) で取得する
      const componentName = u.upperFirst(u.camelCase(fileName.replace(/^\.\/(.*)index\.\w+$/, '$1')));
      this.registerComponent(componentName, componentConfig);
    });
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

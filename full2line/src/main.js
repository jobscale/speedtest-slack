// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import Vue from 'vue';
import VueOnsen from 'vue-onsenui';
import store from './store';
import { Util as u } from './modules/util';
import Database from './modules/database';
import Bluetooth from './modules/bluetooth';
import Storage from './modules/storage';

/**
 * アプリ内共通インスタンス
 * Util.db データベース
 * Util.blue ブルートゥース通信
 * Util.storage ストレージ操作
 */

const app = {
  registerComponent(name, componentConfig) {
    const config = u.assignIn({ key: u.key }, componentConfig.default || componentConfig);
    u.logger.info('ok', name, config.key);
    // コンポーネントをグローバル登録する
    Vue.component(name, config);
  },
  initComponent() {
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
  initDatabase() {
    u.db = new Database();
    u.db.initialize();
  },
  initBluetooth() {
    u.blue = new Bluetooth();
    u.blue.initialize();
  },
  initStorage() {
    u.storage = new Storage();
    u.storage.initialize();
  },
  run() {
    return new Vue({
      el: '#app',
      store,
      template: '<navigator v-bind:class="{hide:isCold}"/>',
      data() { return { isCold: true }; },
      created() { setTimeout(() => this.isCold = false, 2000); },
      beforeMount() {
        if (this.$ons.platform.isIPhoneX()) {
          const html = document.documentElement;
          html.setAttribute('onsflag-iphonex-portrait', '');
          html.setAttribute('onsflag-iphonex-landscape', '');
        }
        this.$ons.platform.select('ios');
      },
    });
  },
  main() {
    app.initComponent();
    app.initDatabase();
    app.initBluetooth();
    app.initStorage();
    app.run();
  },
};
app.main();

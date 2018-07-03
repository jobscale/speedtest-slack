# フル２線PLUS設定スマートフォンアプリ

![Screenshot](res/android/xxxhdpi.png)

## Create the Component
```bash
cd src/components
../../make-vue newPage
```

## Translate example

#### javascript
```es2015
import util from '@/modules/util';

export default {
  data() {
    return {
      translate: util.translate,
      title: util.translate('common.home'),
    };
  },
};

```

#### onsenui
```onsenui
<v-ons-button modifier="large" v-on:click="openFindSite">{{translate('findSite.finding')}}</v-ons-button>
```

#### vue-template
```vue-template
<splitter-page-toolbar :title="translate('common.home')" :action="toggleMenu"></splitter-page-toolbar>
```

## Build Setup

``` bash
# install dependencies
start.sh

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run on iPhone X or its simulator
cordova platform add ios
npm run build
cordova run ios --target="iPhone-X"
```


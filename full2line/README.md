# フル２線PLUS設定スマートフォンアプリ

![Screenshot](src/assets/logo.png)

## Create the Component
```bash
cd src/components
../../make-vue newPage
```

## Translate example

#### javascript
```es2015
import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      title: u.translate('common.home'),
    };
  },
  methods: {
    translate: u.translate,
  },
};

```

#### onsenui
```onsenui
<v-ons-button v-on:click="open">{{translate('pairing.finding')}}</v-ons-button>
```

#### vue-template
```vue-template
<splitter-page-toolbar :title="translate('common.home')" :action="toggleMenu"></splitter-page-toolbar>
```

## Build Setup

```bash
# install dependencies
./start.sh

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

## Modules

#### Bluetooth (Cordova plugin)
```pre
modules/common/bluetooth/index.js
modules/bluetooth/index.js

u.blue = new Bluetooth(); // instance
```

#### FileStorage (Cordova plugin)
```pre
modules/common/storage/index.js
modules/storage/index.js

u.storage = new Storage(); // instance
```

#### Database (WebSQL)
```pre
modules/common/database/index.js
modules/database/index.js

u.db = new Database(); // instance
```

#### Main Utility (Application Common)
```pre
modules/util/index.js

import { Util as u } from '@/modules/util'; // static
```

## Models

#### Database
```pre
modules/database/models/index.js
```

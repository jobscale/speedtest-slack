# フル２線PLUS設定スマートフォンアプリ

![Screenshot](src/assets/logo.png)

## Environment

#### platform add android
```bash
npm run pf:android
```

## Run

#### run android
```bash
npm run android
```

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
<v-ons-input :placeholder="translate('common.home')"></v-ons-input>
```

## Build Setup

```bash
# install dependencies
scripts/start.sh

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

## Components
> src/components

* ユーザーインターフェース - (Vueコンポーネント)

## Modules
> src/modules

* アプリ機能 - （機能モジュール）

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
> src/modules/<機能>/models

* アプリデータ - (データモデル)

#### Database
```pre
modules/database/models/index.js
```

## 画面一覧

SPA (シングルページアプリケーション)

* コンポーネント名称 (物理名)

#### 制御
* ナビゲーター (navigator)
* スプリッター (splitter)

#### ページ
* ホーム (splitter-home)
* 電波確認 (channel)
* 端末確認 (pairing)
* システムデータ (system)
* 器具設定 (operation)
* 保守機能 (maintenance)
* アプリの使い方 (help)
* データ保存・管理 (manage)

* 器具ペアリング (paired-items)
* 系統選択 (select-lines)
* ようこそ (wizard)

#### モーダル
* 汎用処理中 (processing)
* 電波確認ヘルプ (channel-tips)
* 端末確認ヘルプ (pairing-tips)

コンポーネントの埋め込み方法

> <物理名></物理名>

> <物理名/>

例
```html
<channel-tips></channel-tips>
<navigator/>
```

ページの呼び出し方法

例 (html)
```html
<div @click="@emit('push-page', 'Channel')">channel</div>
```

例 (javascript)
```es6
channel() {
  this.@emit('push-page', 'Channel')
},
```

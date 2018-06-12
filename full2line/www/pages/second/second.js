/**
 * ページ
 */
class Second extends Page {
    constructor() {
        super();
    }
    /**
     * ページの初期化
     */
    initialize() {
        this.initElement();
        this.initAction();
    }
    /**
     * 表示項目の初期化
     */
    initElement() {
    }
    /**
     * アクションイベントの初期化
     */
    initAction() {
    }
    /**
     * デバイス利用可能のイベント
     */
    onDeviceReady() {
        this.initialize();
    }
}
/**
 * Vue
 */
ons.ready(() => {
    const app = new Second();
    new Vue({
        el: '#app',
        template: '#main',
        data() {
            return {
                date: app.getDate(),
                toastVisible: false
            };
        }
    });
});

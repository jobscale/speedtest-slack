/**
 * ページ
 */
class First extends Page {
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
    const app = new First();
    new Vue({
        el: '#app',
        template: '#main',
        data() {
            return {
                isExpanded: false,
                nextButtonTitle: '次へ'
            }
        },
        methods: {
            goNext() {
                app.movePage('/pages/second/second.html');
            }
        }
    });
});

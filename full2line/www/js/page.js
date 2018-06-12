/**
 * ページ共通の基底クラス
 */
class Page {
    constructor() {
        ons.platform.select('ios');
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    }
    onDeviceReady() {
    }
    getDate(...argv) {
        return new Date(...argv).toLocaleDateString();
    }
    movePage(uri) {
        location.replace(uri);
    }
}
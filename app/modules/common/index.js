'use strict';
class App {
    constructor() {
    }
    makePromise() {
        let promise = {};
        promise.instance = new Promise((resolve, reject) => {
            promise.resolve = resolve;
            promise.reject = reject;
        });
        return promise;
    }
    fetch(url, options) {
        let instanceOptions = Object.assign({}, options);
        if (!instanceOptions.agent && process.env.http_proxy) {
            console.log(process.env.http_proxy);
            let protocol = url.split(':')[0];
            instanceOptions.agent = new require(`${protocol}-proxy-agent`)(process.env[`${protocol}_proxy`]);
        }
        return require('node-fetch')(url, instanceOptions);
    }
}
module.exports = {
    App: App
};
const fetch = require('node-fetch');

class App {
  makePromise() {
    const promise = {};
    promise.instance = new Promise((resolve, reject) => {
      promise.resolve = resolve;
      promise.reject = reject;
    });
    return promise;
  }

  fetch(url, options) {
    const instanceOptions = Object.assign({}, options);
    if (!instanceOptions.agent && process.env.http_proxy) {
      console.log(process.env.http_proxy);
      const protocol = url.split(':')[0];
      /* eslint-disable global-require, import/no-dynamic-require */
      const Agent = require(`${protocol}-proxy-agent`); /* eslint-enable global-require, import/no-dynamic-require */
      instanceOptions.agent = new Agent(process.env[`${protocol}_proxy`]);
    }
    return fetch(url, instanceOptions);
  }
}
module.exports = {
  App,
};

require('core');
const { SpeedTest } = require('speedtest');
const { Slack } = require('slack');
const { Weather } = require('weather');
const { DownDetector } = require('downdetector');
const { Shell } = require('shell');

const conf = {
  target: 'https://jsx.jp',
  cookie: 'X-AUTH=X0X0X0X0X0X0X0X',
  host: 'https://partner.credentials.svc.cluster.local',
};
if (process.env.NODE_ENV === 'LOCAL') {
  conf.host = 'https://jsx.jp:3443';
}
const template = {
  icon_emoji: ':email:',
  username: 'Speed',
  text: '',
  attachments: [{
    fallback: '',
  }],
};

class App {
  getUrls(text) {
    const search = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g;
    return text.match(search);
  }
  getData(text) {
    const data = {};
    Object.assign(data, template);
    const urls = this.getUrls(text);
    data.text = text;
    if (!urls) return data;
    data.attachments = [{
      fallback: '',
      thumb_url: urls[0],
    }];
    return data;
  }
  fetchEnv() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    const pattern = [/=/g, '', 'base64'];
    return fetch(`${conf.host}/env.json`, {
      method: 'GET',
      headers: { Cookie: conf.cookie },
    })
    .then(res => res.json())
    .then(res => JSON.parse(
      Buffer.from(res.env.replace(...pattern), pattern[2]).toString(),
    ).slack);
  }
  routine() {
    const stack = [];
    const sender = param => stack.push(this.getData(`${param.caption} - <${param.image}|icon>`));
    return new Shell().spawn('curl', ['-s', 'https://inet-ip.info/ip'])
    .then(res => logger.info(res) || stack.push(this.getData(res)))
    .then(() => new SpeedTest().run())
    .then(res => logger.info(res) || stack.push(this.getData(res)))
    .then(() => new Weather().run())
    .then(res => logger.info(res.caption) || sender(res))
    .then(() => new DownDetector().run())
    .then(record => record.map(res => sender(res)))
    .then(() => stack);
  }
  wait(index, data) {
    const { pending, resolve } = promiseGen();
    setTimeout(resolve, index ? 3000 : 0, data);
    return pending;
  }
  async send(env, stack) {
    const slack = new Slack(env);
    for (let i = 0; i < stack.length; i++) {
      await this.wait(i, stack[i])
      .then(data => slack.send(data));
    }
  }
  start() {
    return Promise.all([this.fetchEnv(), this.routine()])
    .then(args => this.send(...args));
  }
}

new App().start();

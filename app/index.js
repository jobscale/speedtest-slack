const _ = require('lodash');
const env = require('env');
const { SpeedTest } = require('speedtest');
const { Slack } = require('slack');
const { Weather } = require('weather');
const { DownDetector } = require('downdetector');

const datas = [{
  icon_emoji: ':email:',
  username: 'Speed',
  attachments: [{
    fallback: '',
  }],
}];
const getUrls = text => {
  const search = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g;
  return text.match(search);
};
const getData = text => {
  const data = _.cloneDeep(datas[0]);
  const urls = getUrls(text);
  data.text = text;
  if (!urls) return data;
  data.attachments = [{
    fallback: '',
    thumb_url: urls[0],
  }];
  return data;
};
const main = () => {
  let delay = 1;
  const slack = new Slack(env.slack);
  const sender = param => setTimeout(
    data => slack.send(data), (delay++) * 3000, getData(`${param.caption} - <${param.image}|icon>`),
  );
  let text;
  Promise.resolve()
  .then(() => new DownDetector().run())
  .then(record => record.map(res => sender(res)))
  .then(() => new Weather().run())
  .then(res => sender(res))
  .then(() => new SpeedTest().run())
  .then(res => slack.send(getData(text = res)))
  .then(() => slack.logger.info(text));
};
(() => {
  main();
})();

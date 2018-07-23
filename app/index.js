const env = require('env.json');
const { SpeedTest } = require('speedtest');
const { Slack } = require('slack');
const _ = require('lodash');

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
  data.text = text;
  data.attachments = [{
    fallback: '',
    thumb_url: getUrls(text)[0],
  }];
  return data;
};
const main = () => {
  const slack = new Slack(env.slack);
  let text;
  new SpeedTest().run()
  .then(res => getData(text = res))
  .then(data => slack.send(data))
  .then(res => {
    slack.logger.info(text);
    slack.logger.info(res);
  });
};
(() => {
  main();
})();

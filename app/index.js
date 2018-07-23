const { slack } = require('env.json');
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
const getUrls = (text) => {
  const search = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g;
  return text.match(search);
};
const main = () => {
  new SpeedTest().run()
  .then(res => ((text) => {
    const data = _.cloneDeep(datas[0]);
    data.text = text;
    delete data.attachments;
    data.attachments = [{
      fallback: '',
      thumb_url: getUrls(text)[0],
    }];
    return new Slack(slack).send(data);
  })(res))
  .then(res => console.info(res));
};
(() => {
  main();
})();

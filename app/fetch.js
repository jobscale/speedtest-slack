const { slack } = require('env');
const { Slack } = require('slack');

const main = () => {
  const app = new Slack(slack);
  app.getHistory(1)
  .then(json => console.info(json))
  .catch(e => console.error(e.message))
  .then(() => console.info('finish.'));
};
(() => {
  main();
})();

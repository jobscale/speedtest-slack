const { slack } = require('env');
const { Slack } = require('slack');

const main = () => {
  const app = new Slack(slack);
  app.getHistory(1000)
  .then(json => app.deleteChat(json.messages))
  .catch(e => console.error(e.message))
  .then(json => console.info(json));
};
(() => {
  main();
})();

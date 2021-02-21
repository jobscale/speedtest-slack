require('core');
const { WebClient, LogLevel } = require('@slack/web-api');
const { slack } = require('./env.json');
const client = new WebClient(slack.token, {
  logLevel: LogLevel.DEBUG,
});

const delay = 1000;

const delayRemove = ts => new Promise(resolve => {
  setTimeout(() => {
    resolve(client.chat.delete({
      channel: slack.channel,
      ts,
    }));
  }, delay);
});

const main = async () => {
  const res = {
    length: 1,
  };
  for (; res.length;) {
    await client.conversations.history({
      channel: slack.channel,
    })
    .then(async json => {
      logger.info({ length: json.messages.length });
      res.length = json.messages.length;
      // eslint-disable-next-line
      for (const message of json.messages) {
        await delayRemove(message.ts);
      }
    });
  }
};
(() => {
  main()
  .catch(e => logger.error(e.message));
})();

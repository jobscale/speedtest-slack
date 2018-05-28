const {slack} = require('env');
const {Slack} = require('slack');
const main = () => {
    let app = new Slack(slack);
    app.getHistory(1000)
    .then(json => app.deleteChat(json.messages))
    .catch(e => e)
    .then(json => console.info(json));
};
(() => {
    main();
})();

const {slack} = require('env');
const {Slack} = require('slack');
const main = () => {
    let app = new Slack(slack);
    app.getHistory(1)
    .then(json => console.info(json))
    .catch(e => e)
    .then(json => console.info(json));
};
(() => {
    main();
})();

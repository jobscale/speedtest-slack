require('core');
(() => {
  const main = () => {
    fetch('https://inet-ip.info/ip')
    .then(response => response.text())
    .then(ip => logger.info({ ip }))
    .catch(e => logger.error(e))
    .then(() => logger.info('finished.'));
  };
  main();
})();

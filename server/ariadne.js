module.exports = (id) => {
  /* eslint-disable global-require */
  const express = require('express');
  const app = express();
  /* eslint-enable global-require */

  // Variables
  const port = process.env.SERVER_PORT || 3000;

  app.get('/', (req, res) => {
    res.send(`Worker #${id}`);
  });

  app.listen(port, () => {
    console.log(`Instance ${id} on port ${port}`);
  });
};

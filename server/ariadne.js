/* eslint-disable global-require*/
module.exports = (id) => {
  /**
   * Modules
   *
   */

  const express = require('express');
  const morgan = require('morgan');
  const fs = require('fs');
  const path = require('path');

  /**
   * Variables
   *
   */

  const app = express();
  const PORT = process.env.SERVER_PORT || 3000;
  const LOG_FORMAT = process.env.LOG_FORMAT || 'combined';

  /**
   * Environment Settings
   *
   */

  if (process.env.NODE_ENV === 'development') {
    /**
     * Development Settings
     */

    app.use(morgan(LOG_FORMAT));
  } else {
    /**
     * Production Settings
     */

    const accessLogStream = fs.createWriteStream(path.join(__dirname,
      '..', 'access.log'), { flags: 'a' });

    app.use(morgan(LOG_FORMAT, { stream: accessLogStream }));
  }

  /**
   * Routes
   */

  app.get('/', (req, res) => {
    res.send(`Worker #${id}`);
  });

  /**
   * Start
   */

  app.listen(PORT, () => {
    console.log(`Instance ${id} on PORT ${PORT}`);
  });
};

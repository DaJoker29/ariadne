const throng = require('throng');
const server = require('../server/ariadne');

function startMaster() {
  // Check if environment variables are defined.
  if (!process.env.SESSION_SECRET) {
    throw Error('SESSION_SECRET not defined.');
  }

  if (!process.env.NODE_ENV) {
    throw Error('NODE_ENV not defined');
  }

  console.log('Start Master');
}

function startWorker(id) {
  console.log(`Start Worker ${id}`);

  // Instantiate Server
  server(id);

  // Handle Signal Kills
  process.on('SIGTERM', () => {
    console.log(`Kill Worker ${id}`);
    console.log('Cleaning up');
    process.exit();
  });
}

// Initiate processes
throng({
  master: startMaster,
  start: startWorker,
});

const throng = require('throng');
const server = require('../server/ariadne');

function startMaster() {
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

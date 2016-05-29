const throng = require('throng');

throng(id => {
  console.log(`Started worker ${id}`);

  process.on('SIGTERM', () => {
    console.log(`Worker ${id} exiting`);
    console.log('Cleaning up');
    process.exit();
  });
});
// console.log('API online');

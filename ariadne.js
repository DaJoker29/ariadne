const twitterbot = require('./scripts/twitterbot.js');
const math = require('mathjs');

/**
 * Ariadne 2.0 - Superior Productivity
 * Copyright (C) 2016 Dewitt Buckingham (http://zerodaedalus.com)
 *
 * TODO: Add some better logging utility. (Winston?)
 * TODO: Integration testing
 */
console.log('waking up...');
twitterbot.init((err) => {
  // Check if twitterbot failed to intialize.
  if (err) {
    console.log(`twitterbot failed to initialize: ${err}`);
  } else {
    console.log('loading modules...');

    /**
     * Load Modules
     */
    
    twitterbot.attach('test', 'Simple test to see if Ariadne is up and running', 'test', (arg, next) => {
      next(null, '1, 2, 3.');
    });

    twitterbot.attach('thanks', 'Everyone appreciates a little gratitude.', 'thanks', (arg, next) => {
      next(null, 'You\'re welcome');
    });

    twitterbot.attach('math', 'Solve math problems', 'math <problem>', (arg, next) => {
      if ('undefined' === arg) {
        next(null, 'You didn\'t give me a problem to solve.');
      } else {
        const options = {
          precision: 7,
          exponential: {
            lower: 1e-6,
            upper: 1e15,
          },
        };
        const result = math.eval(arg);
        next(null, `The answer is: ${math.format(result, options)}`); // TODO: Sanitize input
      }
    });

    twitterbot.attach('info', 'A little helpful information about Ariadne.', 'info', (arg, next) => {
      next(null, 'I am Ariadne, an automated productivity bot. Use \'help\' to see what I can do.');
    });

    twitterbot.attach('help', 'Some help with Ariadne\'s commands', 'help [command]', (arg, next) => {
      const commands = twitterbot.commands();

      if (arg) {
        const result = commands.find(e => e.command === arg);
        next(null, 'undefined' === result ? 'Don\'t recognize that command' : `\n${result.description}\nUsage: ${result.usage}`);
      } else {
        const str = ['\nHere are the available commands:\n <required> [optional]\n\n'];
        commands.forEach((e) => {
          str.push(`${e.usage} -- ${e.description}\n`);
        });
        next(null, str.join(''));
      }
    });
  } 
});

process.on('uncaughtException', (err) => {
  console.error('caught exception:');
  console.error(err);
  console.trace();
});
const twitter = require('./scripts/twitter.js');
const math = require('mathjs');

/**
 * Ariadne 2.0 - Superior Productivity
 * Copyright (C) 2016 Dewitt Buckingham (http://zerodaedalus.com)
 */
console.log('Waking up...');


twitter.init((err) => {
  // Check if Twitter failed to intialize.
  if (err) {
    console.log(`Twitter failed to initialize: ${err}`);
  } else {
    console.log('Loading Modules...');
    /**
     * Tweet Response - Twitter @reply handler
     *
     * twitter.attach('Command', middleware)
     *
     * function middleware (arg, next) {
     *   // do stuff to arg...
     *
     *   // response = string you want returned to the user
     *   next(null, response);
     * }
     */
    
    // Testing Command
    twitter.attach('test', 'Simple test to see if Ariadne is up and running', 'test', (arg, next) => {
      next(null, '1, 2, 3.');
    });

    // Thank you Command
    twitter.attach('thanks', 'Everyone appreciates a little gratitude.', 'thanks', (arg, next) => {
      next(null, 'You\'re welcome');
    });

    // MathJS
    twitter.attach('math', 'Solve math problems', 'math <problem>', (arg, next) => {
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

    // Info
    twitter.attach('info', 'A little helpful information about Ariadne.', 'info', (arg, next) => {
      next(null, 'I am Ariadne, an automated productivity bot. Use \'help\' to see what I can do.');
    });

    // Help
    twitter.attach('help', 'Some help with Ariadne\'s commands', 'help [command]', (arg, next) => {
      const commands = twitter.commands();

      if (arg) {
        const result = commands.find(e => e.command === arg);
        next(null, 'undefined' === result ? 'Don\'t recognize that command' : `\n${result.description}\nUsage: ${result.usage}`);
      } else {
        const str = ['\nCMDs: <req> [opt]\n\n'];
        commands.forEach((e) => {
          str.push(`${e.usage}\n`);
        });
        next(null, str.join(''));
      }
    });
  } 
});

process.on('uncaughtException', (err) => {
  console.error('Caught exception:');
  console.error(err);
  console.trace();
});
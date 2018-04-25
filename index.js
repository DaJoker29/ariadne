const TwitchBot = require('twitch-bot');
require('dotenv').config();

const { TWITCH_USER, TWITCH_OAUTH } = process.env;

console.log('Logging in');
console.log(`Username ${TWITCH_USER}`);
console.log(`OAuth Token ${TWITCH_OAUTH}`);

const bot = new TwitchBot({
  username: TWITCH_USER,
  oauth: TWITCH_OAUTH,
  channels: [TWITCH_USER, '#RamenShopBoyz'],
});

// Join Handler
bot.on('join', (channel) => {
  console.log(`Joined ${channel}`);

  // Greet the crowd
  bot.say('The party has arrived', channel);

  // Handle message triggers
});

bot.on('message', (chatter) => {
  switch (chatter.message) {
    case '!test':
      bot.say('Mic check. 1, 2, 1, 2...', chatter.channel);
      break;
    case '!leave':
      bot.part(TWITCH_USER, chatter.channel);
      break;
    case '!close':
      bot.close();
      break;
    default:
  }
});

// Event Handlers
bot.on('part', (channel) => {
  console.log(`Left ${channel}`);
});

bot.on('close', () => {
  console.log('Closed connection to irc server.');
});

bot.on('error', (e) => {
  console.log(e);
});
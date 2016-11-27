const fs = require('fs');
const math = require('mathjs');
const moment = require('moment');
const gh = require('./github.js');
const twitterbot = require('./twitterbot.js');

const metadata = JSON.parse(fs.readFileSync('package.json', 'utf8'));

function githubHandler(arg, next) {
  const args = arg.split('/');
  const username = args[0];
  const repo = args[1];
  if ('undefined' === typeof username || 'string' !== typeof username) {
    next(Error('Invalid username'));
  } else if (repo) {
    gh.getRepo(username, repo, (err, data) => {
      if (err) {
        next(err);
      } else {
        const response = [];
        response.push(`@${data.full_name} ${data.parent ? ` (Fork of ${data.parent.full_name})` : ''}\n`);
        response.push(`${data.description || 'No description'}\n`);
        response.push(`${data.html_url}\n`);
        response.push(`Has ${data.forks_count} forks, ${data.stargazers_count} stars and ${data.size} commits.\n`);
        response.push(`Created ${moment(data.created_at).fromNow()}.\n`);
        response.push(`Last commit was ${moment(data.pushed_at).fromNow()}.\n`);
        next(null, response.join(''));
      }
    });
  } else {
    gh.getUser(username, (err, data) => {
      if (err) {
        next(err);
      } else {
        const response = [];
        response.push(`${data.name} -- ${data.company || 'No affiliation'}\n`);
        response.push(`${data.bio || data.location || data.login}\n`);
        response.push(`${data.blog || data.html_url}\n`);
        response.push(`Has ${data.public_repos} repos, ${data.public_gists} gists and ${data.followers} followers.\n`);
        response.push(`Been using GitHub for ${moment(data.created_at).fromNow(true)}\n`);
        next(null, response.join(''));
      }
    });
  }
}

function infoHandler(arg, next) {
  gh.repository((err, data) => {
    if (err) {
      next(err);
    } else {
      const response = [];
      response.push(`${data.name} v${metadata.version} -- ${data.description}\n`);
      response.push(`${data.html_url}\n\n`);
      response.push(`Created by ${metadata.author} about ${moment(data.created_at).fromNow()}\n`);
      response.push(`Last updated ${moment(data.pushed_at).fromNow()}\n`);
      response.push('Use \'help\' to see what I can do.');
      next(null, response.join(''));
    }
  });
}

function mathHandler(arg, next) {
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
}

function helpHandler(arg, next) {
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
}

function testHandler(arg, next) {
  next(null, '1, 2, 3.');
}

function thanksHandler(arg, next) {
  next(null, 'You\'re welcome');
}

exports.THANKS = thanksHandler;
exports.GITHUB = githubHandler;
exports.TEST = testHandler;
exports.HELP = helpHandler;
exports.MATH = mathHandler;
exports.INFO = infoHandler;
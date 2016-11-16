const GitHubApi = require('github');
const config = require('../config/config.js');

let repo = {};
const github = new GitHubApi({
  headers: {
    'user-agent': 'Ariadne-Superior-Productivity',
  },
  protocol: 'https',
});


function init(callback) {
  console.log('pulling github information...');
  // Fetch repository info
  authenticate();
  github.repos.get({ owner: config.github.owner, repo: config.github.repo }, (err, res) => {
    authenticate();
    if (err) {
      callback(Error(`problem fetching GitHub repo: ${err}`));
    } else {
      repo = res;
      console.log('github information pulled');
      callback(null);
    }
  });
}

function repository(callback) {
  if ({} === repo || 'undefined' === typeof repo) {
    callback(Error('no github repo'));
  } else {
    callback(null, repo);
  }
}

function authenticate() {
  github.authenticate({ type: 'token', token: config.github.token });
}

function getUser(username, callback) {
  console.log(username);
  github.users.getForUser({ username }, (err, res) => {
    authenticate();
    if (err) {
      callback(Error(`problem fetching github user: ${err}\n${res}`));
    } else {
      console.log('github user successfully retrieved');
      callback(null, res);
    }
  });
}

module.exports.init = init;
module.exports.repository = repository;
module.exports.getUser = getUser;
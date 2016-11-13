const GitHubApi = require('github');
const config = require('../config/config.js');

let repo = {};
const github = new GitHubApi();


function init(callback) {
  console.log('pulling github information...');
  // Fetch repository info
  authenticate();
  github.repos.get({ owner: config.github.owner, repo: config.github.repo }, (err, res) => {
    if (err) {
      callback(Error('problem fetching GitHub repo'));
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
  github.authenticate(config.github.auth);
}

module.exports.init = init;
module.exports.repository = repository;
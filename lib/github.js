const GitHubApi = require('github');
const config = require('../config.js');

/**
 * Github API Module
 * @module  GitHub
 */

let repo = {};
const github = new GitHubApi({
  headers: {
    'user-agent': 'Ariadne-Superior-Productivity',
  },
  protocol: 'https',
});

/**
 * Authenticate and fetch GitHub info
 * @param  {Function} callback
 */
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

/**
 * Returns this projects Github repository
 * @param  {Function} callback
 */
function repository(callback) {
  if ({} === repo || 'undefined' === typeof repo) {
    callback(Error('no github repo'));
  } else {
    callback(null, repo);
  }
}

/**
 * Authenticate against the GitHub server
 */
function authenticate() {
  github.authenticate({ type: 'token', token: config.github.token });
}

/**
 * Get User information from Github
 * @param  {string}   username The user you want to fetch information about
 * @param  {Function} callback
 */
function getUser(username, callback) {
  github.users.getForUser({ username }, (err, res) => {
    authenticate();
    if (err) {
      callback(Error(`problem fetching github user: ${err}`));
    } else {
      console.log('github user successfully retrieved');
      callback(null, res);
    }
  });
}

/**
 * Get Repository information from Github
 * @param  {string}   owner    The owner of the repository
 * @param  {string}   repo     The repository name
 * @param  {Function} callback 
 */
function getRepo(owner, repo, callback) {
  github.repos.get({ owner, repo }, (err, res) => {
    authenticate();
    if (err) {
      callback(Error(`problem fetching github repo: ${err}`));
    } else {
      console.log('github repo successfully retrieved');
      callback(null, res);
    }
  });
}

module.exports.init = init;
module.exports.repository = repository;
module.exports.getUser = getUser;
module.exports.getRepo = getRepo;
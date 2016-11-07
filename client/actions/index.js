import axios from 'axios';

export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';
export const CHANGE_SUBMITTED = 'CHANGE_SUBMITTED';
export const CHANGE_RESPONSE = 'CHANGE_RESPONSE';
export const REQUEST_ALL_USERS = 'REQUEST_ALL_USERS';
export const RECEIVE_ALL_USERS = 'RECEIVE_ALL_USERS';
export const FETCH_USER_TEAMS = 'FETCH_USER_TEAMS';
export const REQUEST_USER_TEAMS = 'REQUEST_USER_TEAMS';
export const RECEIVE_USER_TEAMS = 'RECEIVE_USER_TEAMS';
export const REQUEST_TEAM_CREATION = 'REQUEST_TEAM_CREATION';
export const TEAM_CREATED = 'TEAM_CREATED';

function changeSubmitted() {
  return {
    type: CHANGE_SUBMITTED,
  };
}

function changeResponse() {
  return {
    type: CHANGE_RESPONSE,
  };
}

function requestUser() {
  return {
    type: REQUEST_USER,
  };
}

function receiveUser(user) {
  return {
    type: RECEIVE_USER,
    user,
  };
}

function requestAllUsers() {
  return {
    type: REQUEST_ALL_USERS,
  };
}

function receiveAllUsers(users) {
  return {
    type: RECEIVE_ALL_USERS,
    users,
  };
}

function requestUserTeams() {
  return {
    type: REQUEST_USER_TEAMS,
  };
}

function receiveUserTeams(teams) {
  return {
    type: RECEIVE_USER_TEAMS,
    teams,
  };
}

function requestTeamCreation(teamName) {
  return {
    type: REQUEST_TEAM_CREATION,
    teamName,
  };
}

function teamCreated() {
  return {
    type: TEAM_CREATED,
  };
}

export function fetchUser() {
  return dispatch => {
    dispatch(requestUser());
    return axios.get('http://localhost:3000/api/users')
      .then(response => response.data)
      .then(data => dispatch(receiveUser(data)));
  };
}

export function changeSettings(settings) {
  return dispatch => {
    dispatch(changeSubmitted(settings));
    return axios.post('http://localhost:3000/api/users/update', settings)
      .then(() => {
        dispatch(changeResponse());
        dispatch(fetchUser());
      });
  };
}

export function fetchAllUsers() {
  return dispatch => {
    dispatch(requestAllUsers());
    return axios.get('http://localhost:3000/api/admin/users')
      .then(response => response.data)
      .then(data => dispatch(receiveAllUsers(data)));
  };
}

export function fetchUserTeams() {
  return dispatch => {
    dispatch(requestUserTeams());
    return axios.get('http://localhost:3000/api/team')
      .then(response => response.data)
      .then(data => dispatch(receiveUserTeams(data)));
  };
}

export function createTeam(teamName) {
  return dispatch => {
    dispatch(requestTeamCreation());
    return axios.post('http://localhost:3000/api/team', { teamName })
      .then(() => {
        dispatch(teamCreated());
        dispatch(fetchUserTeams());
      });
  };
}

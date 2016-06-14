import axios from 'axios';

export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';
export const CHANGE_SUBMITTED = 'CHANGE_SUBMITTED';
export const CHANGE_RESPONSE = 'CHANGE_RESPONSE';
export const REQUEST_ALL_USERS = 'REQUEST_ALL_USERS';
export const RECEIVE_ALL_USERS = 'RECEIVE_ALL_USERS';

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

export function fetchUser() {
  return dispatch => {
    dispatch(requestUser());
    return axios.get('http://localhost:3000/api/users')
      .then(response => response.data)
      .then(data => dispatch(receiveUser(data)));
  };
}

export function changeSettings(setting) {
  return dispatch => {
    dispatch(changeSubmitted(setting));
    return axios.post('http://localhost:3000/api/users/update', setting)
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

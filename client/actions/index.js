import axios from 'axios';

export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';
export const CHANGE_SUBMITTED = 'CHANGE_SUBMITTED';
export const CHANGE_RESPONSE = 'CHANGE_RESPONSE';

function changeSubmitted(setting) {
  return {
    type: CHANGE_SUBMITTED,
    setting,
  };
}

function changeResponse(response) {
  return {
    type: CHANGE_RESPONSE,
    response,
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
      .then(response => {
        dispatch(changeResponse(response));
        dispatch(fetchUser());
      });
  };
}

import axios from 'axios';

export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';

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

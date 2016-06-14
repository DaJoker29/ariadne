import { REQUEST_USER, RECEIVE_USER, CHANGE_SUBMITTED } from '../actions';

export default function user(state = {
  isFetching: false,
  user: {
    displayName: 'User',
    flags: {
      isAdmin: false,
    },
  },
}, action) {
  switch (action.type) {
    case REQUEST_USER:
    case CHANGE_SUBMITTED:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_USER:
      return Object.assign({}, state, {
        isFetching: false,
        user: action.user,
      });
    default:
      return state;
  }
}

import { REQUEST_USER, RECEIVE_USER } from '../actions';

export default function user(state = {
  isFetching: false,
  user: {
    displayName: 'User',
  },
}, action) {
  switch (action.type) {
    case REQUEST_USER:
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

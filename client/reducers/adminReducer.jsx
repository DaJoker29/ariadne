import { RECEIVE_ALL_USERS } from '../actions';

export default function admin(state = {
  users: [],
}, action) {
  switch (action.type) {
    case RECEIVE_ALL_USERS:
      return Object.assign({}, state, {
        users: action.users,
      });
    default:
      return state;
  }
}

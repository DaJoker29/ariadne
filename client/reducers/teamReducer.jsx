import { RECEIVE_USER_TEAMS } from '../actions';

export default function teams(state = {
  teams: [],
}, action) {
  switch (action.type) {
    case RECEIVE_USER_TEAMS:
      return Object.assign({}, state, {
        teams: action.teams,
      });
    default:
      return state;
  }
}

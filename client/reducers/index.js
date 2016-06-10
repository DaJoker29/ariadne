import { combineReducers } from 'redux';
import user from './userReducer';

const Reducer = combineReducers({
  user,
});

export default Reducer;

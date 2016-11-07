import { combineReducers } from 'redux';
import user from './userReducer';
import admin from './adminReducer';
import team from './teamReducer';

const Reducer = combineReducers({
  user,
  admin,
  team,
});

export default Reducer;

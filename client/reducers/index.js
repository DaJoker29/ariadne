import { combineReducers } from 'redux';
import user from './userReducer';
import admin from './adminReducer';

const Reducer = combineReducers({
  user,
  admin,
});

export default Reducer;

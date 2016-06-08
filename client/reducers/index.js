import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

const Reducer = combineReducers({
  form: formReducer,
});

export default Reducer;

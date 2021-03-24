import {combineReducers} from 'redux';
import {sessionReducer} from './session-store/reducer';

const rootReducer = combineReducers({
  session: sessionReducer,
});

export default rootReducer;

export type RootReducerType = ReturnType<typeof rootReducer>;

import {
  DELETE_SESSION_DATA,
  SAVE_SESSION_DATA,
  SessionState,
  SessionActions,
} from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState: SessionState = {
  session: {
    id: '',
    name: '',
    token: '',
    sessionActive: false,
  },
};

export function sessionReducer(
  state = initialState,
  action: SessionActions,
): SessionState {
  switch (action.type) {
    case SAVE_SESSION_DATA:
      return {
        session: state.session,
      };
    case DELETE_SESSION_DATA: {
      AsyncStorage.removeItem('root');
      return {
        session: initialState.session,
      };
    }
    default:
      return state;
  }
}

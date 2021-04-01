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
        ...state,
        session: action.data,
      };
    case DELETE_SESSION_DATA: {
      AsyncStorage.removeItem('persist:root');
      return {
        ...state,
        session: initialState.session,
      };
    }
    default:
      return state;
  }
}

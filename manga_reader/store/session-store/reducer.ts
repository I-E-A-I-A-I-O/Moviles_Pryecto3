import {
  DELETE_SESSION_DATA,
  SAVE_COMPANIES_DATA,
  SAVE_SESSION_DATA,
  SessionActions,
  Session,
} from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState: Session = {
  id: '',
  name: '',
  nameCompanies: '',
  token: '',
  sessionActive: false,
  hasNotis: false,
};

export function sessionReducer(
  state = initialState,
  action: SessionActions,
): Session {
  switch (action.type) {
    case SAVE_SESSION_DATA:
      return {
        ...state,
        id: action.data.id,
        name: action.data.name,
        sessionActive: action.data.sessionActive,
        token: action.data.token,
        hasNotis: action.data.hasNotis,
      };
    case DELETE_SESSION_DATA: {
      AsyncStorage.removeItem('persist:root');
      return {
        ...state,
        hasNotis: initialState.hasNotis,
        id: initialState.id,
        name: initialState.name,
        sessionActive: false,
        token: initialState.token,
      };
    }
    case SAVE_COMPANIES_DATA:
      return{
        ...state,
        nameCompanies: initialState.nameCompanies,
      }
    case 'CHANGE_NOTIFICATION_STATUS':
      return {
        ...state,
        hasNotis: action.data,
      };
    default:
      return state;
  }
}



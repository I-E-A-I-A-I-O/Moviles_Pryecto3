import {
  SAVE_SESSION_DATA,
  DELETE_SESSION_DATA,
  Session,
  SessionActions,
} from './types';

export function SaveSessionData(data: Session): SessionActions {
  return {
    type: SAVE_SESSION_DATA,
    data: data,
  };
}

export function ClearSessionData(): SessionActions {
  return {
    type: DELETE_SESSION_DATA,
  };
}

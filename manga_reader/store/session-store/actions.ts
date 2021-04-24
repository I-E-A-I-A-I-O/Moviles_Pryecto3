import {
  SAVE_SESSION_DATA,
  SAVE_COMPANIES_DATA,
  DELETE_SESSION_DATA,
  CHANGE_NOTIFICATION_STATUS,
  Session,
  SessionActions,
} from './types';

export function SaveSessionData(data: Session): SessionActions {
  return {
    type: SAVE_SESSION_DATA,
    data: data,
  };
}

export function SaveDataCompanies(data: Session): SessionActions{
  return{
    type: SAVE_COMPANIES_DATA,
    data:data,
  };
}

export function ClearSessionData(): SessionActions {
  return {
    type: DELETE_SESSION_DATA,
  };
}

export function ChangeNotificationStatus(data: boolean): SessionActions {
  return {
    type: CHANGE_NOTIFICATION_STATUS,
    data: data,
  };
}

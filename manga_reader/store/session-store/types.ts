export const SAVE_SESSION_DATA = 'SAVE_SESSION_DATA';
export const DELETE_SESSION_DATA = 'DELETE_SESSION_DATA';
export const CHANGE_NOTIFICATION_STATUS = 'CHANGE_NOTIFICATION_STATUS';

export interface Session {
  id: string;
  name: string;
  token: string;
  sessionActive: boolean;
  hasNotis: boolean;
}

interface SaveSessionAction {
  type: typeof SAVE_SESSION_DATA;
  data: Session;
}

interface DeleteSessionData {
  type: typeof DELETE_SESSION_DATA;
}

interface ChangeNotificationStatus {
  type: typeof CHANGE_NOTIFICATION_STATUS;
  data: boolean;
}

export type SessionActions =
  | SaveSessionAction
  | DeleteSessionData
  | ChangeNotificationStatus;

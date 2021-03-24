export const SAVE_SESSION_DATA = 'SAVE_SESSION_DATA';
export const DELETE_SESSION_DATA = 'DELETE_SESSION_DATA';

export interface Session {
  id: string;
  name: string;
  token: string;
}

export interface SessionState {
  session: Session;
}

interface SaveSessionAction {
  type: typeof SAVE_SESSION_DATA;
  data: Session;
}

interface DeleteSessionData {
  type: typeof DELETE_SESSION_DATA;
}

export type SessionActions = SaveSessionAction | DeleteSessionData;

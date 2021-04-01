import {CodeController} from './email_verification';
import {UserSession} from './UserSession';
import {UserController} from './user_controller';
import {SearchBarResults} from './searchbar_results';
import {NotificationController} from './notifications';
import {ConnectionController} from './connections';

const userController = new UserController();
const codeController = new CodeController();
const userSession = new UserSession();
const searchResults = new SearchBarResults();
const notificationController = new NotificationController();
const connections = new ConnectionController();

export {
  userController,
  codeController,
  userSession,
  searchResults,
  notificationController,
  connections,
};

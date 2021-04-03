import {CodeController} from './email_verification';
import {UserSession} from './UserSession';
import {UserController} from './user_controller';
import {SearchBarResults} from './searchbar_results';
import {NotificationController} from './notifications';
import {ConnectionController} from './connections';
import {ReadUserDescription} from './user_read_controller';
import {UpdateUserDescription} from './user_update_controller';

const userController = new UserController();
const codeController = new CodeController();
const userSession = new UserSession();
const searchResults = new SearchBarResults();
const notificationController = new NotificationController();
const connections = new ConnectionController();
const updateUser = new UpdateUserDescription();
const readUser = new ReadUserDescription();

export {
  userController,
  codeController,
  userSession,
  searchResults,
  notificationController,
  connections,
  readUser,
  updateUser,
};

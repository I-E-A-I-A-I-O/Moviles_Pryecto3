import {CodeController} from './email_verification';
import {UserSession} from './UserSession';
import {SearchBarResults} from './searchbar_results';
import {NotificationController} from './notifications';
import {ConnectionController} from './connections';
import {ReadUserDescription} from './user/user_read_controller';
import {UpdateUserDescription} from './user/user_update_controller';
import {UserCreateController} from './user/user_create_controller';
import {UserAuthentication} from './user/user_auth_controller';
import {DeleteUserDescription} from './user/user_delete_controller';

const codeController = new CodeController();
const userSession = new UserSession();
const searchResults = new SearchBarResults();
const notificationController = new NotificationController();
const connections = new ConnectionController();
const updateUser = new UpdateUserDescription();
const readUser = new ReadUserDescription();
const userCreate = new UserCreateController();
const userAuth = new UserAuthentication();
const deleteUser = new DeleteUserDescription();

export {
  codeController,
  userSession,
  searchResults,
  notificationController,
  connections,
  readUser,
  updateUser,
  userCreate,
  userAuth,
  deleteUser,
};

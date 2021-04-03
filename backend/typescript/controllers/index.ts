import {CodeController} from './email_verification';
import {UserLogin} from './UserLogin';
import {UserController} from './user_controller';
import {SearchBarResults} from './searchbar_results';
import {NotificationController} from './notifications';
import {ConnectionController} from './connections';
import {PostController} from './postController';

const userController = new UserController();
const codeController = new CodeController();
const userLogin = new UserLogin();
const searchResults = new SearchBarResults();
const notificationController = new NotificationController();
const connections = new ConnectionController();
const post = new PostController();

export {
  userController,
  codeController,
  userLogin,
  searchResults,
  notificationController,
  connections,
  post
};

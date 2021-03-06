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
import {PostCreation} from './posts/create';
import {ReadPost} from './posts/read';
import {PostEdition} from './posts/edit';
import {PostInteractions} from './posts/interact';

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
const postCreation = new PostCreation();
const readPost = new ReadPost();
const editPost = new PostEdition();
const postInteractions = new PostInteractions();

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
  postCreation,
  readPost,
  editPost,
  postInteractions,
};

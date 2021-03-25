import { UserController } from './user_controller';
import { UserLogin } from './UserLogin'

const userController = new UserController();
const userLogin = new UserLogin();

export {
    userController,
    userLogin
}
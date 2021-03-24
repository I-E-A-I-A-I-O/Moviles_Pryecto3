import { UserController } from './user_controller';
import { CodeController } from './email_verification';

const userController = new UserController();
const codeController = new CodeController();

export {
    userController,
    codeController,
}
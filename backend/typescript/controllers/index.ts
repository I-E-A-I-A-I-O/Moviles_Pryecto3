import { CodeController } from "./email_verification";
import { UserLogin } from "./UserLogin";
import { UserController } from "./user_controller";

const userController = new UserController();
const codeController = new CodeController();
const userLogin = new UserLogin();

export { userController, codeController, userLogin };

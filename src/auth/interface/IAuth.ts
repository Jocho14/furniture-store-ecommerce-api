import { AuthStatus } from "../enum/authStatus";

export interface AuthSuccess {
  status: AuthStatus.SUCCESS;
  token: string;
}

export interface UserNotFound {
  status: AuthStatus.USER_NOT_FOUND;
  message: string;
}

export interface IncorrectPassword {
  status: AuthStatus.INCORRECT_PASSWORD;
  message: string;
}

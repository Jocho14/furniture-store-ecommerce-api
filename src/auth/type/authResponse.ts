import {
  AuthSuccess,
  UserNotFound,
  IncorrectPassword,
} from "../interface/IAuth";

export type AuthResponse = AuthSuccess | UserNotFound | IncorrectPassword;

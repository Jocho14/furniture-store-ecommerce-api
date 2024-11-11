import { AuthStatus } from "../enum/authStatus";
import { Request } from "express";

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

export interface AuthenticatedRequest extends Request {
  user?: {
    status: string;
    token: string;
    statusCode: number;
    message: string;
  };
}

export interface AuthenticatedUser extends Request {
  user?: {
    account_id: number;
    active: true;
    created_at: Date;
    email: string;
    exp: number;
    iat: number;
    role: string;
    user_id: number;
  };
}

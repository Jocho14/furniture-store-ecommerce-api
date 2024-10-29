import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

import { AuthService } from "../auth.service";
import { AuthStatus } from "../enum/authStatus";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string) {
    const validationResponse = await this.authService.validateUser({
      email,
      password,
    });
    switch (validationResponse.status) {
      case AuthStatus.USER_NOT_FOUND:
        throw new NotFoundException();
      case AuthStatus.INCORRECT_PASSWORD:
        throw new UnauthorizedException();
      case AuthStatus.SUCCESS:
        return validationResponse;
      default:
        throw new InternalServerErrorException();
    }
  }
}

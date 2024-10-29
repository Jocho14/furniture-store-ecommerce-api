import { Controller, Post, Body, HttpException } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { AuthStatus } from "./enum/authStatus";
import { HttpStatus } from "@nestjs/common";
import { LoginPayloadDto } from "./DTO/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginPayload: LoginPayloadDto) {
    const authResponse = await this.authService.validateUser(loginPayload);

    switch (authResponse.status) {
      case AuthStatus.USER_NOT_FOUND:
        throw new HttpException(authResponse.message, HttpStatus.NOT_FOUND);
      case AuthStatus.INCORRECT_PASSWORD:
        throw new HttpException(authResponse.message, HttpStatus.UNAUTHORIZED);
      case AuthStatus.SUCCESS:
        return { token: authResponse.token };
      default:
        throw new HttpException(
          "Unexpected error",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
}

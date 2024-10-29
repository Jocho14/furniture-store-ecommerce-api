import { Injectable } from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import { AccountService } from "../modules/accounts/account.service";
import { AuthResponse } from "./type/authResponse";
import { LoginPayloadDto } from "./DTO/login.dto";
import { AuthStatus } from "./enum/authStatus";

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(loginPayload: LoginPayloadDto): Promise<AuthResponse> {
    const findUser = await this.accountService.findByEmail(loginPayload.email);
    if (!findUser) {
      return { status: AuthStatus.USER_NOT_FOUND, message: "User not found" };
    }
    const password = await this.accountService.getPasswordHashForEmail(
      loginPayload.email
    );
    if (loginPayload.password !== password) {
      return {
        status: AuthStatus.INCORRECT_PASSWORD,
        message: "Incorrect password",
      };
    }
    const { password_hash, ...account } = findUser;

    const token = this.jwtService.sign(account);
    return { status: AuthStatus.SUCCESS, token };
  }
}

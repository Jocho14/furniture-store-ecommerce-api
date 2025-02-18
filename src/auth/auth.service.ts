import { Injectable, Inject, forwardRef } from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import { AccountService } from "../modules/accounts/account.service";
import { AuthResponse } from "./type/authResponse";
import { LoginPayloadDto } from "./DTO/login.dto";
import { AuthStatus } from "./enum/authStatus";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config();

@Injectable()
export class AuthService {
  private saltRounds: number;
  constructor(
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService
  ) {
    this.saltRounds = Number(process.env.SALT_ROUNDS);
  }

  async validateUser(loginPayload: LoginPayloadDto): Promise<AuthResponse> {
    const findUser = await this.accountService.findByEmail(loginPayload.email);
    if (!findUser) {
      return { status: AuthStatus.USER_NOT_FOUND, message: "User not found" };
    }
    const password = await this.accountService.getPasswordHashForEmail(
      loginPayload.email
    );

    if (!(await this.comparePasswords(loginPayload.password, password || ""))) {
      return {
        status: AuthStatus.INCORRECT_PASSWORD,
        message: "Incorrect password",
      };
    }
    const { password_hash, ...account } = findUser;
    const token = this.jwtService.sign(account);
    return { status: AuthStatus.SUCCESS, token };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePasswords(
    password: string,
    hash: string
  ): Promise<boolean | null> {
    return await bcrypt.compare(password, hash);
  }
}

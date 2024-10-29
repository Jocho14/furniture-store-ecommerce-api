import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AccountModule } from "../modules/accounts/account.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import * as dotenv from "dotenv";
dotenv.config();

@Module({
  imports: [
    AccountModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

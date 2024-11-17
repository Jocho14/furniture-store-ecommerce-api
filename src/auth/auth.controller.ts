import {
  Controller,
  Post,
  Body,
  HttpException,
  UseGuards,
  Get,
  Req,
  Res,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { AuthStatus } from "./enum/authStatus";
import { HttpStatus } from "@nestjs/common";
import { LoginPayloadDto } from "./DTO/login.dto";
import { AuthGuard } from "@nestjs/passport";
import { LocalGuard } from "./guards/local.guard";
import { JwtGuard } from "./guards/jwt.guard";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "./interface/IAuth";
import { UserService } from "../modules/users/user.service";
import { EmployeeGuard } from "./guards/employee.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post("login")
  @UseGuards(LocalGuard)
  async login(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    if (
      !req.user ||
      req.statusCode === HttpStatus.UNAUTHORIZED ||
      req.statusCode === HttpStatus.NOT_FOUND
    )
      return res.send({ message: "Login failed" });

    const { token } = req.user;

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
      sameSite: "none",
    });

    return res.send({ message: "Login successful" });
  }

  @Get("status")
  @UseGuards(JwtGuard)
  async status(@Req() req: Request) {
    if (!req.user) {
      return { status: "UNAUTHORIZED" };
    }

    return req.user;
  }
}

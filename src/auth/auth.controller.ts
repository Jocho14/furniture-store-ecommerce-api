import {
  Controller,
  Post,
  Body,
  HttpException,
  UseGuards,
  Get,
  Req,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { AuthStatus } from "./enum/authStatus";
import { HttpStatus } from "@nestjs/common";
import { LoginPayloadDto } from "./DTO/login.dto";
import { AuthGuard } from "@nestjs/passport";
import { LocalGuard } from "./guards/local.guard";
import { JwtGuard } from "./guards/jwt.guard";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @UseGuards(LocalGuard)
  async login(@Req() req: Request) {
    return req.user;
  }

  @Get("status")
  @UseGuards(JwtGuard)
  async status(@Req() req: Request) {}
}

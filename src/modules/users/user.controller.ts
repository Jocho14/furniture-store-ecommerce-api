import { Controller, Get, Post, Body, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { ClientGuard } from "../../auth/guards/client.guard";
import { Request } from "express";

import { UserCreateDto } from "./DTO/userCreate.dto";

import { AuthenticatedUser } from "../../auth/interface/IAuth";
import { AccountBasicInfoDto } from "./DTO/accountBasicInfo.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post("create-client")
  async createClient(@Body() userCreateDto: UserCreateDto): Promise<any> {
    return await this.userService.create(userCreateDto);
  }

  @Get("account-basic-info")
  @UseGuards(ClientGuard)
  async getClientBasicInfo(
    @Req() req: AuthenticatedUser
  ): Promise<AccountBasicInfoDto | null> {
    if (!req.user) {
      return null;
    }

    return await this.userService.getClientBasicInfo(req);
  }
}

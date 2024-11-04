import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";

import { UserCreateDto } from "./DTO/userCreate.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post("create-client")
  createClient(@Body() userCreateDto: UserCreateDto): Promise<any> {
    return this.userService.create(userCreateDto);
  }
}

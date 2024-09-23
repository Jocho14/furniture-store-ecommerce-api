import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";

@Controller("Users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(":phoneNumber")
  findByPhoneNumber(
    @Param("phoneNumber") phoneNumber: string
  ): Promise<User | null> {
    return this.userService.findByPhoneNumber(phoneNumber);
  }

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }
}

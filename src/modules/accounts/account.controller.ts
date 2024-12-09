import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { AccountService } from "./account.service";
import { Account } from "./account.entity";

@Controller("Accounts")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get(":email")
  findByEmail(@Param("email") email: string): Promise<Account | null> {
    return this.accountService.findByEmail(email);
  }
}

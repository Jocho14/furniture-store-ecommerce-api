import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "./account.entity";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { AccountRepository } from "./account.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountService, AccountRepository],
  controllers: [AccountController],
})
export class AccountModule {}

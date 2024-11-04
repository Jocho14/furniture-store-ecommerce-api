import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "./account.entity";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { AccountRepository } from "./account.repository";
import { AuthModule } from "../../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Account]), forwardRef(() => AuthModule)],
  providers: [AccountService, AccountRepository],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}

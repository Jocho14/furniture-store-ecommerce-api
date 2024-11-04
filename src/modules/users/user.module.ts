import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { AccountModule } from "../accounts/account.module";
import { ClientModule } from "../clients/client.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), AccountModule, ClientModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}

import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { AccountModule } from "../accounts/account.module";
import { ClientModule } from "../clients/client.module";
import { EmployeeModule } from "../employees/employee.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => ClientModule),
    forwardRef(() => EmployeeModule),
    AccountModule,
  ],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

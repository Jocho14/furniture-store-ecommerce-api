import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Employee } from "./employee.entity";
import { EmployeeService } from "./employee.service";
import { EmployeeRepository } from "./employee.repository";
import { UserModule } from "../users/user.module";
import { EmployeeController } from "./employee.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), forwardRef(() => UserModule)],
  providers: [EmployeeService, EmployeeRepository],
  controllers: [EmployeeController],
  exports: [EmployeeService],
})
export class EmployeeModule {}

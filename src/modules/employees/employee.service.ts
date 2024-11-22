import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { EmployeeRepository } from "./employee.repository";
import { Employee } from "./employee.entity";

import { UserService } from "../users/user.service";

@Injectable()
export class EmployeeService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  async getEmployeeId(id: number): Promise<number | null> {
    return await this.employeeRepository.getEmployeeId(id);
  }

  async create(employee: Employee): Promise<any> {
    return await this.employeeRepository.createEmployee(employee);
  }
}

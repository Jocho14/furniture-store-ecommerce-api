import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Employee } from "./employee.entity";

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly repository: Repository<Employee>
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Employee | null> {
    return this.repository.findOne({ where: { employee_id: id } });
  }

  async createEmployee(employee: Employee): Promise<Employee> {
    return await this.repository.save(employee);
  }

  async getEmployeeId(userId: number): Promise<number | null> {
    const employee = await this.repository.findOne({
      where: { user_id: userId },
    });
    return employee ? employee.employee_id : null;
  }
}

import { Controller, Post, Req, Body, Param, UseGuards } from "@nestjs/common";

import { EmployeeService } from "./employee.service";

@Controller("Employees")
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
}

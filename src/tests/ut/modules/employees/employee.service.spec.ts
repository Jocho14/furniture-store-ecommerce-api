import { Test, TestingModule } from "@nestjs/testing";
import { EmployeeService } from "../../../../modules/employees/employee.service";
import { EmployeeRepository } from "../../../../modules/employees/employee.repository";
import { UserService } from "../../../../modules/users/user.service";

describe("EmployeeService", () => {
  let service: EmployeeService;
  let employeeRepository: EmployeeRepository;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: EmployeeRepository,
          useValue: {
            getEmployeeId: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    employeeRepository = module.get<EmployeeRepository>(EmployeeRepository);
    userService = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return employee id if found", async () => {
    const id = 1;
    const employeeId = 123;
    jest
      .spyOn(employeeRepository, "getEmployeeId")
      .mockResolvedValue(employeeId);

    const result = await service.getEmployeeId(id);
    expect(result).toBe(employeeId);
    expect(employeeRepository.getEmployeeId).toHaveBeenCalledWith(id);
  });

  it("should return null if employee id not found", async () => {
    const id = 1;
    jest.spyOn(employeeRepository, "getEmployeeId").mockResolvedValue(null);

    const result = await service.getEmployeeId(id);
    expect(result).toBeNull();
    expect(employeeRepository.getEmployeeId).toHaveBeenCalledWith(id);
  });
});

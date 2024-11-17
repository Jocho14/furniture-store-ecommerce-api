import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";
import { UserCreateDto } from "./DTO/userCreate.dto";
import { Account } from "../accounts/account.entity";
import { AccountService } from "../accounts/account.service";
import { Client } from "../clients/client.entity";
import { ClientService } from "../clients/client.service";
import { EmployeeService } from "../employees/employee.service";
import { userRole } from "../../auth/enum/userRole";
import { AccountBasicInfoDto } from "./DTO/accountBasicInfo.dto";
import { AuthenticatedUser } from "../../auth/interface/IAuth";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountService: AccountService,
    private readonly clientService: ClientService,
    private readonly employeeService: EmployeeService
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async create(userCreateDto: UserCreateDto): Promise<any> {
    const user = new User(
      userCreateDto.firstName,
      userCreateDto.lastName,
      userCreateDto.phoneNumber,
      userCreateDto.dateOfBirth
    );
    const createUserResponse = await this.userRepository.createUser(user);

    const account = new Account(
      createUserResponse.user_id,
      userCreateDto.account.email,
      userCreateDto.account.password
    );
    await this.accountService.create(account);

    const client = new Client(createUserResponse.user_id);
    await this.clientService.create(client);

    return createUserResponse;
  }

  async getUserFirstName(id: number | null): Promise<string | null> {
    return await this.userRepository.getFirstName(id);
  }

  async getClientId(userId: number): Promise<number | null> {
    return await this.clientService.getClientId(userId);
  }

  async getUserRole(userId: number): Promise<string | null> {
    const maybeClient = await this.clientService.getClientId(userId);
    const maybeEmployee = await this.employeeService.getEmployeeId(userId);
    if (maybeClient) return userRole.CLIENT;
    if (maybeEmployee) return userRole.EMPLOYEE;
    return null;
  }

  async getClientBasicInfo(
    req: AuthenticatedUser
  ): Promise<AccountBasicInfoDto | null> {
    if (!req.user) {
      return null;
    }
    const firstName = await this.clientService.getUserFirstName(
      req.user.user_id
    );
    console.log("User id: ", req.user.user_id);
    console.log("FIRST NAME: ", firstName);
    return new AccountBasicInfoDto(
      req.user.account_id,
      req.user.role,
      firstName || ""
    );
  }
}

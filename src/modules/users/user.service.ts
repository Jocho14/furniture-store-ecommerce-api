import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";
import { UserCreateDto } from "./DTO/userCreate.dto";
import { Account } from "../accounts/account.entity";
import { AccountService } from "../accounts/account.service";
import { Client } from "../clients/client.entity";
import { ClientService } from "../clients/client.service";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountService: AccountService,
    private readonly clientService: ClientService
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
}

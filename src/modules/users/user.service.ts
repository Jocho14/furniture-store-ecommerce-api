import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.userRepository.findByPhoneNumber(phoneNumber);
  }

  create(user: User): Promise<User> {
    return this.userRepository.createUser(user);
  }
}

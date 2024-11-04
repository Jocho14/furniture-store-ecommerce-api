import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { User } from "./user.entity";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async createUser(user: User): Promise<User> {
    return await this.repository.save(user);
  }
}

import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Account } from "./account.entity";

@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>
  ) {}

  async findByEmail(email: string): Promise<Account | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async getPasswordHashForEmail(email: string): Promise<Account | null> {
    return await this.repository.findOne({ where: { email: email } });
  }

  async findAll(): Promise<Account[]> {
    return await this.repository.find();
  }

  async createAccount(account: Account): Promise<Account> {
    return await this.repository.save(account);
  }
}

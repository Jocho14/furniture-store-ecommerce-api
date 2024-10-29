import { Injectable } from "@nestjs/common";
import { AccountRepository } from "./account.repository";
import { Account } from "./account.entity";

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async findAll(): Promise<Account[]> {
    return await this.accountRepository.findAll();
  }

  async findByEmail(email: string): Promise<Account | null> {
    return await this.accountRepository.findByEmail(email);
  }

  async getPasswordHashForEmail(email: string): Promise<string | null> {
    const account = await this.accountRepository.getPasswordHashForEmail(email);
    return account ? account.password_hash : null;
  }

  async create(account: Account): Promise<Account> {
    return await this.accountRepository.createAccount(account);
  }
}

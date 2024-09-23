import { Injectable } from "@nestjs/common";
import { AccountRepository } from "./account.repository";
import { Account } from "./account.entity";

@Injectable()
export class AccountService {
  constructor(private readonly AccountRepository: AccountRepository) {}

  findAll(): Promise<Account[]> {
    return this.AccountRepository.findAll();
  }

  findByEmail(email: string): Promise<Account | null> {
    return this.AccountRepository.findByEmail(email);
  }

  create(account: Account): Promise<Account> {
    return this.AccountRepository.createAccount(account);
  }
}

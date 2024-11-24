import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { AccountRepository } from "./account.repository";
import { Account } from "./account.entity";
import { AuthService } from "../../auth/auth.service";

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {}

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
    account.password_hash = await this.authService.hashPassword(
      account.password_hash
    );
    return await this.accountRepository.createAccount(account);
  }

  async getEmail(userId: number): Promise<string | null> {
    return await this.accountRepository.getEmail(userId);
  }
}

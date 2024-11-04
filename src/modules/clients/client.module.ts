import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "./client.entity";
import { ClientService } from "./client.service";
import { ClientRepository } from "./client.repository";
import { UserModule } from "../users/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Client]), forwardRef(() => UserModule)],
  providers: [ClientService, ClientRepository],
  exports: [ClientService],
})
export class ClientModule {}

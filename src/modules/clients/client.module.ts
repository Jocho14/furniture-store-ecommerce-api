import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "./client.entity";
import { ClientService } from "./client.service";
import { ClientRepository } from "./client.repository";
import { UserModule } from "../users/user.module";
import { ClientController } from "./client.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Client]), forwardRef(() => UserModule)],
  providers: [ClientService, ClientRepository],
  controllers: [ClientController],
  exports: [ClientService],
})
export class ClientModule {}

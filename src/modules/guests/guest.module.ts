import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Guest } from "./guest.entity";
import { GuestService } from "./guest.service";
import { GuestController } from "./guest.controller";
import { GuestRepository } from "./guest.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Guest])],
  providers: [GuestService, GuestRepository],
  controllers: [GuestController],
  exports: [GuestService],
})
export class GuestModule {}

import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, forwardRef } from "@nestjs/common";

import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { ReviewRepository } from "./review.repository";
import { Review } from "./review.entity";
import { ClientModule } from "../clients/client.module";

@Module({
  imports: [TypeOrmModule.forFeature([Review]), forwardRef(() => ClientModule)],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
  exports: [ReviewService],
})
export class ReviewModule {}

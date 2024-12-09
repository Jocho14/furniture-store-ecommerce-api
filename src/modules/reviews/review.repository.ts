import { Repository, In } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Review } from "./review.entity";

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(Review)
    private readonly repository: Repository<Review>
  ) {}

  async getReviews(id: number): Promise<Review[]> {
    return await this.repository.find({
      where: { product_id: id },
    });
  }

  async addReview(
    productId: number,
    review: any,
    clientId: number
  ): Promise<any> {
    return await this.repository.save({
      product_id: productId,
      client_id: clientId,
      rating: review.rating,
      comment: review.comment,
    });
  }

  async deleteAll(): Promise<void> {
    await this.repository.delete({});
  }
}

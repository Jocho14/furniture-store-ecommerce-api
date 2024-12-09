import { Injectable } from "@nestjs/common";

import { ReviewRepository } from "./review.repository";
import { GetReviewDto } from "./DTO/getReview.dto";
import { ClientService } from "../clients/client.service";
import { CreateReviewDto } from "./DTO/createReview.dto";

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly clientService: ClientService
  ) {}

  async getReviewsForProduct(productId: number): Promise<GetReviewDto[]> {
    const reviews = await this.reviewRepository.getReviews(productId);

    const reviewsDto = await Promise.all(
      reviews.map(async (review) => {
        const userId = await this.clientService.getUserId(review.client_id);
        if (!userId) {
          throw new Error("User ID not found");
        }
        const clientFirstName = await this.clientService.getUserFirstName(
          userId
        );

        return {
          reviewId: review.review_id,
          reviewerName: clientFirstName ? clientFirstName : "Anonymous",
          rating: review.rating,
          comment: review.comment,
          reviewDate: review.review_date,
        };
      })
    );

    return reviewsDto;
  }

  async addReview(
    productId: number,
    createReviewDto: CreateReviewDto,
    clientId: number | null
  ): Promise<any> {
    if (!clientId) {
      throw new Error("Client ID not found");
    }

    return await this.reviewRepository.addReview(
      productId,
      createReviewDto,
      clientId
    );
  }
}

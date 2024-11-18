import { Test, TestingModule } from "@nestjs/testing";
import { ReviewService } from "../../../modules/reviews/review.service";
import { ReviewRepository } from "../../../modules/reviews/review.repository";
import { ClientService } from "../../../modules/clients/client.service";
import { GetReviewDto } from "../../../modules/reviews/DTO/getReview.dto";
import { CreateReviewDto } from "../../../modules/reviews/DTO/createReview.dto";
import { Review } from "../../../modules/reviews/review.entity";

describe("ReviewService", () => {
  let reviewService: ReviewService;
  let reviewRepository: ReviewRepository;
  let clientService: ClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: ReviewRepository,
          useValue: {
            getReviews: jest.fn(),
            addReview: jest.fn(),
          },
        },
        {
          provide: ClientService,
          useValue: {
            getUserFirstName: jest.fn(),
          },
        },
      ],
    }).compile();

    reviewService = module.get<ReviewService>(ReviewService);
    reviewRepository = module.get<ReviewRepository>(ReviewRepository);
    clientService = module.get<ClientService>(ClientService);
  });

  it("should return an array of GetReviewDto", async () => {
    const productId = 1;
    const reviews = [
      {
        review_id: 1,
        client_id: 1,
        rating: 5,
        comment: "Great product!",
        review_date: new Date(),
      },
    ] as Review[];
    const clientFirstName = "Jan";

    jest.spyOn(reviewRepository, "getReviews").mockResolvedValue(reviews);
    jest
      .spyOn(clientService, "getUserFirstName")
      .mockResolvedValue(clientFirstName);

    const result = await reviewService.getReviewsForProduct(productId);

    expect(result).toEqual([
      {
        reviewId: 1,
        reviewerName: "Jan",
        rating: 5,
        comment: "Great product!",
        reviewDate: reviews[0].review_date,
      },
    ]);
  });

  it("should return 'Anonymous' if client first name is not found", async () => {
    const productId = 1;
    const reviews = [
      {
        review_id: 1,
        client_id: 1,
        rating: 5,
        comment: "Great product!",
        review_date: new Date(),
      },
    ] as Review[];

    jest.spyOn(reviewRepository, "getReviews").mockResolvedValue(reviews);
    jest.spyOn(clientService, "getUserFirstName").mockResolvedValue(null);

    const result = await reviewService.getReviewsForProduct(productId);

    expect(result).toEqual([
      {
        reviewId: 1,
        reviewerName: "Anonymous",
        rating: 5,
        comment: "Great product!",
        reviewDate: reviews[0].review_date,
      },
    ]);
  });

  it("should add a review and return the result", async () => {
    const productId = 1;
    const createReviewDto: CreateReviewDto = {
      rating: 5,
      comment: "Excellent!",
    };
    const clientId = 1;
    const addedReview = { id: 1, ...createReviewDto, clientId, productId };

    jest.spyOn(reviewRepository, "addReview").mockResolvedValue(addedReview);

    const result = await reviewService.addReview(
      productId,
      createReviewDto,
      clientId
    );

    expect(result).toEqual(addedReview);
  });

  it("should throw an error if clientId is null", async () => {
    const productId = 1;
    const createReviewDto: CreateReviewDto = {
      rating: 5,
      comment: "Excellent!",
    };
    const clientId = null;

    await expect(
      reviewService.addReview(productId, createReviewDto, clientId)
    ).rejects.toThrow("Client ID not found");
  });
});

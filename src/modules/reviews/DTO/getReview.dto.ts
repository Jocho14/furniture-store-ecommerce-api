import { IsNumber, IsNotEmpty, IsString, IsDate } from "class-validator";

export class GetReviewDto {
  constructor(
    reviewId: number,
    reviewerName: string,
    rating: number,
    comment: string,
    reviewDate: Date
  ) {
    this.reviewId = reviewId;
    this.reviewerName = reviewerName;
    this.rating = rating;
    this.comment = comment;
    this.reviewDate = reviewDate;
  }
  @IsNumber()
  @IsNotEmpty()
  readonly reviewId!: number;

  @IsString()
  @IsNotEmpty()
  readonly reviewerName!: string;

  @IsNumber()
  @IsNotEmpty()
  readonly rating!: number;

  @IsString()
  readonly comment!: string;

  @IsDate()
  @IsNotEmpty()
  readonly reviewDate!: Date;
}

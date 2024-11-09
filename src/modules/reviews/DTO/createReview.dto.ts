import { IsNumber, IsNotEmpty, IsString } from "class-validator";

export class CreateReviewDto {
  constructor(rating: number, comment: string) {
    this.rating = rating;
    this.comment = comment;
  }

  @IsNumber()
  @IsNotEmpty()
  readonly rating!: number;

  @IsString()
  readonly comment!: string;
}

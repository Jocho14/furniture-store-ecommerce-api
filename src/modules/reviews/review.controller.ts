import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from "@nestjs/common";

import { ReviewService } from "./review.service";
import { GetReviewDto } from "./DTO/getReview.dto";
@Controller("Reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
}

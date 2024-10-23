import { ProductWithThumbnailDto } from "./DTO/productWithThumbnail.dto";

export type AddProductResponse = ProductWithThumbnailDto | { error: string };

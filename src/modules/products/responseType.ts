import { PreviewProductDto } from "./DTO/previewProduct.dto";

export type AddProductResponse = PreviewProductDto | { error: string };
export type UpdateProductResponse = PreviewProductDto | { error: string };
export type DeactivateProductResponse = PreviewProductDto | { error: string };

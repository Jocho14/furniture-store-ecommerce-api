import { IsString, IsNumber, IsNotEmpty, isNumber } from "class-validator";

export class ThumbnailProductDto {

    @IsNumber()
    @IsNotEmpty()
    id!: number;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNumber()
    @IsNotEmpty()
    price!: number;

    @IsString()
    @IsNotEmpty()
    thumbnail!: string;

    @IsString()
    @IsNotEmpty()
    alt!: string;

    @IsNumber()
    @IsNotEmpty()
    quantity!: number;
}

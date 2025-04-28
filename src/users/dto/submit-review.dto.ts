import { IsNumber, IsString, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitReviewDto {
    @ApiProperty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    comment: string;
}
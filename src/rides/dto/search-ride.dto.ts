import { IsString, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchRideDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    whereFrom: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    whereTo: string;

    @ApiProperty()
    @IsDateString()
    date: string;

    @ApiProperty()
    @IsNumber()
    passengers: number;
}
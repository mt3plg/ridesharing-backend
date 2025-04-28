import { IsString, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRideDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    startLocation: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    destination: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    distance: string;

    @ApiProperty()
    @IsDateString()
    date: string;

    @ApiProperty()
    @IsNumber()
    passengerCount: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    vehicleType: string;
}
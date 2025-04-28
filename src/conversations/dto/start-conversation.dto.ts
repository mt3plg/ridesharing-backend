import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartConversationDto {
    @ApiProperty()
    @IsNumber()
    driverId: number;

    @ApiProperty()
    @IsNumber()
    passengerId: number;

    @ApiProperty()
    @IsNumber()
    rideId: number;
}
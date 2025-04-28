import { Controller, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RidesService } from './rides.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateRideDto, SearchRideDto } from './dto';

@ApiTags('rides')
@Controller('rides')
export class RidesController {
    constructor(private ridesService: RidesService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new ride' })
    @Post()
    async createRide(@Body() createRideDto: CreateRideDto, @Request() req) {
        const ride = await this.ridesService.createRide(createRideDto, req.user.userId);
        return { success: true, ride };
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Search for rides' })
    @Post('search')
    async searchRides(@Body() searchDto: SearchRideDto) {
        const rides = await this.ridesService.searchRides(searchDto);
        return { success: true, rides };
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Book a ride' })
    @Post(':rideId/book')
    async bookRide(@Param('rideId') rideId: string, @Request() req) {
        const ride = await this.ridesService.bookRide(parseInt(rideId), req.user.userId);
        return { success: true, rideId: ride.id, status: ride.status };
    }
}
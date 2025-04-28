import { Controller, Get, Param, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubmitReviewDto } from './dto/submit-review.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user profile' })
    @Get(':userId')
    async getUserProfile(@Param('userId') userId: string, @Request() req) {
        const profile = await this.usersService.getUserProfile(parseInt(userId), req.user.userId);
        return { success: true, user: profile };
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add a friend' })
    @Post(':userId/friends')
    async addFriend(@Param('userId') userId: string, @Request() req) {
        const result = await this.usersService.addFriend(req.user.userId, parseInt(userId));
        return { success: true, ...result };
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Submit a review' })
    @Post(':userId/reviews')
    async submitReview(
        @Param('userId') userId: string,
        @Body() submitReviewDto: SubmitReviewDto,
        @Request() req,
    ) {
        const { rating, comment } = submitReviewDto;
        const result = await this.usersService.submitReview(
            parseInt(userId),
            rating,
            comment,
            req.user.userId,
            req.user.name,
        );
        return { success: true, review: result.review, newRating: result.newRating };
    }
}
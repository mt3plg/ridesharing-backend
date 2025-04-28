import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 401, description: 'Email already exists' })
    async signUp(@Body() signUpDto: SignUpDto) {
        const result = await this.authService.signUp(signUpDto);
        return { success: true, ...result };
    }

    @Post('signin')
    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({ status: 200, description: 'User logged in successfully' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async signIn(@Body() signInDto: SignInDto) {
        const result = await this.authService.signIn(signInDto);
        return { success: true, ...result };
    }

    @Post('verify')
    @ApiOperation({ summary: 'Verify user email' })
    @ApiResponse({ status: 200, description: 'Email verified successfully' })
    @ApiResponse({ status: 401, description: 'Invalid token' })
    async verifyEmail(@Body('token') token: string) {
        const result = await this.authService.verifyEmail(token);
        return { success: true, ...result };
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user' })
    @Post('me')
    async getMe(@Request() req) {
        return { success: true, user: req.user };
    }
}
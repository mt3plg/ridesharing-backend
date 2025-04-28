import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StartConversationDto } from './dto/start-conversation.dto';

@ApiTags('conversations')
@Controller('conversations')
export class ConversationsController {
    constructor(private conversationsService: ConversationsService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Start a conversation' })
    @Post('start')
    async startConversation(@Body() body: StartConversationDto) {
        const conversation = await this.conversationsService.startConversation(
            body.driverId,
            body.passengerId,
            body.rideId,
        );
        return { success: true, conversationId: conversation.id };
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get conversation messages' })
    @Get(':conversationId/messages')
    async getMessages(@Param('conversationId') conversationId: string) {
        const messages = await this.conversationsService.getMessages(parseInt(conversationId));
        return { success: true, messages };
    }
}
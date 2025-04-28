import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ConversationsService } from './conversations.service';

@WebSocketGateway({ cors: true })
export class ConversationsGateway {
    constructor(private conversationsService: ConversationsService) {}

    @SubscribeMessage('message')
    async handleMessage(
        @MessageBody() data: { conversationId: number; content: string; senderId: number },
        @ConnectedSocket() client: Socket,
    ) {
        const message = await this.conversationsService.sendMessage(data.conversationId, data.content, data.senderId);
        client.broadcast.emit(`conversation:${data.conversationId}`, message);
        return message;
    }
}
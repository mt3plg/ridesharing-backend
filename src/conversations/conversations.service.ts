import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConversationsService {
    constructor(private prisma: PrismaService) {}

    async startConversation(driverId: number, passengerId: number, rideId: number) {
        let conversation = await this.prisma.conversation.findFirst({
            where: { driverId, passengerId, rideId },
        });
        if (!conversation) {
            conversation = await this.prisma.conversation.create({
                data: { driverId, passengerId, rideId },
            });
        }
        return conversation;
    }

    async getMessages(conversationId: number) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { messages: true },
        });
        if (!conversation) throw new NotFoundException('Conversation not found');
        return conversation.messages;
    }

    async sendMessage(conversationId: number, content: string, senderId: number) {
        const message = await this.prisma.message.create({
            data: {
                content,
                senderId,
                conversationId,
            },
        });
        return message;
    }
}
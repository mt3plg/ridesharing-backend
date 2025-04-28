import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async getUserProfile(userId: number, currentUserId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                trips: true,
                reviews: {
                    include: { author: true },
                },
                friends: true,
            },
        });
        if (!user) throw new NotFoundException('User not found');
        const isFriend = user.friends.some(friend => friend.id === currentUserId);
        return {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            rating: user.rating,
            trips: user.trips.map(trip => ({
                id: trip.id,
                date: trip.date.toISOString().split('T')[0],
                route: `${trip.startLocation} - ${trip.destination}`,
                role: trip.driverId === userId ? 'Driver' : 'Passenger',
            })),
            reviews: user.reviews.map(review => ({
                id: review.id,
                author: review.author.name,
                rating: review.rating,
                comment: review.comment,
                date: review.date,
            })),
            isFriend,
        };
    }

    async addFriend(userId: number, friendId: number) {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                friends: { connect: { id: friendId } },
            },
        });
        await this.prisma.user.update({
            where: { id: friendId },
            data: {
                friends: { connect: { id: userId } },
            },
        });
        return { message: 'Friend added' };
    }

    async submitReview(userId: number, rating: number, comment: string, authorId: number, authorName: string) {
        const review = await this.prisma.review.create({
            data: {
                rating,
                comment,
                authorId,
                userId,
                date: new Date().toISOString().split('T')[0],
            },
        });
        const reviews = await this.prisma.review.findMany({ where: { userId } });
        const newRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await this.prisma.user.update({
            where: { id: userId },
            data: { rating: newRating },
        });
        return {
            review: {
                id: review.id,
                author: authorName,
                rating: review.rating,
                comment: review.comment,
                date: review.date,
            },
            newRating,
        };
    }
}
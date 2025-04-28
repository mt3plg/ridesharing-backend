import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRideDto, SearchRideDto } from './dto';

@Injectable()
export class RidesService {
    constructor(private prisma: PrismaService) {}

    async createRide(dto: CreateRideDto, driverId: number) {
        const { startLocation, destination, distance, date, passengerCount, vehicleType } = dto;
        const ride = await this.prisma.ride.create({
            data: {
                startLocation,
                destination,
                distance,
                date: new Date(date),
                passengerCount,
                vehicleType,
                status: 'active',
                driverId,
            },
        });
        return ride;
    }

    async searchRides(dto: SearchRideDto) {
        const { whereFrom, whereTo, date, passengers } = dto;
        const rides = await this.prisma.ride.findMany({
            where: {
                startLocation: { contains: whereFrom, mode: 'insensitive' },
                destination: { contains: whereTo, mode: 'insensitive' },
                date: { gte: new Date(date), lte: new Date(date) },
                passengerCount: { gte: passengers },
                status: 'active',
            },
            include: { driver: true },
        });
        return rides.map(ride => ({
            id: ride.id,
            startLocation: ride.startLocation,
            destination: ride.destination,
            date: ride.date.toISOString(),
            driver: {
                id: ride.driverId,
                name: ride.driver.name,
                rating: ride.driver.rating,
            },
            vehicleType: ride.vehicleType,
            price: '1200 UAH', // Приклад
            status: ride.status,
        }));
    }

    async bookRide(rideId: number, passengerId: number) {
        const ride = await this.prisma.ride.update({
            where: { id: rideId },
            data: {
                passengers: { connect: { id: passengerId } },
                status: 'booked',
            },
        });
        return ride;
    }
}
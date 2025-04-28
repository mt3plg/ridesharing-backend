import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto, SignInDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async signUp(dto: SignUpDto) {
        const { name, email, phone, password } = dto;
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new UnauthorizedException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                role: 'passenger',
                status: 'pending',
            },
        });
        // Тут можна додати логіку надсилання email для верифікації (наприклад, через SendGrid)
        return { userId: user.id, message: 'Verification email sent' };
    }

    async signIn(dto: SignInDto) {
        const { email, password } = dto;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        if (user.status !== 'active') {
            throw new UnauthorizedException('Email not verified');
        }
        const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
        const token = this.jwtService.sign(payload);
        return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
    }

    async verifyEmail(token: string) {
        // Логіка верифікації email (для прикладу, token = userId)
        const user = await this.prisma.user.findFirst({ where: { id: parseInt(token) } });
        if (!user) throw new UnauthorizedException('Invalid token');
        await this.prisma.user.update({ where: { id: user.id }, data: { status: 'active' } });
        const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
        const jwtToken = this.jwtService.sign(payload);
        return { token: jwtToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
    }
}
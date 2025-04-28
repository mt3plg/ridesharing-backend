import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RidesModule } from './rides/rides.module';
import { ConversationsModule } from './conversations/conversations.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RidesModule,
    ConversationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(helmet())
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    const config = new DocumentBuilder()
      .setTitle('Ridesharing API')
      .setDescription('API for Ridesharing App')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(this, config);
    SwaggerModule.setup('api', this, document);
  }
}

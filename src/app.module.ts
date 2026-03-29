import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Comment } from './comments/comments.entity';

@Module({
  imports: [
    UsersModule,
    CommentsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? 'root',
      database: process.env.DB_NAME ?? 'nest_db',
      autoLoadEntities: true,
      synchronize: true,
      entities: [User, Comment],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

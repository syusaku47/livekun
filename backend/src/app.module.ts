import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LivesModule } from './lives/lives.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'livekun',
      password: process.env.DB_PASSWORD || 'livekun',
      database: process.env.DB_NAME || 'livekun',
      autoLoadEntities: true,
      synchronize: true,
    }),
    LivesModule,
  ],
})
export class AppModule {}

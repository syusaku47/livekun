import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Live } from './entities/live.entity';
import { SetlistItem } from './entities/setlist-item.entity';
import { NearbyFacility } from './entities/nearby-facility.entity';
import { Photo } from './entities/photo.entity';
import { LivesService } from './lives.service';
import { LivesController } from './lives.controller';
import { S3Service } from './s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Live, SetlistItem, NearbyFacility, Photo]),
  ],
  controllers: [LivesController],
  providers: [LivesService, S3Service],
})
export class LivesModule {}

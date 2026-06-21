import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { Live } from './entities/live.entity';
import { SetlistItem } from './entities/setlist-item.entity';
import { NearbyFacility } from './entities/nearby-facility.entity';
import { Photo } from './entities/photo.entity';
import { CreateLiveDto } from './dto/create-live.dto';

@Injectable()
export class LivesService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  constructor(
    @InjectRepository(Live)
    private readonly liveRepo: Repository<Live>,
    @InjectRepository(SetlistItem)
    private readonly setlistRepo: Repository<SetlistItem>,
    @InjectRepository(NearbyFacility)
    private readonly facilityRepo: Repository<NearbyFacility>,
    @InjectRepository(Photo)
    private readonly photoRepo: Repository<Photo>,
  ) {
    this.region = process.env.AWS_REGION || 'ap-northeast-1';
    this.bucket = process.env.S3_BUCKET || 'livekun-diary-dev';
    this.s3 = new S3Client({ region: this.region });
  }

  async findAll(userId: string): Promise<Live[]> {
    return this.liveRepo.find({
      where: { user: { id: userId } },
      order: { performanceDate: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Live> {
    const live = await this.liveRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!live) throw new NotFoundException('Live record not found');
    if (live.user && live.user.id !== userId) {
      throw new ForbiddenException();
    }
    return live;
  }

  async create(dto: CreateLiveDto, userId: string): Promise<Live> {
    const live = this.liveRepo.create({
      artistName: dto.artistName,
      performanceDate: dto.performanceDate,
      venueName: dto.venueName,
      tourName: dto.tourName ?? '',
      startTime: dto.startTime ?? '',
      endTime: dto.endTime ?? '',
      googleMapUrl: dto.googleMapUrl ?? '',
      impression: dto.impression ?? '',
      user: { id: userId },
      setlist: dto.setlist?.map((s) =>
        this.setlistRepo.create({
          order: s.order,
          title: s.title,
          type: s.type,
        }),
      ),
      nearbyFacilities: dto.nearbyFacilities?.map((f) =>
        this.facilityRepo.create({
          name: f.name,
          category: f.category,
          memo: f.memo ?? '',
        }),
      ),
    });
    return this.liveRepo.save(live);
  }

  async update(
    id: string,
    dto: CreateLiveDto,
    userId: string,
  ): Promise<Live> {
    const live = await this.findOne(id, userId);

    await this.setlistRepo.delete({ live: { id } });
    await this.facilityRepo.delete({ live: { id } });

    Object.assign(live, {
      artistName: dto.artistName,
      performanceDate: dto.performanceDate,
      venueName: dto.venueName,
      tourName: dto.tourName ?? '',
      startTime: dto.startTime ?? '',
      endTime: dto.endTime ?? '',
      googleMapUrl: dto.googleMapUrl ?? '',
      impression: dto.impression ?? '',
      setlist: dto.setlist?.map((s) =>
        this.setlistRepo.create({
          order: s.order,
          title: s.title,
          type: s.type,
        }),
      ),
      nearbyFacilities: dto.nearbyFacilities?.map((f) =>
        this.facilityRepo.create({
          name: f.name,
          category: f.category,
          memo: f.memo ?? '',
        }),
      ),
    });

    return this.liveRepo.save(live);
  }

  async remove(id: string, userId: string): Promise<void> {
    const live = await this.findOne(id, userId);
    await this.liveRepo.remove(live);
  }

  async addPhotos(
    id: string,
    files: Express.Multer.File[],
    userId: string,
  ): Promise<Photo[]> {
    const live = await this.findOne(id, userId);

    const photos: Photo[] = [];
    for (const file of files) {
      const ext = extname(file.originalname);
      const key = `photos/${userId}/${uuidv4()}${ext}`;

      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const s3Url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

      const photo = this.photoRepo.create({
        filename: file.originalname,
        path: s3Url,
        mimetype: file.mimetype,
        size: file.size,
        live,
      });
      photos.push(photo);
    }

    return this.photoRepo.save(photos);
  }
}

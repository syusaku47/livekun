import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Live } from './entities/live.entity';
import { SetlistItem } from './entities/setlist-item.entity';
import { NearbyFacility } from './entities/nearby-facility.entity';
import { Photo } from './entities/photo.entity';
import { CreateLiveDto } from './dto/create-live.dto';

@Injectable()
export class LivesService {
  constructor(
    @InjectRepository(Live)
    private readonly liveRepo: Repository<Live>,
    @InjectRepository(SetlistItem)
    private readonly setlistRepo: Repository<SetlistItem>,
    @InjectRepository(NearbyFacility)
    private readonly facilityRepo: Repository<NearbyFacility>,
    @InjectRepository(Photo)
    private readonly photoRepo: Repository<Photo>,
  ) {}

  async findAll(): Promise<Live[]> {
    return this.liveRepo.find({
      order: { performanceDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Live> {
    const live = await this.liveRepo.findOne({ where: { id } });
    if (!live) throw new NotFoundException('Live record not found');
    return live;
  }

  async create(dto: CreateLiveDto): Promise<Live> {
    const live = this.liveRepo.create({
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

  async update(id: string, dto: CreateLiveDto): Promise<Live> {
    const live = await this.findOne(id);

    // Delete old relations
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

  async remove(id: string): Promise<void> {
    const live = await this.findOne(id);
    await this.liveRepo.remove(live);
  }

  async addPhotos(
    id: string,
    files: Express.Multer.File[],
  ): Promise<Photo[]> {
    const live = await this.findOne(id);
    const photos = files.map((file) =>
      this.photoRepo.create({
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        live,
      }),
    );
    return this.photoRepo.save(photos);
  }
}

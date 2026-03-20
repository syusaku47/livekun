import { Repository } from 'typeorm';
import { Live } from './entities/live.entity';
import { SetlistItem } from './entities/setlist-item.entity';
import { NearbyFacility } from './entities/nearby-facility.entity';
import { Photo } from './entities/photo.entity';
import { CreateLiveDto } from './dto/create-live.dto';
export declare class LivesService {
    private readonly liveRepo;
    private readonly setlistRepo;
    private readonly facilityRepo;
    private readonly photoRepo;
    constructor(liveRepo: Repository<Live>, setlistRepo: Repository<SetlistItem>, facilityRepo: Repository<NearbyFacility>, photoRepo: Repository<Photo>);
    findAll(): Promise<Live[]>;
    findOne(id: string): Promise<Live>;
    create(dto: CreateLiveDto): Promise<Live>;
    update(id: string, dto: CreateLiveDto): Promise<Live>;
    remove(id: string): Promise<void>;
    addPhotos(id: string, files: Express.Multer.File[]): Promise<Photo[]>;
}

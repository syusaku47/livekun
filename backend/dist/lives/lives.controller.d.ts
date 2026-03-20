import { LivesService } from './lives.service';
import { CreateLiveDto } from './dto/create-live.dto';
export declare class LivesController {
    private readonly livesService;
    constructor(livesService: LivesService);
    findAll(): Promise<import("./entities/live.entity").Live[]>;
    findOne(id: string): Promise<import("./entities/live.entity").Live>;
    create(dto: CreateLiveDto): Promise<import("./entities/live.entity").Live>;
    update(id: string, dto: CreateLiveDto): Promise<import("./entities/live.entity").Live>;
    remove(id: string): Promise<void>;
    uploadPhotos(id: string, files: Express.Multer.File[]): Promise<import("./entities/photo.entity").Photo[]>;
}

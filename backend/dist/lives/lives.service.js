"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const live_entity_1 = require("./entities/live.entity");
const setlist_item_entity_1 = require("./entities/setlist-item.entity");
const nearby_facility_entity_1 = require("./entities/nearby-facility.entity");
const photo_entity_1 = require("./entities/photo.entity");
let LivesService = class LivesService {
    liveRepo;
    setlistRepo;
    facilityRepo;
    photoRepo;
    constructor(liveRepo, setlistRepo, facilityRepo, photoRepo) {
        this.liveRepo = liveRepo;
        this.setlistRepo = setlistRepo;
        this.facilityRepo = facilityRepo;
        this.photoRepo = photoRepo;
    }
    async findAll() {
        return this.liveRepo.find({
            order: { performanceDate: 'DESC' },
        });
    }
    async findOne(id) {
        const live = await this.liveRepo.findOne({ where: { id } });
        if (!live)
            throw new common_1.NotFoundException('Live record not found');
        return live;
    }
    async create(dto) {
        const live = this.liveRepo.create({
            artistName: dto.artistName,
            performanceDate: dto.performanceDate,
            venueName: dto.venueName,
            tourName: dto.tourName ?? '',
            startTime: dto.startTime ?? '',
            endTime: dto.endTime ?? '',
            googleMapUrl: dto.googleMapUrl ?? '',
            impression: dto.impression ?? '',
            setlist: dto.setlist?.map((s) => this.setlistRepo.create({
                order: s.order,
                title: s.title,
                type: s.type,
            })),
            nearbyFacilities: dto.nearbyFacilities?.map((f) => this.facilityRepo.create({
                name: f.name,
                category: f.category,
                memo: f.memo ?? '',
            })),
        });
        return this.liveRepo.save(live);
    }
    async update(id, dto) {
        const live = await this.findOne(id);
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
            setlist: dto.setlist?.map((s) => this.setlistRepo.create({
                order: s.order,
                title: s.title,
                type: s.type,
            })),
            nearbyFacilities: dto.nearbyFacilities?.map((f) => this.facilityRepo.create({
                name: f.name,
                category: f.category,
                memo: f.memo ?? '',
            })),
        });
        return this.liveRepo.save(live);
    }
    async remove(id) {
        const live = await this.findOne(id);
        await this.liveRepo.remove(live);
    }
    async addPhotos(id, files) {
        const live = await this.findOne(id);
        const photos = files.map((file) => this.photoRepo.create({
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            live,
        }));
        return this.photoRepo.save(photos);
    }
};
exports.LivesService = LivesService;
exports.LivesService = LivesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(live_entity_1.Live)),
    __param(1, (0, typeorm_1.InjectRepository)(setlist_item_entity_1.SetlistItem)),
    __param(2, (0, typeorm_1.InjectRepository)(nearby_facility_entity_1.NearbyFacility)),
    __param(3, (0, typeorm_1.InjectRepository)(photo_entity_1.Photo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LivesService);
//# sourceMappingURL=lives.service.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live = void 0;
const typeorm_1 = require("typeorm");
const setlist_item_entity_1 = require("./setlist-item.entity");
const nearby_facility_entity_1 = require("./nearby-facility.entity");
const photo_entity_1 = require("./photo.entity");
let Live = class Live {
    id;
    artistName;
    performanceDate;
    venueName;
    tourName;
    startTime;
    endTime;
    googleMapUrl;
    impression;
    setlist;
    nearbyFacilities;
    photos;
    createdAt;
    updatedAt;
};
exports.Live = Live;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Live.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Live.prototype, "artistName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Live.prototype, "performanceDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Live.prototype, "venueName", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], Live.prototype, "tourName", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], Live.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], Live.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], Live.prototype, "googleMapUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], Live.prototype, "impression", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => setlist_item_entity_1.SetlistItem, (item) => item.live, {
        cascade: true,
        eager: true,
    }),
    __metadata("design:type", Array)
], Live.prototype, "setlist", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => nearby_facility_entity_1.NearbyFacility, (facility) => facility.live, {
        cascade: true,
        eager: true,
    }),
    __metadata("design:type", Array)
], Live.prototype, "nearbyFacilities", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => photo_entity_1.Photo, (photo) => photo.live, {
        cascade: true,
        eager: true,
    }),
    __metadata("design:type", Array)
], Live.prototype, "photos", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Live.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Live.prototype, "updatedAt", void 0);
exports.Live = Live = __decorate([
    (0, typeorm_1.Entity)('lives')
], Live);
//# sourceMappingURL=live.entity.js.map
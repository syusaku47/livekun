"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const live_entity_1 = require("./entities/live.entity");
const setlist_item_entity_1 = require("./entities/setlist-item.entity");
const nearby_facility_entity_1 = require("./entities/nearby-facility.entity");
const photo_entity_1 = require("./entities/photo.entity");
const lives_service_1 = require("./lives.service");
const lives_controller_1 = require("./lives.controller");
let LivesModule = class LivesModule {
};
exports.LivesModule = LivesModule;
exports.LivesModule = LivesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([live_entity_1.Live, setlist_item_entity_1.SetlistItem, nearby_facility_entity_1.NearbyFacility, photo_entity_1.Photo]),
        ],
        controllers: [lives_controller_1.LivesController],
        providers: [lives_service_1.LivesService],
    })
], LivesModule);
//# sourceMappingURL=lives.module.js.map
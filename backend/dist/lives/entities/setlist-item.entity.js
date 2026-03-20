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
exports.SetlistItem = void 0;
const typeorm_1 = require("typeorm");
const live_entity_1 = require("./live.entity");
let SetlistItem = class SetlistItem {
    id;
    order;
    title;
    type;
    live;
};
exports.SetlistItem = SetlistItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SetlistItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SetlistItem.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SetlistItem.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'song' }),
    __metadata("design:type", String)
], SetlistItem.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => live_entity_1.Live, (live) => live.setlist, { onDelete: 'CASCADE' }),
    __metadata("design:type", live_entity_1.Live)
], SetlistItem.prototype, "live", void 0);
exports.SetlistItem = SetlistItem = __decorate([
    (0, typeorm_1.Entity)('setlist_items')
], SetlistItem);
//# sourceMappingURL=setlist-item.entity.js.map
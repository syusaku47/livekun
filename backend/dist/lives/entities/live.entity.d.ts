import { SetlistItem } from './setlist-item.entity';
import { NearbyFacility } from './nearby-facility.entity';
import { Photo } from './photo.entity';
export declare class Live {
    id: string;
    artistName: string;
    performanceDate: string;
    venueName: string;
    tourName: string;
    startTime: string;
    endTime: string;
    googleMapUrl: string;
    impression: string;
    setlist: SetlistItem[];
    nearbyFacilities: NearbyFacility[];
    photos: Photo[];
    createdAt: Date;
    updatedAt: Date;
}

import { Live } from './live.entity';
export declare class NearbyFacility {
    id: string;
    name: string;
    category: 'izakaya' | 'cafe' | 'other';
    memo: string;
    live: Live;
}

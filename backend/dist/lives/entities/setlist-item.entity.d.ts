import { Live } from './live.entity';
export declare class SetlistItem {
    id: string;
    order: number;
    title: string;
    type: 'song' | 'mc' | 'encore';
    live: Live;
}

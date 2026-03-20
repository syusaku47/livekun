import { Live } from './live.entity';
export declare class Photo {
    id: string;
    filename: string;
    path: string;
    mimetype: string;
    size: number;
    live: Live;
    createdAt: Date;
}

declare class SetlistItemDto {
    title: string;
    order: number;
    type: 'song' | 'mc' | 'encore';
}
declare class NearbyFacilityDto {
    name: string;
    category: 'izakaya' | 'cafe' | 'other';
    memo?: string;
}
export declare class CreateLiveDto {
    artistName: string;
    performanceDate: string;
    venueName: string;
    tourName?: string;
    startTime?: string;
    endTime?: string;
    googleMapUrl?: string;
    impression?: string;
    setlist?: SetlistItemDto[];
    nearbyFacilities?: NearbyFacilityDto[];
}
export {};

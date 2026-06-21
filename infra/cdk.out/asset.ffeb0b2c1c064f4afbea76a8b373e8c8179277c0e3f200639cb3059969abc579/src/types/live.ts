export interface SetlistItem {
  order: number;
  title: string;
  type: "song" | "mc" | "encore";
}

export interface NearbyFacility {
  name: string;
  category: "izakaya" | "cafe" | "other";
  memo: string;
}

export interface LiveRecord {
  id: string;
  artistName: string;
  performanceDate: string;
  venueName: string;
  tourName: string;
  startTime: string;
  endTime: string;
  photos: string[];
  nearbyFacilities: NearbyFacility[];
  googleMapUrl: string;
  impression: string;
  setlist: SetlistItem[];
  createdAt: string;
  updatedAt: string;
}

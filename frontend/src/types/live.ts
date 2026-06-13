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

export interface Photo {
  id: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
}

export interface LiveRecord {
  id: string;
  artistName: string;
  performanceDate: string;
  venueName: string;
  tourName: string;
  startTime: string;
  endTime: string;
  photos: Photo[];
  nearbyFacilities: NearbyFacility[];
  googleMapUrl: string;
  impression: string;
  setlist: SetlistItem[];
  createdAt: string;
  updatedAt: string;
}

import { LiveRecord } from "@/types/live";

const API_BASE = "/api/lives";

export async function getLiveRecords(): Promise<LiveRecord[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) return [];
  return res.json();
}

export async function getLiveRecord(
  id: string
): Promise<LiveRecord | undefined> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) return undefined;
  return res.json();
}

export async function createLiveRecord(
  data: {
    artistName: string;
    performanceDate: string;
    venueName: string;
    tourName?: string;
    startTime?: string;
    endTime?: string;
    googleMapUrl?: string;
    impression?: string;
    setlist?: { order: number; title: string; type: string }[];
    nearbyFacilities?: {
      name: string;
      category: string;
      memo?: string;
    }[];
  },
  photoFiles: File[]
): Promise<LiveRecord> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create record");
  const record: LiveRecord = await res.json();

  if (photoFiles.length > 0) {
    const formData = new FormData();
    photoFiles.forEach((file) => formData.append("photos", file));
    await fetch(`${API_BASE}/${record.id}/photos`, {
      method: "POST",
      body: formData,
    });
  }

  return record;
}

export async function deleteLiveRecord(id: string): Promise<void> {
  await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
}

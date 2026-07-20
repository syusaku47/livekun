import { LiveRecord } from "@/types/live";
import { authHeaders, removeToken } from "@/lib/auth";

const API_BASE = "/api/lives";

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });
  if (res.status === 401) {
    removeToken();
    window.location.href = "/login";
  }
  return res;
}

export async function getLiveRecords(): Promise<LiveRecord[]> {
  const res = await authFetch(API_BASE);
  if (!res.ok) return [];
  return res.json();
}

export async function getLiveRecord(
  id: string
): Promise<LiveRecord | undefined> {
  const res = await authFetch(`${API_BASE}/${id}`);
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
  const res = await authFetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to create record: ${res.status} ${body}`);
  }
  const record: LiveRecord = await res.json();

  if (photoFiles.length > 0) {
    const formData = new FormData();
    photoFiles.forEach((file) => formData.append("photos", file));
    await authFetch(`${API_BASE}/${record.id}/photos`, {
      method: "POST",
      body: formData,
    });
  }

  return record;
}

export async function updateLiveRecord(
  id: string,
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
  newPhotoFiles: File[]
): Promise<LiveRecord> {
  const res = await authFetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to update record: ${res.status} ${body}`);
  }
  const record: LiveRecord = await res.json();

  if (newPhotoFiles.length > 0) {
    const formData = new FormData();
    newPhotoFiles.forEach((file) => formData.append("photos", file));
    await authFetch(`${API_BASE}/${record.id}/photos`, {
      method: "POST",
      body: formData,
    });
  }

  return record;
}

export async function deleteLiveRecord(id: string): Promise<void> {
  await authFetch(`${API_BASE}/${id}`, { method: "DELETE" });
}

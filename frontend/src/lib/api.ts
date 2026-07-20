import { LiveRecord, CreateLiveInput } from "@/types/live";
import { getSession } from "next-auth/react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await getSession();
  const token = (session?.user as any)?.accessToken;
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }
  return res.json();
}

export async function getLiveRecords(): Promise<LiveRecord[]> {
  return fetchApi<LiveRecord[]>("/api/lives");
}

export async function getLiveRecord(id: string): Promise<LiveRecord> {
  return fetchApi<LiveRecord>(`/api/lives/${id}`);
}

export async function createLiveRecord(input: CreateLiveInput): Promise<LiveRecord> {
  return fetchApi<LiveRecord>("/api/lives", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateLiveRecord(id: string, input: CreateLiveInput): Promise<LiveRecord> {
  return fetchApi<LiveRecord>(`/api/lives/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteLiveRecord(id: string): Promise<void> {
  return fetchApi<void>(`/api/lives/${id}`, {
    method: "DELETE",
  });
}

export async function uploadPhotos(id: string, files: File[]): Promise<void> {
  const authHeaders = await getAuthHeaders();
  const formData = new FormData();
  files.forEach((file) => formData.append("photos", file));
  const res = await fetch(`${API_BASE}/api/lives/${id}/photos`, {
    method: "POST",
    headers: authHeaders,
    body: formData,
  });
  if (!res.ok) {
    throw new Error(`Upload error: ${res.status}`);
  }
}

export function getPhotoUrl(photo: { path: string }): string {
  if (photo.path.startsWith("http")) {
    return `${API_BASE}/api/lives/photos/${encodeURIComponent(photo.path)}`;
  }
  return `${API_BASE}/api/lives/photos/${photo.path}`;
}

// Auth API
export async function registerUser(username: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "登録に失敗しました");
  }
  return res.json();
}

// Admin APIs
export async function getUsers() {
  return fetchApi<any[]>("/api/auth/users");
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
  return fetchApi<any>(`/api/auth/users/${userId}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
}

export async function deleteUser(userId: string) {
  return fetchApi<void>(`/api/auth/users/${userId}`, {
    method: "DELETE",
  });
}

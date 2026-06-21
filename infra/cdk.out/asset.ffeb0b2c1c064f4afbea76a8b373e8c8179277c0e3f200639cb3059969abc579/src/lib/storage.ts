import { LiveRecord } from "@/types/live";

const STORAGE_KEY = "livekun_records";

export function getLiveRecords(): LiveRecord[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getLiveRecord(id: string): LiveRecord | undefined {
  return getLiveRecords().find((r) => r.id === id);
}

export function saveLiveRecord(record: LiveRecord): void {
  const records = getLiveRecords();
  const index = records.findIndex((r) => r.id === record.id);
  if (index >= 0) {
    records[index] = record;
  } else {
    records.push(record);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function deleteLiveRecord(id: string): void {
  const records = getLiveRecords().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

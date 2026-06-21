"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LiveRecord } from "@/types/live";
import { getLiveRecords } from "@/lib/storage";

export default function Home() {
  const [records, setRecords] = useState<LiveRecord[]>([]);

  useEffect(() => {
    setRecords(getLiveRecords().sort((a, b) =>
      b.performanceDate.localeCompare(a.performanceDate)
    ));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">参戦記録一覧</h1>

      {records.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">
            まだ参戦記録がありません
          </p>
          <Link
            href="/lives/new"
            className="inline-block bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors"
          >
            最初の記録を作成する
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {records.map((record) => (
            <Link
              key={record.id}
              href={`/lives/${record.id}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="text-sm text-purple-600 font-medium mb-1">
                {record.performanceDate}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {record.artistName}
              </h2>
              {record.tourName && (
                <p className="text-sm text-gray-500 mb-2">{record.tourName}</p>
              )}
              <p className="text-sm text-gray-600">{record.venueName}</p>
              {record.photos.length > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  写真 {record.photos.length}枚
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

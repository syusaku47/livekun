"use client";

import { useEffect, useState } from "react";
import { LiveRecord } from "@/types/live";
import { getLiveRecords } from "@/lib/api";

interface StatItem {
  name: string;
  count: number;
}

export default function StatsPage() {
  const [records, setRecords] = useState<LiveRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLiveRecords()
      .then(setRecords)
      .catch((err) => console.error("Failed to fetch:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">読み込み中...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">まだ参戦記録がありません</p>
      </div>
    );
  }

  // 年別集計
  const byYear: Record<string, number> = {};
  records.forEach((r) => {
    const year = r.performanceDate.slice(0, 4);
    byYear[year] = (byYear[year] || 0) + 1;
  });
  const yearStats: StatItem[] = Object.entries(byYear)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([name, count]) => ({ name, count }));

  // アーティスト別集計
  const byArtist: Record<string, number> = {};
  records.forEach((r) => {
    byArtist[r.artistName] = (byArtist[r.artistName] || 0) + 1;
  });
  const artistStats: StatItem[] = Object.entries(byArtist)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));

  // 会場別集計
  const byVenue: Record<string, number> = {};
  records.forEach((r) => {
    byVenue[r.venueName] = (byVenue[r.venueName] || 0) + 1;
  });
  const venueStats: StatItem[] = Object.entries(byVenue)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));

  // 月別集計
  const byMonth: Record<string, number> = {};
  records.forEach((r) => {
    const month = r.performanceDate.slice(5, 7);
    byMonth[month] = (byMonth[month] || 0) + 1;
  });
  const monthNames = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  const monthStats = monthNames.map((name, i) => ({
    name,
    count: byMonth[String(i + 1).padStart(2, "0")] || 0,
  }));

  const maxBarWidth = (items: StatItem[]) => Math.max(...items.map((i) => i.count), 1);

  const StatSection = ({ title, items }: { title: string; items: StatItem[] }) => {
    const max = maxBarWidth(items);
    return (
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-700 mb-4">{title}</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-28 truncate text-right">{item.name}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 w-8">{item.count}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">統計ダッシュボード</h1>

      {/* サマリー */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
          <p className="text-3xl font-bold text-purple-700">{records.length}</p>
          <p className="text-sm text-gray-500 mt-1">総参戦回数</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
          <p className="text-3xl font-bold text-purple-700">{artistStats.length}</p>
          <p className="text-sm text-gray-500 mt-1">アーティスト数</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
          <p className="text-3xl font-bold text-purple-700">{venueStats.length}</p>
          <p className="text-sm text-gray-500 mt-1">会場数</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
          <p className="text-3xl font-bold text-purple-700">{yearStats.length}</p>
          <p className="text-sm text-gray-500 mt-1">活動年数</p>
        </div>
      </div>

      <div className="space-y-6">
        <StatSection title="年別参戦回数" items={yearStats} />
        <StatSection title="月別参戦回数" items={monthStats} />
        <StatSection title="アーティスト別参戦回数" items={artistStats} />
        <StatSection title="会場別参戦回数" items={venueStats} />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LiveRecord } from "@/types/live";
import { getLiveRecords } from "@/lib/api";

export default function CalendarPage() {
  const [records, setRecords] = useState<LiveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  useEffect(() => {
    getLiveRecords()
      .then(setRecords)
      .catch((err) => console.error("Failed to fetch:", err))
      .finally(() => setLoading(false));
  }, []);

  const { year, month } = currentDate;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  };

  const nextMonth = () => {
    setCurrentDate((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  const toToday = () => {
    const now = new Date();
    setCurrentDate({ year: now.getFullYear(), month: now.getMonth() });
  };

  // 日付文字列(YYYY-MM-DD)でグループ化
  const recordsByDate: Record<string, LiveRecord[]> = {};
  records.forEach((r) => {
    const date = r.performanceDate;
    if (!recordsByDate[date]) recordsByDate[date] = [];
    recordsByDate[date].push(r);
  });

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const monthLabel = `${year}年${month + 1}月`;

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">カレンダー</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* ナビゲーション */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="text-purple-700 hover:bg-purple-50 px-3 py-1 rounded-lg transition-colors">
            &larr; 前月
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">{monthLabel}</h2>
            <button onClick={toToday} className="text-xs text-purple-600 hover:underline">
              今月
            </button>
          </div>
          <button onClick={nextMonth} className="text-purple-700 hover:bg-purple-50 px-3 py-1 rounded-lg transition-colors">
            翌月 &rarr;
          </button>
        </div>

        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* 日付グリッド */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="min-h-20" />;
            }
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayRecords = recordsByDate[dateStr] || [];
            const isToday =
              new Date().getFullYear() === year &&
              new Date().getMonth() === month &&
              new Date().getDate() === day;

            return (
              <div
                key={dateStr}
                className={`min-h-20 border rounded-lg p-1 ${
                  isToday ? "border-purple-400 bg-purple-50" : "border-gray-100"
                } ${dayRecords.length > 0 ? "bg-purple-50" : ""}`}
              >
                <div className={`text-xs mb-1 ${isToday ? "font-bold text-purple-700" : "text-gray-500"}`}>
                  {day}
                </div>
                {dayRecords.map((r) => (
                  <Link
                    key={r.id}
                    href={`/lives/${r.id}`}
                    className="block text-xs bg-purple-600 text-white rounded px-1 py-0.5 mb-0.5 truncate hover:bg-purple-700"
                  >
                    {r.artistName}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LiveRecord } from "@/types/live";
import { getLiveRecord, deleteLiveRecord } from "@/lib/storage";

export default function LiveDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<LiveRecord | null>(null);

  useEffect(() => {
    const id = params.id as string;
    const data = getLiveRecord(id);
    if (data) {
      setRecord(data);
    }
  }, [params.id]);

  const handleDelete = () => {
    if (!record) return;
    if (confirm("この記録を削除しますか？")) {
      deleteLiveRecord(record.id);
      router.push("/");
    }
  };

  const setlistTypeLabel = (type: string) => {
    switch (type) {
      case "mc":
        return "MC";
      case "encore":
        return "EN";
      default:
        return "";
    }
  };

  const setlistTypeBg = (type: string) => {
    switch (type) {
      case "mc":
        return "bg-blue-100 text-blue-700";
      case "encore":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-purple-100 text-purple-700";
    }
  };

  const facilityLabel = (cat: string) => {
    switch (cat) {
      case "izakaya":
        return "居酒屋";
      case "cafe":
        return "カフェ";
      default:
        return "その他";
    }
  };

  const appleSearchUrl = (song: string, artist: string) =>
    `https://music.apple.com/search?term=${encodeURIComponent(song + " " + artist)}`;

  if (!record) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg mb-4">記録が見つかりません</p>
        <Link href="/" className="text-purple-700 hover:underline">
          一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/"
        className="text-purple-700 hover:underline text-sm mb-4 inline-block"
      >
        &larr; 一覧に戻る
      </Link>

      {/* ヘッダー */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="text-sm text-purple-600 font-medium mb-1">
          {record.performanceDate}
          {record.startTime && ` ${record.startTime}`}
          {record.endTime && ` ~ ${record.endTime}`}
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          {record.artistName}
        </h1>
        {record.tourName && (
          <p className="text-gray-500 mb-2">{record.tourName}</p>
        )}
        <p className="text-gray-600">{record.venueName}</p>
        {record.googleMapUrl && (
          <a
            href={record.googleMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm text-blue-600 hover:underline"
          >
            Google Mapで見る
          </a>
        )}
      </div>

      {/* 写真 */}
      {record.photos.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            写真（{record.photos.length}枚）
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {record.photos.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`写真${i + 1}`}
                className="w-full h-40 object-cover rounded-lg"
              />
            ))}
          </div>
        </section>
      )}

      {/* セットリスト */}
      {record.setlist.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            セットリスト
          </h2>
          <ol className="space-y-2">
            {record.setlist.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-8 text-right">
                  {item.order}.
                </span>
                {item.type !== "song" && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${setlistTypeBg(item.type)}`}
                  >
                    {setlistTypeLabel(item.type)}
                  </span>
                )}
                <span className="text-gray-800">{item.title}</span>
                {item.type === "song" && (
                  <a
                    href={appleSearchUrl(item.title, record.artistName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-pink-500 hover:underline ml-auto"
                  >
                    Apple Musicで聴く
                  </a>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 周辺施設 */}
      {record.nearbyFacilities.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            周辺施設情報
          </h2>
          <div className="space-y-2">
            {record.nearbyFacilities.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                  {facilityLabel(f.category)}
                </span>
                <div>
                  <p className="font-medium text-gray-800">{f.name}</p>
                  {f.memo && (
                    <p className="text-sm text-gray-500">{f.memo}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 感想 */}
      {record.impression && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4">感想</h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {record.impression}
          </p>
        </section>
      )}

      {/* アクション */}
      <div className="flex justify-end gap-3 mb-10">
        <button
          onClick={handleDelete}
          className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors text-sm"
        >
          削除する
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LiveRecord, SetlistItem, NearbyFacility } from "@/types/live";
import { saveLiveRecord } from "@/lib/storage";

export default function NewLivePage() {
  const router = useRouter();
  const [artistName, setArtistName] = useState("");
  const [performanceDate, setPerformanceDate] = useState("");
  const [venueName, setVenueName] = useState("");
  const [tourName, setTourName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [googleMapUrl, setGoogleMapUrl] = useState("");
  const [impression, setImpression] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [setlist, setSetlist] = useState<SetlistItem[]>([
    { order: 1, title: "", type: "song" },
  ]);
  const [facilities, setFacilities] = useState<NearbyFacility[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxFiles = 100 - photos.length;
    const filesToProcess = Array.from(files).slice(0, maxFiles);

    filesToProcess.forEach((file) => {
      if (file.size > 100 * 1024 * 1024) {
        alert(`${file.name} は100MBを超えています`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPhotos((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const addSetlistItem = (type: "song" | "mc" | "encore") => {
    setSetlist((prev) => [
      ...prev,
      { order: prev.length + 1, title: "", type },
    ]);
  };

  const updateSetlistItem = (index: number, title: string) => {
    setSetlist((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title } : item))
    );
  };

  const removeSetlistItem = (index: number) => {
    setSetlist((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, order: i + 1 }))
    );
  };

  const addFacility = () => {
    setFacilities((prev) => [
      ...prev,
      { name: "", category: "izakaya", memo: "" },
    ]);
  };

  const updateFacility = (
    index: number,
    field: keyof NearbyFacility,
    value: string
  ) => {
    setFacilities((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );
  };

  const removeFacility = (index: number) => {
    setFacilities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!artistName || !performanceDate || !venueName) {
      alert("アーティスト名、公演日、会場は必須です");
      return;
    }

    const now = new Date().toISOString();
    const record: LiveRecord = {
      id: crypto.randomUUID(),
      artistName,
      performanceDate,
      venueName,
      tourName,
      startTime,
      endTime,
      photos,
      nearbyFacilities: facilities,
      googleMapUrl,
      impression,
      setlist: setlist.filter((s) => s.title.trim() !== ""),
      createdAt: now,
      updatedAt: now,
    };

    saveLiveRecord(record);
    router.push(`/lives/${record.id}`);
  };

  const setlistTypeLabel = (type: string) => {
    switch (type) {
      case "mc":
        return "MC";
      case "encore":
        return "アンコール";
      default:
        return "曲";
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

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        ライブ参戦記録を作成
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本情報 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4">基本情報</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                アーティスト名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="例: BUMP OF CHICKEN"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ツアー名
              </label>
              <input
                type="text"
                value={tourName}
                onChange={(e) => setTourName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="例: TOUR 2026 ホームシック衛星"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  公演日 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={performanceDate}
                  onChange={(e) => setPerformanceDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  開始時間
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  終了時間
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                会場 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="例: 東京ドーム"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Map URL
              </label>
              <input
                type="url"
                value={googleMapUrl}
                onChange={(e) => setGoogleMapUrl(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>
        </section>

        {/* 写真 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            写真（最大100枚、1枚100MBまで）
          </h2>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="mb-4"
          />
          {photos.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {photos.map((photo, i) => (
                <div key={i} className="relative group">
                  <img
                    src={photo}
                    alt={`写真${i + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-400 mt-2">
            {photos.length}/100 枚アップロード済み
          </p>
        </section>

        {/* セットリスト */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4">セットリスト</h2>
          <div className="space-y-2">
            {setlist.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm text-gray-400 w-8 text-right">
                  {item.order}.
                </span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded w-20 text-center">
                  {setlistTypeLabel(item.type)}
                </span>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateSetlistItem(i, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={
                    item.type === "mc" ? "MCの内容" : "曲名を入力"
                  }
                />
                <button
                  type="button"
                  onClick={() => removeSetlistItem(i)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => addSetlistItem("song")}
              className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm hover:bg-purple-200"
            >
              + 曲を追加
            </button>
            <button
              type="button"
              onClick={() => addSetlistItem("mc")}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm hover:bg-blue-200"
            >
              + MC追加
            </button>
            <button
              type="button"
              onClick={() => addSetlistItem("encore")}
              className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-sm hover:bg-yellow-200"
            >
              + アンコール追加
            </button>
          </div>
        </section>

        {/* 周辺施設 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4">周辺施設情報</h2>
          <div className="space-y-3">
            {facilities.map((f, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row items-start md:items-center gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <select
                  value={f.category}
                  onChange={(e) =>
                    updateFacility(i, "category", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-2 py-2 text-sm"
                >
                  <option value="izakaya">居酒屋</option>
                  <option value="cafe">カフェ</option>
                  <option value="other">その他</option>
                </select>
                <input
                  type="text"
                  value={f.name}
                  onChange={(e) => updateFacility(i, "name", e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="店名"
                />
                <input
                  type="text"
                  value={f.memo}
                  onChange={(e) => updateFacility(i, "memo", e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="メモ（おすすめポイントなど）"
                />
                <button
                  type="button"
                  onClick={() => removeFacility(i)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addFacility}
            className="mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm hover:bg-green-200"
          >
            + 施設を追加
          </button>
        </section>

        {/* 感想 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4">感想</h2>
          <textarea
            value={impression}
            onChange={(e) => setImpression(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="ライブの感想を自由に書いてください..."
          />
        </section>

        {/* 送信 */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-purple-700 text-white font-semibold hover:bg-purple-800 transition-colors"
          >
            記録を保存
          </button>
        </div>
      </form>
    </div>
  );
}

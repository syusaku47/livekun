"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getUsers, updateUserRole, deleteUser } from "@/lib/api";

interface UserInfo {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const userRole = (session?.user as any)?.role;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && userRole !== "admin") {
      router.push("/");
      return;
    }
    if (status === "authenticated" && userRole === "admin") {
      getUsers()
        .then(setUsers)
        .catch(() => router.push("/"))
        .finally(() => setLoading(false));
    }
  }, [status, userRole, router]);

  const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch {
      alert("ロール変更に失敗しました");
    }
  };

  const handleDelete = async (userId: string, username: string) => {
    if (!confirm(`${username} を削除しますか？`)) return;
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      alert("削除に失敗しました");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">ユーザー管理</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">ユーザー名</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">ロール</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">登録日</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-sm text-gray-800">{user.username}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as "user" | "admin")}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    disabled={user.id === (session?.user as any)?.id}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("ja-JP")}
                </td>
                <td className="px-6 py-4 text-right">
                  {user.id !== (session?.user as any)?.id && (
                    <button
                      onClick={() => handleDelete(user.id, user.username)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      削除
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

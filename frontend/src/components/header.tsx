"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const userRole = (session?.user as any)?.role;

  return (
    <header className="bg-purple-700 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          ライブくん
        </Link>
        <nav className="flex items-center gap-3">
          {status === "authenticated" ? (
            <>
              <Link
                href="/stats"
                className="text-purple-200 hover:text-white transition-colors text-sm"
              >
                統計
              </Link>
              <Link
                href="/calendar"
                className="text-purple-200 hover:text-white transition-colors text-sm"
              >
                カレンダー
              </Link>
              {userRole === "admin" && (
                <Link
                  href="/admin"
                  className="text-purple-200 hover:text-white transition-colors text-sm"
                >
                  管理
                </Link>
              )}
              <Link
                href="/lives/new"
                className="bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                + 記録する
              </Link>
              <div className="flex items-center gap-2 ml-2">
                <span className="text-purple-200 text-sm">
                  {session.user?.name}
                  {userRole === "admin" && (
                    <span className="ml-1 text-xs bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded">
                      admin
                    </span>
                  )}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-purple-200 hover:text-white text-sm underline"
                >
                  ログアウト
                </button>
              </div>
            </>
          ) : status === "unauthenticated" ? (
            <Link
              href="/login"
              className="bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              ログイン
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

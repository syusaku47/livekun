"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./AuthProvider";

export default function Header() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <header className="bg-purple-700 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          ライブくん
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/lives/new"
            className="bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
          >
            + 記録する
          </Link>
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}

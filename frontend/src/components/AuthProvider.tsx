"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getToken, removeToken } from "@/lib/auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === "/login") {
      setChecked(true);
      return;
    }
    const token = getToken();
    if (!token) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  if (!checked && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        removeToken();
        router.push("/login");
      }}
      className="text-white/80 hover:text-white text-sm transition-colors"
    >
      ログアウト
    </button>
  );
}

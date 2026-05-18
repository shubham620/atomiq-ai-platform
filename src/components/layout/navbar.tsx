"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/auth-context";

export default function Navbar() {
  const { logout } = useAuth();

  const router = useRouter();

  const handleLogout = async () => {
    await logout();

    router.push("/login");
  };

  return (
    <div className="flex h-20 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Performance Intelligence Dashboard
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Monitor goals, analytics, and AI insights
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="rounded-xl border border-zinc-700 px-5 py-2 text-sm text-white hover:bg-zinc-900 transition"
        >
          Logout
        </button>

        <div className="h-12 w-12 rounded-full border border-zinc-700 bg-gradient-to-br from-zinc-700 to-zinc-900" />
      </div>
    </div>
  );
}
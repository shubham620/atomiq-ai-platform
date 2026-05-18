"use client";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { Menu } from "lucide-react";

import { useState } from "react";

import { useAuth } from "@/context/auth-context";

import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase";

import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const router = useRouter();

  const { profile } = useAuth();

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      toast.success(
        "Logged out successfully"
      );

      router.push("/login");
    } catch (error) {
      console.error(error);

      toast.error("Logout failed");
    }
  };

  const employeeLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
    },
    {
      name: "Goals",
      href: "/dashboard/goals",
    },
    {
      name: "Check-Ins",
      href: "/dashboard/checkins",
    },
  ];

  const managerLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
    },
    {
      name: "Manager Panel",
      href: "/dashboard/manager",
    },
    {
      name: "Goals",
      href: "/dashboard/goals",
    },
    {
      name: "Check-Ins",
      href: "/dashboard/checkins",
    },
  ];

  const adminLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
    },
    {
      name: "Goals",
      href: "/dashboard/goals",
    },
    {
      name: "Check-Ins",
      href: "/dashboard/checkins",
    },
    {
      name: "Audit Logs",
      href: "/dashboard/audit",
    },
  ];

  const links =
    profile?.role === "admin"
      ? adminLinks
      : profile?.role === "manager"
      ? managerLinks
      : employeeLinks;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* MOBILE TOPBAR */}

      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-5 py-4 lg:hidden">
        <div>
          <h1 className="text-2xl font-bold">
            ATOMIQ
          </h1>

          <p className="text-xs capitalize text-zinc-500">
            {profile?.role}
          </p>
        </div>

        <button
          onClick={() =>
            setMobileMenu(!mobileMenu)
          }
          className="rounded-xl border border-zinc-800 p-2"
        >
          <Menu size={22} />
        </button>
      </div>

      <div className="flex">
        {/* SIDEBAR */}

        <aside
          className={`fixed left-0 top-0 z-50 h-screen w-[260px] border-r border-zinc-800 bg-zinc-950 p-6 transition-all duration-300 lg:relative lg:translate-x-0 ${
            mobileMenu
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between lg:block">
            <div>
              <h1 className="text-3xl font-bold">
                ATOMIQ
              </h1>

              <p className="mt-1 text-sm text-zinc-500">
                AI Performance Platform
              </p>
            </div>

            <button
              onClick={() =>
                setMobileMenu(false)
              }
              className="text-zinc-500 lg:hidden"
            >
              ✕
            </button>
          </div>

          {/* NAVIGATION */}

          <div className="mt-10 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() =>
                  setMobileMenu(false)
                }
                className={`block rounded-2xl px-5 py-4 transition ${
                  pathname === link.href
                    ? "bg-white font-semibold text-black"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* PROFILE */}

          <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-500">
              Logged In As
            </p>

            <h2 className="mt-2 text-xl font-bold">
              {profile?.name}
            </h2>

            <p className="mt-1 text-sm capitalize text-zinc-400">
              {profile?.role}
            </p>

            <button
              onClick={handleLogout}
              className="mt-5 w-full rounded-2xl bg-red-500 px-5 py-4 font-semibold text-black transition hover:bg-red-400"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* MOBILE OVERLAY */}

        {mobileMenu && (
          <div
            onClick={() =>
              setMobileMenu(false)
            }
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          />
        )}

        {/* MAIN CONTENT */}

        <main className="min-h-screen flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
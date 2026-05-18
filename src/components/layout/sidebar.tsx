"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { useAuth } from "@/context/auth-context";

export default function Sidebar() {
  const pathname = usePathname();

  const { profile } = useAuth();

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
      name: "Goals",
      href: "/dashboard/goals",
    },
    {
      name: "Manager Panel",
      href: "/dashboard/manager",
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
      name: "Goals",
      href: "/dashboard/goals",
    },
    {
      name: "Manager Panel",
      href: "/dashboard/manager",
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
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
    profile?.role === "manager"
      ? managerLinks
      : profile?.role === "admin"
      ? adminLinks
      : employeeLinks;

  return (
    <div className="sticky top-0 flex h-screen w-72 flex-col border-r border-zinc-800 bg-zinc-950 px-6 py-8 text-white">
      <div>
        <h1 className="text-4xl font-bold">
          ATOMIQ
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          AI Performance Intelligence
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        {links.map((link) => {
          const active =
            pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`rounded-2xl px-5 py-4 transition ${
                active
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-sm text-zinc-500">
          Logged in as
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">
          {profile?.name}
        </h2>

        <p className="mt-1 capitalize text-zinc-400">
          {profile?.role}
        </p>
      </div>
    </div>
  );
}
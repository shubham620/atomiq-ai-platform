"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
  const { profile } = useAuth();

  const [goals, setGoals] = useState<any[]>([]);

  const fetchGoals = async () => {
    const snapshot = await getDocs(
      collection(db, "goals")
    );

    const goalData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setGoals(goalData);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const employeeGoals = goals.filter(
    (goal: any) =>
      goal.employeeEmail === profile?.email
  );

  const approvedGoals = goals.filter(
    (goal: any) =>
      goal.status === "Approved"
  ).length;

  const pendingGoals = goals.filter(
    (goal: any) =>
      goal.status === "Pending"
  ).length;

  const highRiskGoals = goals.filter(
    (goal: any) =>
      (goal.progress || 0) < 50
  ).length;

  const avgProgress =
    goals.length === 0
      ? 0
      : Math.round(
          goals.reduce(
            (
              acc: number,
              goal: any
            ) =>
              acc +
              (goal.progress || 0),
            0
          ) / goals.length
        );

  return (
    <div>
      <div>
        <h1 className="text-5xl font-bold tracking-tight text-white">
          Welcome, {profile?.name}
        </h1>

        <p className="mt-3 text-lg text-zinc-500 capitalize">
          {profile?.role} Intelligence Dashboard
        </p>
      </div>

      {/* EMPLOYEE DASHBOARD */}

      {profile?.role === "employee" && (
        <>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
            <MetricCard
              title="My Goals"
              value={employeeGoals.length}
              color="text-white"
            />

            <MetricCard
              title="Approved"
              value={
                employeeGoals.filter(
                  (goal: any) =>
                    goal.status ===
                    "Approved"
                ).length
              }
              color="text-green-400"
            />

            <MetricCard
              title="Pending"
              value={
                employeeGoals.filter(
                  (goal: any) =>
                    goal.status ===
                    "Pending"
                ).length
              }
              color="text-yellow-400"
            />

            <MetricCard
              title="Avg Progress"
              value={`${
                employeeGoals.length === 0
                  ? 0
                  : Math.round(
                      employeeGoals.reduce(
                        (
                          acc: number,
                          goal: any
                        ) =>
                          acc +
                          (goal.progress ||
                            0),
                        0
                      ) /
                        employeeGoals.length
                    )
              }%`}
              color="text-blue-400"
            />
          </div>

          <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <h2 className="text-3xl font-bold text-white">
              AI Performance Insight
            </h2>

            <p className="mt-4 text-zinc-400">
              Your execution consistency and quarterly alignment are actively monitored through AI-driven organizational intelligence.
            </p>
          </div>
        </>
      )}

      {/* MANAGER DASHBOARD */}

      {profile?.role === "manager" && (
        <>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
            <MetricCard
              title="Approved Goals"
              value={approvedGoals}
              color="text-green-400"
            />

            <MetricCard
              title="Pending Reviews"
              value={pendingGoals}
              color="text-yellow-400"
            />

            <MetricCard
              title="High Risk Goals"
              value={highRiskGoals}
              color="text-red-400"
            />

            <MetricCard
              title="Avg Progress"
              value={`${avgProgress}%`}
              color="text-blue-400"
            />
          </div>

          <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Team Performance Heatmap
                </h2>

                <p className="mt-2 text-zinc-500">
                  Organizational execution visibility
                </p>
              </div>

              <div className="rounded-full bg-zinc-950 px-4 py-2 text-sm text-zinc-400">
                Live Monitoring
              </div>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 text-left text-zinc-500">
                    <th className="pb-4">
                      Employee
                    </th>

                    <th className="pb-4">
                      Goal
                    </th>

                    <th className="pb-4">
                      Progress
                    </th>

                    <th className="pb-4">
                      Risk
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {goals.map((goal: any) => {
                    const progress =
                      goal.progress || 0;

                    const risk =
                      progress >= 80
                        ? "Low"
                        : progress >= 50
                        ? "Moderate"
                        : "High";

                    return (
                      <tr
                        key={goal.id}
                        className="border-b border-zinc-800"
                      >
                        <td className="py-5 font-medium text-white">
                          {goal.employee}
                        </td>

                        <td className="py-5 text-zinc-400">
                          {goal.title}
                        </td>

                        <td className="py-5 text-white">
                          {progress}%
                        </td>

                        <td className="py-5">
                          <div
                            className={`inline-flex rounded-full px-3 py-1 text-sm ${
                              risk === "Low"
                                ? "bg-green-500/20 text-green-400"
                                : risk ===
                                  "Moderate"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {risk}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ADMIN DASHBOARD */}

      {profile?.role === "admin" && (
        <>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-5">
            <MetricCard
              title="Total Goals"
              value={goals.length}
              color="text-white"
            />

            <MetricCard
              title="Approved"
              value={approvedGoals}
              color="text-green-400"
            />

            <MetricCard
              title="Pending"
              value={pendingGoals}
              color="text-yellow-400"
            />

            <MetricCard
              title="High Risk"
              value={highRiskGoals}
              color="text-red-400"
            />

            <MetricCard
              title="Avg Progress"
              value={`${avgProgress}%`}
              color="text-blue-400"
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
              <h2 className="text-3xl font-bold text-white">
                Executive Insight
              </h2>

              <p className="mt-4 text-zinc-400 leading-8">
                Organization-wide execution intelligence indicates operational alignment, governance consistency, and active quarterly performance monitoring across departments.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
              <h2 className="text-3xl font-bold text-white">
                Governance Alerts
              </h2>

              <div className="mt-6 space-y-4">
                <AlertCard
                  title="High Risk Goals"
                  value={highRiskGoals}
                  color="bg-red-500"
                />

                <AlertCard
                  title="Pending Approvals"
                  value={pendingGoals}
                  color="bg-yellow-500"
                />

                <AlertCard
                  title="Approved Goals"
                  value={approvedGoals}
                  color="bg-green-500"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  color,
}: any) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
      <p className="text-zinc-500">
        {title}
      </p>

      <h2
        className={`mt-5 text-5xl font-bold ${color}`}
      >
        {value}
      </h2>
    </div>
  );
}

function AlertCard({
  title,
  value,
  color,
}: any) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-zinc-950 p-5">
      <div className="flex items-center gap-4">
        <div
          className={`h-4 w-4 rounded-full ${color}`}
        />

        <p className="text-white">
          {title}
        </p>
      </div>

      <p className="text-xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}
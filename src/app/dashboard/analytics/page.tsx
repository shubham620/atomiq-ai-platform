"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AnalyticsPage() {
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

  const totalGoals = goals.length;

  const approvedGoals = goals.filter(
    (goal: any) =>
      goal.status === "Approved"
  ).length;

  const rejectedGoals = goals.filter(
    (goal: any) =>
      goal.status === "Rejected"
  ).length;

  const pendingGoals = goals.filter(
    (goal: any) =>
      goal.status === "Pending"
  ).length;

  const highRiskGoals = goals.filter(
    (goal: any) =>
      goal.progress < 50
  ).length;

  const avgProgress =
    totalGoals === 0
      ? 0
      : Math.round(
          goals.reduce(
            (
              acc: number,
              goal: any
            ) =>
              acc + (goal.progress || 0),
            0
          ) / totalGoals
        );

  const approvalRate =
    totalGoals === 0
      ? 0
      : Math.round(
          (approvedGoals /
            totalGoals) *
            100
        );

  const chartData = [
    {
      name: "Approved",
      value: approvedGoals,
    },
    {
      name: "Pending",
      value: pendingGoals,
    },
    {
      name: "Rejected",
      value: rejectedGoals,
    },
  ];

  const progressData = goals.map(
    (goal: any) => ({
      name:
        goal.title.length > 12
          ? goal.title.slice(0, 12) +
            "..."
          : goal.title,
      progress: goal.progress || 0,
    })
  );

  const COLORS = [
    "#22c55e",
    "#eab308",
    "#ef4444",
  ];

  return (
    <div>
      <div>
        <h1 className="text-5xl font-bold text-white">
          Organization Analytics
        </h1>

        <p className="mt-3 text-zinc-500">
          Enterprise-wide performance intelligence and operational insights
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
        <AnalyticsCard
          title="Total Goals"
          value={totalGoals}
          color="text-white"
        />

        <AnalyticsCard
          title="Approval Rate"
          value={`${approvalRate}%`}
          color="text-green-400"
        />

        <AnalyticsCard
          title="High Risk Goals"
          value={highRiskGoals}
          color="text-red-400"
        />

        <AnalyticsCard
          title="Avg Progress"
          value={`${avgProgress}%`}
          color="text-blue-400"
        />

        <AnalyticsCard
          title="Pending Reviews"
          value={pendingGoals}
          color="text-yellow-400"
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">
                Goal Progress Analytics
              </h2>

              <p className="mt-2 text-zinc-500">
                Organizational execution velocity
              </p>
            </div>

            <div className="rounded-full bg-zinc-950 px-4 py-2 text-sm text-zinc-400">
              Live Data
            </div>
          </div>

          <div className="mt-10 h-[350px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={progressData}>
                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="progress"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">
                Approval Distribution
              </h2>

              <p className="mt-2 text-zinc-500">
                Goal approval workflow insights
              </p>
            </div>

            <div className="rounded-full bg-zinc-950 px-4 py-2 text-sm text-zinc-400">
              AI Analytics
            </div>
          </div>

          <div className="mt-10 flex h-[350px] items-center justify-center">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label
                >
                  {chartData.map(
                    (
                      entry,
                      index
                    ) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[index]
                        }
                      />
                    )
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">
              AI Executive Insight
            </h2>

            <p className="mt-2 text-zinc-500">
              Organization-wide intelligence summary
            </p>
          </div>

          <div
            className={`rounded-full px-4 py-2 text-sm ${
              approvalRate >= 80
                ? "bg-green-500/20 text-green-400"
                : approvalRate >= 60
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {approvalRate >= 80
              ? "Healthy"
              : approvalRate >= 60
              ? "Moderate"
              : "Critical"}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="text-lg leading-8 text-zinc-300">
            {approvalRate >= 80
              ? "Organizational performance indicators demonstrate strong execution consistency and healthy operational alignment across quarterly objectives."
              : approvalRate >= 60
              ? "Moderate execution risk identified. Increased managerial oversight and execution consistency improvements are recommended."
              : "Critical organizational execution risks detected. Immediate intervention and strategic recovery planning strongly recommended."}
          </p>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard({
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
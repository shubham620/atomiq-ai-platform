"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { createAuditLog } from "@/lib/audit";

import { toast } from "sonner";

export default function ManagerPage() {
  const [goals, setGoals] = useState<any[]>(
    []
  );

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

  const updateGoalStatus = async (
    id: string,
    status: string
  ) => {
    try {
      await updateDoc(doc(db, "goals", id), {
        status,
      });

      await createAuditLog({
        action: `${status} Goal`,
        user: "Manager",
        role: "manager",
        goal: id,
      });

      fetchGoals();

      toast.success(
        `Goal ${status.toLowerCase()} successfully`
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update goal"
      );
    }
  };

  const approvedGoals = goals.filter(
    (goal: any) =>
      goal.status === "Approved"
  ).length;

  const pendingGoals = goals.filter(
    (goal: any) =>
      goal.status === "Pending"
  ).length;

  const rejectedGoals = goals.filter(
    (goal: any) =>
      goal.status === "Rejected"
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold text-white">
            Manager Intelligence Hub
          </h1>

          <p className="mt-3 text-zinc-500">
            AI-powered team execution monitoring and approval governance
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 px-6 py-5">
          <p className="text-sm text-zinc-500">
            Avg Team Progress
          </p>

          <h2 className="mt-2 text-4xl font-bold text-blue-400">
            {avgProgress}%
          </h2>
        </div>
      </div>

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
          title="Rejected Goals"
          value={rejectedGoals}
          color="text-red-400"
        />

        <MetricCard
          title="High Risk Goals"
          value={highRiskGoals}
          color="text-orange-400"
        />
      </div>

      <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Team Performance Heatmap
            </h2>

            <p className="mt-2 text-zinc-500">
              Real-time organizational execution visibility
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

                <th className="pb-4">
                  Status
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

                    <td className="py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-3 w-40 overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className={`h-full ${
                              progress >= 80
                                ? "bg-green-500"
                                : progress >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>

                        <span className="text-white">
                          {progress}%
                        </span>
                      </div>
                    </td>

                    <td className="py-5">
                      <div
                        className={`inline-flex rounded-full px-3 py-1 text-sm ${
                          risk === "Low"
                            ? "bg-green-500/20 text-green-400"
                            : risk === "Moderate"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {risk}
                      </div>
                    </td>

                    <td className="py-5">
                      <div
                        className={`inline-flex rounded-full px-3 py-1 text-sm ${
                          goal.status ===
                          "Approved"
                            ? "bg-green-500/20 text-green-400"
                            : goal.status ===
                              "Rejected"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {goal.status}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6">
        {goals.map((goal: any) => {
          const progress =
            goal.progress || 0;

          const aiInsight =
            progress >= 80
              ? "Execution consistency is healthy and aligned with quarterly delivery expectations."
              : progress >= 50
              ? "Moderate execution risk detected. Increased milestone tracking recommended."
              : "Critical execution risk identified. Managerial intervention strongly recommended.";

          return (
            <div
              key={goal.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {goal.title}
                  </h2>

                  <p className="mt-3 text-zinc-500">
                    {goal.description}
                  </p>
                </div>

                <div
                  className={`rounded-2xl px-4 py-2 text-sm ${
                    goal.status ===
                    "Approved"
                      ? "bg-green-500/20 text-green-400"
                      : goal.status ===
                        "Rejected"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {goal.status}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <InfoCard
                  title="Employee"
                  value={goal.employee}
                />

                <InfoCard
                  title="Weightage"
                  value={`${goal.weightage}%`}
                />

                <InfoCard
                  title="Progress"
                  value={`${progress}%`}
                />

                <InfoCard
                  title="Target"
                  value={goal.target}
                />
              </div>

              <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-yellow-400">
                    AI Execution Insight
                  </p>

                  <div className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
                    AI Monitoring
                  </div>
                </div>

                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {aiInsight}
                </p>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() =>
                    updateGoalStatus(
                      goal.id,
                      "Approved"
                    )
                  }
                  className="rounded-2xl bg-green-500 px-6 py-3 font-semibold text-black transition hover:bg-green-400"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updateGoalStatus(
                      goal.id,
                      "Rejected"
                    )
                  }
                  className="rounded-2xl bg-red-500 px-6 py-3 font-semibold text-black transition hover:bg-red-400"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
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

function InfoCard({
  title,
  value,
}: any) {
  return (
    <div className="rounded-2xl bg-zinc-950 p-4">
      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <p className="mt-2 text-lg font-bold text-white">
        {value}
      </p>
    </div>
  );
}
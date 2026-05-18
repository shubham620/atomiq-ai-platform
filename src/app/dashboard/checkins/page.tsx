"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { useAuth } from "@/context/auth-context";

import { generateRecoveryStrategy } from "@/lib/ai";

import { createAuditLog } from "@/lib/audit";

import { toast } from "sonner";

export default function CheckInPage() {
  const { profile } = useAuth();

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

    const filteredGoals =
      profile?.role === "manager" ||
      profile?.role === "admin"
        ? goalData
        : goalData.filter(
            (goal: any) =>
              goal.employeeEmail ===
              profile?.email
          );

    setGoals(filteredGoals);
  };

  useEffect(() => {
    if (profile?.email) {
      fetchGoals();
    }
  }, [profile]);

  const handleProgressUpdate = async (
    id: string,
    progress: number,
    blocker: string
  ) => {
    try {
      await updateDoc(doc(db, "goals", id), {
        progress,
        blocker,
        lastCheckIn: new Date(),
      });

      await createAuditLog({
        action: "Updated Progress",
        user: profile?.name,
        role: profile?.role,
        goal: id,
      });

      fetchGoals();

      toast.success(
        "Check-in updated successfully"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update check-in"
      );
    }
  };

  const completedGoals = goals.filter(
    (goal: any) =>
      (goal.progress || 0) >= 100
  ).length;

  const highRiskGoals = goals.filter(
    (goal: any) =>
      (goal.progress || 0) < 50
  ).length;

  const moderateRiskGoals = goals.filter(
    (goal: any) =>
      (goal.progress || 0) >= 50 &&
      (goal.progress || 0) < 80
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
            Quarterly Check-Ins
          </h1>

          <p className="mt-3 text-zinc-500">
            {profile?.role === "employee"
              ? "AI-assisted execution tracking and recovery intelligence"
              : "Monitor execution risks and organizational performance health"}
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 px-6 py-5">
          <p className="text-sm text-zinc-500">
            Avg Progress
          </p>

          <h2 className="mt-2 text-4xl font-bold text-blue-400">
            {avgProgress}%
          </h2>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
        <MetricCard
          title="Total Goals"
          value={goals.length}
          color="text-white"
        />

        <MetricCard
          title="High Risk"
          value={highRiskGoals}
          color="text-red-400"
        />

        <MetricCard
          title="Moderate Risk"
          value={moderateRiskGoals}
          color="text-yellow-400"
        />

        <MetricCard
          title="Completed"
          value={completedGoals}
          color="text-green-400"
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6">
        {goals.map((goal: any) => (
          <CheckInCard
            key={goal.id}
            goal={goal}
            onUpdate={handleProgressUpdate}
            role={profile?.role}
          />
        ))}
      </div>
    </div>
  );
}

function CheckInCard({
  goal,
  onUpdate,
  role,
}: any) {
  const [progress, setProgress] =
    useState(goal.progress || 0);

  const [blocker, setBlocker] =
    useState(goal.blocker || "");

  const risk =
    progress >= 80
      ? "Low"
      : progress >= 50
      ? "Moderate"
      : "High";

  const aiInsight =
    generateRecoveryStrategy(
      progress,
      blocker
    );

  const healthScore =
    progress >= 80
      ? 92
      : progress >= 50
      ? 74
      : 41;

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">
            {goal.title}
          </h2>

          <p className="mt-3 text-zinc-500">
            {goal.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <div className="rounded-full bg-zinc-950 px-4 py-2 text-sm text-zinc-400">
              {goal.employee}
            </div>

            <div className="rounded-full bg-zinc-950 px-4 py-2 text-sm text-zinc-400">
              {goal.weightage}% Weightage
            </div>

            <div className="rounded-full bg-zinc-950 px-4 py-2 text-sm text-zinc-400">
              {goal.status}
            </div>
          </div>
        </div>

        <div
          className={`inline-flex rounded-full px-5 py-2 text-sm ${
            risk === "Low"
              ? "bg-green-500/20 text-green-400"
              : risk === "Moderate"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {risk} Risk
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Current Progress"
          value={`${progress}%`}
          color="text-blue-400"
        />

        <StatCard
          title="Goal Health"
          value={`${healthScore}%`}
          color="text-green-400"
        />

        <StatCard
          title="Execution Risk"
          value={risk}
          color={
            risk === "Low"
              ? "text-green-400"
              : risk === "Moderate"
              ? "text-yellow-400"
              : "text-red-400"
          }
        />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <p className="text-zinc-400">
            Goal Progress Tracking
          </p>

          <p className="font-bold text-white">
            {progress}%
          </p>
        </div>

        <div className="mt-3 h-4 overflow-hidden rounded-full bg-zinc-800">
          <div
            className={`h-full transition-all duration-500 ${
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
      </div>

      {role === "employee" && (
        <>
          <div className="mt-8">
            <label className="text-sm text-zinc-400">
              Update Progress
            </label>

            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) =>
                setProgress(
                  Number(e.target.value)
                )
              }
              className="mt-3 w-full"
            />

            <div className="mt-2 flex justify-between text-xs text-zinc-500">
              <span>0%</span>

              <span>50%</span>

              <span>100%</span>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm text-zinc-400">
              Blockers / Challenges
            </label>

            <textarea
              value={blocker}
              onChange={(e) =>
                setBlocker(
                  e.target.value
                )
              }
              placeholder="Describe blockers or execution challenges..."
              className="mt-2 min-h-[120px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-white outline-none"
            />
          </div>
        </>
      )}

      {role !== "employee" && (
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="flex items-center justify-between">
            <p className="font-medium text-white">
              Employee Blockers
            </p>

            <div className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
              Manager Visibility
            </div>
          </div>

          <p className="mt-4 whitespace-pre-line text-zinc-300">
            {blocker
              ? blocker
              : "No blockers reported"}
          </p>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="flex items-center justify-between">
          <p className="font-medium text-yellow-400">
            AI Recovery Intelligence
          </p>

          <div className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
            AI Analysis
          </div>
        </div>

        <div className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-400">
          {aiInsight}
        </div>
      </div>

      {role === "employee" && (
        <button
          onClick={() =>
            onUpdate(
              goal.id,
              progress,
              blocker
            )
          }
          className="mt-8 rounded-2xl bg-white px-8 py-4 font-semibold text-black transition hover:bg-zinc-200"
        >
          Submit Check-In
        </button>
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

function StatCard({
  title,
  value,
  color,
}: any) {
  return (
    <div className="rounded-2xl bg-zinc-950 p-5">
      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <h2
        className={`mt-3 text-3xl font-bold ${color}`}
      >
        {value}
      </h2>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { useAuth } from "@/context/auth-context";

import { generateSmartGoal } from "@/lib/ai";

import { createAuditLog } from "@/lib/audit";

import { toast } from "sonner";

export default function GoalsPage() {
  const { profile } = useAuth();

  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [target, setTarget] = useState("");

  const [weightage, setWeightage] =
    useState("");

  const [uom, setUom] =
    useState("Numeric");

  const [goals, setGoals] = useState<any[]>(
    []
  );

  const [aiLoading, setAiLoading] =
    useState(false);

  const fetchGoals = async () => {
    const snapshot = await getDocs(
      collection(db, "goals")
    );

    const goalData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filteredGoals = goalData.filter(
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

  const totalWeightage = goals.reduce(
    (acc: number, goal: any) =>
      acc + goal.weightage,
    0
  );

  const handleGenerateAI = async () => {
    if (!title) {
      toast.error(
        "Enter rough goal title first"
      );

      return;
    }

    try {
      setAiLoading(true);

      const response =
        await generateSmartGoal(title);

      setDescription(response);

      toast.success(
        "SMART goal generated successfully"
      );

      setAiLoading(false);
    } catch (error) {
      console.error(error);

      setAiLoading(false);

      toast.error(
        "AI generation failed"
      );
    }
  };

  const handleCreateGoal = async () => {
    if (
      !title ||
      !description ||
      !target
    ) {
      toast.error(
        "Please fill all fields"
      );

      return;
    }

    if (goals.length >= 8) {
      toast.error(
        "Maximum 8 goals allowed"
      );

      return;
    }

    if (Number(weightage) < 10) {
      toast.error(
        "Minimum weightage should be 10%"
      );

      return;
    }

    if (
      totalWeightage +
        Number(weightage) >
      100
    ) {
      toast.error(
        "Total weightage cannot exceed 100%"
      );

      return;
    }

    try {
      await addDoc(collection(db, "goals"), {
        title,
        description,
        target,
        weightage: Number(weightage),
        uom,
        employee: profile?.name,
        employeeEmail: profile?.email,
        role: profile?.role,
        createdAt: new Date(),
        status: "Pending",

        progress: 0,
        blocker: "",
        lastCheckIn: null,
      });

      await createAuditLog({
        action: "Created Goal",
        user: profile?.name,
        role: profile?.role,
        goal: title,
      });

      toast.success(
        "Goal created successfully"
      );

      setTitle("");
      setDescription("");
      setTarget("");
      setWeightage("");
      setUom("Numeric");

      fetchGoals();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to create goal"
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold text-white">
            Goal Management
          </h1>

          <p className="mt-3 text-zinc-500">
            Create and manage organizational goals
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 px-6 py-5">
          <p className="text-sm text-zinc-500">
            Total Weightage
          </p>

          <h2 className="mt-2 text-4xl font-bold text-green-400">
            {totalWeightage}%
          </h2>
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm text-zinc-400">
              Goal Title
            </label>

            <input
              type="text"
              placeholder="Enter goal title"
              className="mt-2 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-white outline-none"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

            <button
              onClick={handleGenerateAI}
              className="mt-3 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-white transition hover:bg-zinc-800"
            >
              {aiLoading
                ? "Generating..."
                : "Generate SMART Goal with AI"}
            </button>
          </div>

          <div>
            <label className="text-sm text-zinc-400">
              Target
            </label>

            <input
              type="text"
              placeholder="Enter target"
              className="mt-2 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-white outline-none"
              value={target}
              onChange={(e) =>
                setTarget(e.target.value)
              }
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">
              Weightage (%)
            </label>

            <input
              type="number"
              placeholder="10 - 100"
              className="mt-2 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-white outline-none"
              value={weightage}
              onChange={(e) =>
                setWeightage(e.target.value)
              }
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">
              Unit of Measurement
            </label>

            <select
              className="mt-2 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-white outline-none"
              value={uom}
              onChange={(e) =>
                setUom(e.target.value)
              }
            >
              <option>Numeric</option>

              <option>%</option>

              <option>Timeline</option>

              <option>Zero-based</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm text-zinc-400">
            Description
          </label>

          <textarea
            placeholder="Enter goal description"
            className="mt-2 min-h-[160px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-white outline-none"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-zinc-500">
            Goals Created: {goals.length}/8
          </div>

          <button
            onClick={handleCreateGoal}
            className="rounded-2xl bg-white px-8 py-4 font-semibold text-black transition hover:bg-zinc-200"
          >
            Create Goal
          </button>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-4xl font-bold text-white">
          My Goals
        </h2>

        {goals.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-zinc-800 bg-zinc-900 p-12 text-center">
            <h3 className="text-2xl font-semibold text-white">
              No Goals Created
            </h3>

            <p className="mt-3 text-zinc-500">
              Start by creating your first organizational goal.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {goals.map((goal: any) => {
              const healthScore =
                goal.progress >= 80
                  ? 92
                  : goal.progress >= 50
                  ? 76
                  : 48;

              const confidence =
                goal.progress >= 80
                  ? 95
                  : goal.progress >= 50
                  ? 81
                  : 58;

              const risk =
                healthScore > 85
                  ? "Low"
                  : healthScore > 75
                  ? "Moderate"
                  : "High";

              return (
                <div
                  key={goal.id}
                  className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {goal.title}
                      </h3>

                      <p className="mt-2 text-zinc-500">
                        {goal.description}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-zinc-950 px-4 py-2 text-sm text-zinc-400">
                      {goal.status}
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-zinc-950 p-5">
                      <p className="text-sm text-zinc-500">
                        Goal Health
                      </p>

                      <h2 className="mt-3 text-4xl font-bold text-green-400">
                        {healthScore}%
                      </h2>
                    </div>

                    <div className="rounded-2xl bg-zinc-950 p-5">
                      <p className="text-sm text-zinc-500">
                        AI Confidence
                      </p>

                      <h2 className="mt-3 text-4xl font-bold text-blue-400">
                        {confidence}%
                      </h2>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-yellow-400">
                        AI Insight
                      </p>

                      <div
                        className={`rounded-full px-3 py-1 text-xs ${
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

                    <p className="mt-3 text-sm text-zinc-400">
                      {goal.progress >= 80
                        ? "Execution consistency is strong with healthy delivery velocity."
                        : goal.progress >= 50
                        ? "Moderate execution risk detected. Increased weekly consistency recommended."
                        : "High execution risk identified. Recovery strategy intervention recommended."}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-500">
                        Weightage
                      </p>

                      <p className="text-xl font-bold text-white">
                        {goal.weightage}%
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-zinc-500">
                        UoM
                      </p>

                      <p className="text-xl font-bold text-white">
                        {goal.uom}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-zinc-500">
                        Target
                      </p>

                      <p className="text-xl font-bold text-white">
                        {goal.target}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
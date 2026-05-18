"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);

  const fetchLogs = async () => {
    const snapshot = await getDocs(
      collection(db, "auditLogs")
    );

    const logData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setLogs(logData.reverse());
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-5xl font-bold text-white">
          Audit Logs
        </h1>

        <p className="mt-3 text-zinc-500">
          Enterprise activity monitoring and governance tracking
        </p>
      </div>

      <div className="mt-10 space-y-6">
        {logs.map((log: any) => (
          <div
            key={log.id}
            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {log.action}
                </h2>

                <p className="mt-2 text-zinc-500">
                  Goal: {log.goal}
                </p>
              </div>

              <div className="rounded-full bg-zinc-950 px-4 py-2 text-sm text-zinc-400">
                {log.role}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">
                  User
                </p>

                <p className="mt-1 text-lg font-bold text-white">
                  {log.user}
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">
                  Timestamp
                </p>

                <p className="mt-1 text-lg font-bold text-white">
                  {new Date(
                    log.timestamp?.seconds *
                      1000
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
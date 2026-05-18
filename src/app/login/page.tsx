"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-10 shadow-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-white">
            ATOMIQ
          </h1>

          <p className="mt-3 text-zinc-500">
            AI-Powered Performance Intelligence
          </p>
        </div>

        <div className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-white outline-none focus:border-zinc-600"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-white outline-none focus:border-zinc-600"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            onClick={handleLogin}
            className="w-full rounded-2xl bg-white py-4 font-semibold text-black transition hover:bg-zinc-200"
          >
            Login
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
  <p className="text-sm font-medium text-zinc-300">
    Demo Credentials
  </p>

  <div className="mt-4 space-y-4 text-sm">
    
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="font-semibold text-blue-400">
        Employee
      </p>

      <p className="mt-2 text-zinc-400">
        Email: employee@atomiq.com
      </p>

      <p className="text-zinc-400">
        Password: employee123
      </p>
    </div>

    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="font-semibold text-green-400">
        Manager
      </p>

      <p className="mt-2 text-zinc-400">
        Email: manager@atomiq.com
      </p>

      <p className="text-zinc-400">
        Password: manager123
      </p>
    </div>

    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="font-semibold text-purple-400">
        Admin
      </p>

      <p className="mt-2 text-zinc-400">
        Email: admin@atomiq.com
      </p>

      <p className="text-zinc-400">
        Password: admin123
      </p>
    </div>
  </div>
</div>
      </div>
    </main>
  );
}
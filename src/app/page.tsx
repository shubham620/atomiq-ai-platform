import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-7xl font-bold">
          ATOMIQ
        </h1>

        <p className="mt-4 text-xl text-zinc-500">
          AI-Powered Performance Intelligence Platform
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-2xl bg-white px-8 py-4 font-semibold text-black transition hover:bg-zinc-200"
          >
            Login
          </Link>

         
        </div>
      </div>
    </main>
  );
}

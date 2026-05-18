import type { Metadata } from "next";

import "./globals.css";

import { Toaster } from "sonner";

import { AuthProvider } from "@/context/auth-context";

export const metadata: Metadata = {
  title: "ATOMIQ",
  description:
    "AI-Powered Performance Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Toaster
          richColors
          position="top-right"
        />

        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
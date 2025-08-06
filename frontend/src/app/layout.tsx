import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game Store",
  description: "A simple game store application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

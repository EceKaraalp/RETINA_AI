import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Retina AI",
  description: "Profesyonel bir klinik web sitesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={cn(
            `
            min-h-screen
            font-sans
            antialiased
            bg-gradient-to-br
            from-slate-100
            via-blue-50/70
            to-indigo-200
            `,
          inter.variable
        )}
      >
        <div className="min-h-screen w-full">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
